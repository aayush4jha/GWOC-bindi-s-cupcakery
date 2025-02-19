import Order from '../models/orderModel.js';
import jwt from 'jsonwebtoken';

export const placeOrder = async (req, res) => {
  try {
    console.log("Received order request:", req.body);
    console.log("User from auth middleware:", req.user);

    const { address, items, amount } = req.body;

    // Create new order with userId from authenticated user
    const order = new Order({
      userId: req.user._id, // From auth middleware
      address,
      items,
      amount
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({
      success: false,
      message: "Error placing order",
      error: error.message
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
};