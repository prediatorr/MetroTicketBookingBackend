const express = require("express");
const {
  adminSignup,
  verifySignupOTP,
  adminLogin,
  verifyLoginOTP,
  addStation,
  updateFare,
} = require("../Contollers/adminContoller");
const router = express.Router();

// Admin authentication routes
router.post("/signup", adminSignup);
router.post("/verify-signup", verifySignupOTP);
router.post("/login", adminLogin);
router.post("/verify-login", verifyLoginOTP);

// Station management routes
router.post("/add-station", addStation);
router.put("/update-fare", updateFare);

module.exports = router;