const Station = require("../../models/station");
const Admin = require("../../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Admin Signup
const adminSignup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    const admin = await Admin.create({ email, password });
    res
      .status(201)
      .json({ message: "Admin registered successfully", adminId: admin._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add New Station
const addStation = async (req, res) => {
  try {
    const { from, to, distance } = req.body;
    const fare = distance * 6; // Fare calculation logic
    const station = await Station.create({ from, to, distance, fare });
    res.status(201).json(station);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Universal Fare Update
const updateFare = async (req, res) => {
  try {
    const { ratePerKm } = req.body;
    const stations = await Station.find();
    for (const station of stations) {
      station.fare = station.distance * ratePerKm;
      await station.save();
    }
    res.status(200).json({ message: "Fares updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { adminSignup, adminLogin, addStation, updateFare };
