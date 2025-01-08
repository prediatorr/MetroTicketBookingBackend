const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token found, return error
    if (!token) {
      return res.status(401).json({
        message: 'Not authorized - no token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get admin from token
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({
        message: 'Not authorized - invalid token'
      });
    }

    // Check if admin is verified
    if (!admin.isVerified) {
      return res.status(401).json({
        message: 'Not authorized - email not verified'
      });
    }

    // Add admin to request object
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Not authorized - token failed'
    });
  }
};

module.exports = { protect };