// First, update your userModel.js to initialize cartData:
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // ... your existing user fields ...
  cartData: {
    type: Map,
    of: Number,
    default: new Map() // Initialize as empty Map
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);

// Updated cartController.js
import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Initialize cartData if it doesn't exist
    if (!userData.cartData) {
      userData.cartData = new Map();
    }

    // Convert to regular object if it's a Map
    let cartData = userData.cartData instanceof Map ? 
      Object.fromEntries(userData.cartData) : 
      userData.cartData.toObject ? 
        userData.cartData.toObject() : 
        userData.cartData || {};

    // Update cart quantity
    cartData[itemId] = (cartData[itemId] || 0) + 1;

    // Update user's cart data
    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({
      success: true,
      message: "Added to Cart",
      cartData
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding to cart",
      error: error.message
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Initialize cartData if it doesn't exist
    if (!userData.cartData) {
      userData.cartData = new Map();
    }

    // Convert to regular object if it's a Map
    let cartData = userData.cartData instanceof Map ? 
      Object.fromEntries(userData.cartData) : 
      userData.cartData.toObject ? 
        userData.cartData.toObject() : 
        userData.cartData || {};

    // Update cart quantity
    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
      
      // Remove item if quantity is 0
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }

    // Update user's cart data
    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({
      success: true,
      message: "Removed from Cart",
      cartData
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: "Error removing from cart",
      error: error.message
    });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Missing user ID"
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Initialize cartData if it doesn't exist
    if (!userData.cartData) {
      userData.cartData = new Map();
    }

    // Convert to regular object if it's a Map
    let cartData = userData.cartData instanceof Map ? 
      Object.fromEntries(userData.cartData) : 
      userData.cartData.toObject ? 
        userData.cartData.toObject() : 
        userData.cartData || {};

    res.json({
      success: true,
      cartData
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message
    });
  }
};

export { addToCart, removeFromCart, getCart };