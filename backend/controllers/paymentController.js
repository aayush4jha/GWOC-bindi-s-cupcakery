import Payment from '../models/paymentModel.js';
import { getFileById, deleteFileById } from '../config/gridfsConfig.js';

export const submitPayment = async (req, res) => {
  try {
    // Get user ID from token
    const userId = req.user._id;

    if (!req.body.transactionId || !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID and payment screenshot are required'
      });
    }

    // Check if transaction ID already exists
    const existingPayment = await Payment.findOne({ transactionId: req.body.transactionId });
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'This transaction ID has already been used'
      });
    }

    // Create payment record with the GridFS file ID
    const payment = new Payment({
      userId,
      amount: req.body.amount,
      transactionId: req.body.transactionId,
      screenshotId: req.file.id, // GridFS file ID
      paymentMethod: 'UPI',
    });

    await payment.save();

    res.status(201).json({
      success: true,
      message: 'Payment submitted successfully',
      payment
    });
  } catch (error) {
    console.error('Payment submission error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your payment',
      error: error.message
    });
  }
};

export const getPayments = async (req, res) => {
  try {
    const userId = req.user._id;
    const payments = await Payment.find({ userId });
    
    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching payment history',
      error: error.message
    });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if the user is authorized to view this payment
    if (payment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this payment'
      });
    }

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the payment',
      error: error.message
    });
  }
};

export const getScreenshot = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if the user is authorized to view this payment
    if (payment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this payment'
      });
    }

    // Get the file from GridFS
    const fileBuffer = await getFileById(payment.screenshotId);
    
    // Set appropriate content type
    // Note: In a real app, you'd store the mimetype in the DB
    res.set('Content-Type', 'image/jpeg');
    
    // Send the file
    res.send(fileBuffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the screenshot',
      error: error.message
    });
  }
};

// Admin controller to verify payments
export const verifyPayment = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can verify payments'
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "verified" or "rejected"'
      });
    }

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    payment.status = status;
    payment.verifiedAt = new Date();
    await payment.save();

    res.status(200).json({
      success: true,
      message: `Payment ${status} successfully`,
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while verifying the payment',
      error: error.message
    });
  }
};

// Delete payment and associated screenshot
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Only admin or the user who created the payment can delete it
    if (payment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this payment'
      });
    }

    // Delete the screenshot from GridFS
    await deleteFileById(payment.screenshotId);
    
    // Delete the payment document
    await Payment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Payment and screenshot deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the payment',
      error: error.message
    });
  }
};