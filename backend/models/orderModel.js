// orderModel.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    firstName: String,
    lastName: String,
    email: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    phone: String
  },
  items: [{
    _id: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'delivered'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);