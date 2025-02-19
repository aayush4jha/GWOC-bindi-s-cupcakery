import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; 

export const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  
  if (!token) {
    return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find the user to get full user object with role information
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    // Attach the full user object to the request
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const adminMiddleware = (req, res, next) => {
  // Check if user is authenticated and has admin role
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  
  next();
};

// For backwards compatibility if needed
export default authMiddleware;