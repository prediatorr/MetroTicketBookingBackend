const express = require("express");
const {
  adminSignup,
  verifySignupOTP,
  adminLogin,
  verifyLoginOTP,
  addStation,
  updateFare,
} = require("../Contollers/adminContoller");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Public routes (no authentication required)
router.post("/signup", adminSignup);
router.post("/verify-signup", verifySignupOTP);
router.post("/login", adminLogin);
router.post("/verify-login", verifyLoginOTP);

// Protected routes (authentication required)
router.post("/add-station", protect, addStation);
router.put("/update-fare", protect, updateFare);

module.exports = router;