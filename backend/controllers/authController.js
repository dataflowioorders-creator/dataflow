import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { sendOTPEmailNotification } from '../config/mailer.js';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dataflow_secret_key_123', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const adminEmail = process.env.RECEIVER_EMAIL || 'dataflow.io.orders@gmail.com';
    const assignedRole = email.toLowerCase() === adminEmail.toLowerCase() ? 'admin' : 'customer';

    const userExists = await User.findOne({ email });

    if (userExists) {
      if (userExists.isVerified) {
        return res.status(400).json({ message: 'User already exists' });
      } else {
        // If user registered before but never verified, overwrite their profile or keep it
        userExists.name = name;
        userExists.password = password;
        userExists.role = assignedRole;
        await userExists.save();
      }
    } else {
      // Create user (defaults to isVerified: false)
      await User.create({
        name,
        email,
        password,
        role: assignedRole,
        isVerified: false,
      });
    }

    // Generate 6-digit verification code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save/Overwrite OTP code in database
    await OTP.findOneAndDelete({ email });
    await OTP.create({
      email,
      otp: otpCode,
    });

    // Dispatch verification code to email
    await sendOTPEmailNotification(email, otpCode);

    res.status(201).json({
      message: 'Verification OTP sent to email. Complete authentication to sign in.',
      email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP and activate user account
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP values are required.' });
    }

    // Find valid OTP record
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired verification code.' });
    }

    // Activate the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User profile not found.' });
    }

    user.isVerified = true;
    await user.save();

    // Clean up OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resend OTP verification code
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email address is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No registered account found with this email.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Account is already verified.' });
    }

    // Generate new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Refresh OTP record
    await OTP.findOneAndDelete({ email });
    await OTP.create({
      email,
      otp: otpCode,
    });

    // Dispatch email
    await sendOTPEmailNotification(email, otpCode);

    res.json({ message: 'A new verification OTP has been sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if account email is verified
    if (!user.isVerified) {
      // Trigger new OTP so user doesn't get stuck
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      await OTP.findOneAndDelete({ email });
      await OTP.create({ email, otp: otpCode });
      await sendOTPEmailNotification(email, otpCode);

      return res.status(403).json({
        message: 'Your email address is unverified. We sent a new verification code to your mailbox.',
        isUnverified: true,
        email: user.email,
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
