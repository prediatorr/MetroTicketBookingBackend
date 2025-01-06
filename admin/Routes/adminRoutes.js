const express = require("express");
const {
  adminSignup,
  adminLogin,
  addStation,
  updateFare,
} = require("../Contollers/adminContoller");
const router = express.Router();

router.post("/signup", adminSignup);
router.post("/login", adminLogin);
router.post("/add-station", addStation);
router.put("/update-fare", updateFare);

module.exports = router;
