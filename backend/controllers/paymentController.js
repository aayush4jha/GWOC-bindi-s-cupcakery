import Payment from '../models/paymentModel.js';
import { getFileById, deleteFileById } from '../config/gridfsConfig.js';
import mongoose from 'mongoose';
import uploadMiddleware from '../middleware/uploadMiddleware.js';

export const submitPayment = async (req, res) => {
  console.log("Dddddbbbbb")
  console.log(req.body);
  try {
    const { transactionId, amount } = req.body;
    
    if (!transactionId || !amount || !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Create new payment record
    const payment = new Payment({
      userId: req.user._id,
      amount: parseFloat(amount),
      transactionId,
      screenshotId: req.file.id,
      status: 'pending',
      paymentMethod: 'UPI'
    });

    await payment.save();

    res.status(201).json({
      success: true,
      message: 'Payment submitted successfully',
      payment: {
        ...payment.toObject(),
        screenshot: `/api/payments/${payment._id}/screenshot`
      }
    });
  } catch (error) {
    console.error('Payment submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting payment',
      error: error.message
    });
  }
};

export const postPayment = async (req, res) => {
  try {
    const { userId, amount, currency, status } = req.body;

    if (!userId || !amount || !currency || !status) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const newPayment = new Payment({
      userId,
      amount: parseFloat(amount),
      currency,
      status,
      date: new Date()
    });

    await newPayment.save();

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      payment: newPayment
    });
  } catch (error) {
    console.error('Error posting payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving payment',
      error: error.message
    });
  }
};

export const getPayments = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { userId: req.user._id };
    
    const payments = await Payment.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments: payments.map(payment => ({
        ...payment.toObject(),
        screenshot: `/api/payments/${payment._id}/screenshot`
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message
    });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const query = {
      _id: req.params.id
    };
    
    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }

    const payment = await Payment.findOne(query)
      .populate('userId', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      payment: {
        ...payment.toObject(),
        screenshot: `/api/payments/${payment._id}/screenshot`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment',
      error: error.message
    });
  }
};

export const getScreenshot = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      ...(req.user.role !== 'admin' ? { userId: req.user._id } : {})
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const file = await getFileById(payment.screenshotId);
    
    res.set('Content-Type', 'image/jpeg');
    res.send(file);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching screenshot',
      error: error.message
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      {
        status,
        verifiedAt: status === 'verified' ? new Date() : undefined
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      payment: {
        ...payment.toObject(),
        screenshot: `/api/payments/${payment._id}/screenshot`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      ...(req.user.role !== 'admin' ? { userId: req.user._id } : {})
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    await deleteFileById(payment.screenshotId);
    
    await payment.deleteOne();

    res.json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting payment',
      error: error.message
    });
  }
};
