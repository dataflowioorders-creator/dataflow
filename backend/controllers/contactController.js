import { sendContactEmailNotification } from '../config/mailer.js';

// @desc    Send a contact message to admin email
// @route   POST /api/contact
// @access  Public
export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    // Send email to admin
    await sendContactEmailNotification({ name, email, message });

    res.json({ message: 'Your message has been transmitted successfully. We will respond shortly.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
