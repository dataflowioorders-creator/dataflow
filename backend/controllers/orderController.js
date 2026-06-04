import Order from '../models/Order.js';
import { sendOrderEmailNotification } from '../config/mailer.js';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public (Can be created by registered user or guest)
export const createOrder = async (req, res) => {
  try {
    const { name, email, phone, alternatePhone, service, description, deadline, budget } = req.body;

    let fileUrl = '';
    let fileName = '';

    if (req.file) {
      // Convert to Base64 to bypass ephemeral file systems
      const base64Data = req.file.buffer.toString('base64');
      fileUrl = `data:${req.file.mimetype};base64,${base64Data}`;
      fileName = req.file.originalname;
    }

    const order = new Order({
      user: req.user ? req.user._id : undefined, // Optional logged-in user reference
      name,
      email,
      phone,
      alternatePhone,
      service,
      description,
      fileUrl,
      fileName,
      deadline: new Date(deadline),
      budget,
    });

    const createdOrder = await order.save();
    
    // Dispatch automated email notification in background
    sendOrderEmailNotification(createdOrder);

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status and/or upload delivered project (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      if (status) {
        order.status = status;
      }
      
      if (req.file) {
        const base64Data = req.file.buffer.toString('base64');
        order.deliveredFileUrl = `data:${req.file.mimetype};base64,${base64Data}`;
        order.deliveredFileName = req.file.originalname;
        order.status = 'Completed'; // Automatically complete order on project upload
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Process order payment
// @route   PUT /api/orders/:id/pay
// @access  Private
export const payOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();

      if (req.file) {
        const base64Data = req.file.buffer.toString('base64');
        order.paymentScreenshotUrl = `data:${req.file.mimetype};base64,${base64Data}`;
        order.paymentScreenshotName = req.file.originalname;
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get order status (Public tracker)
// @route   GET /api/orders/tracker/:id
// @access  Public
export const getOrderStatusPublic = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid Order ID format' });
  }
};

// @desc    Fix project amount (Admin only)
// @route   PUT /api/orders/:id/fix-amount
// @access  Private/Admin
export const fixOrderAmount = async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.fixedAmount = amount;
      // When admin changes/sets price, reset acceptance state to let the user approve
      order.isAmountAccepted = false;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Accept fixed project amount (Private user)
// @route   PUT /api/orders/:id/accept-amount
// @access  Private
export const acceptOrderAmount = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isAmountAccepted = true;
      order.amountAcceptedAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Mark order as reviewed
// @route   PUT /api/orders/:id/reviewed
// @access  Public
export const markOrderReviewed = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isReviewed = true;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await order.deleteOne();
    res.json({ message: 'Order removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
