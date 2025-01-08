/*
const Station = require("../../models/station");
const Admin = require("../../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const FareConfig = require("../../models/FareConfig");
const { generateOTP, sendOTP } = require("../../utils/otpUtils");


// Admin Signup
const adminSignup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Create admin with unverified status
    const admin = await Admin.create({
      email,
      password,
      otp,
      otpExpiry,
      isVerified: false,
    });

    // Send OTP
    await sendOTP(email, otp);

    res.status(201).json({
      message: "Admin registered. Please verify your email with OTP",
      adminId: admin._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Signup OTP
const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.otp !== otp || admin.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark admin as verified
    admin.isVerified = true;
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    await admin.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (!admin.isVerified) {
      return res.status(401).json({ message: "Email not verified" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate and send login OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    admin.otp = otp;
    admin.otpExpiry = otpExpiry;
    await admin.save();

    await sendOTP(email, otp);

    res.status(200).json({ message: "OTP sent for login verification" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Login OTP
const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.otp !== otp || admin.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    await admin.save();

    // Generate JWT token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Add Station
const addStation = async (req, res) => {
  try {
    const { from, to, distance } = req.body;

    // Fetch the current fare price
    const fareConfig = await FareConfig.findOne();
    if (!fareConfig) {
      return res
        .status(404)
        .json({ message: "Fare price configuration not found" });
    }

    const fare = distance * fareConfig.ratePerKm; // Dynamic fare calculation
    const station = await Station.create({ from, to, distance, fare });
    res.status(201).json(station);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update the fare prices
const updateFare = async (req, res) => {
  try {
    const { ratePerKm } = req.body;

    // Update the fare price in the FareConfig collection
    let fareConfig = await FareConfig.findOne();
    if (!fareConfig) {
      fareConfig = await FareConfig.create({ ratePerKm });
    } else {
      fareConfig.ratePerKm = ratePerKm;
      await fareConfig.save();
    }

    // Recalculate fares for all stations
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

module.exports = {
  adminSignup,
  verifySignupOTP,
  adminLogin,
  verifyLoginOTP,
  addStation,
  updateFare,
};
*/

const Station = require("../../models/station");
const Admin = require("../../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const FareConfig = require("../../models/FareConfig");
const { generateOTP, sendOTP } = require("../../utils/otpUtils");

// Admin Signup
const adminSignup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Create admin with unverified status
    const admin = await Admin.create({
      email,
      password,
      otp,
      otpExpiry,
      isVerified: false,
    });

    // Send OTP
    await sendOTP(email, otp);

    res.status(201).json({
      message: "Admin registered. Please verify your email with OTP",
      adminId: admin._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Signup OTP
const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.otp !== otp || admin.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark admin as verified
    admin.isVerified = true;
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    await admin.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (!admin.isVerified) {
      return res.status(401).json({ message: "Email not verified" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate and send login OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    admin.otp = otp;
    admin.otpExpiry = otpExpiry;
    await admin.save();

    await sendOTP(email, otp);

    res.status(200).json({ message: "OTP sent for login verification" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Login OTP
const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.otp !== otp || admin.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    await admin.save();

    // Generate JWT token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Station
// const addStation = async (req, res) => {
//   try {
//     const { from, to, distance } = req.body;

//     // Fetch the current fare price
//     const fareConfig = await FareConfig.findOne();
//     if (!fareConfig) {
//       return res
//         .status(404)
//         .json({ message: "Fare price configuration not found" });
//     }

//     const fare = distance * fareConfig.ratePerKm; // Dynamic fare calculation
//     const station = await Station.create({ from, to, distance, fare });
//     res.status(201).json(station);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Update the fare prices

const addStation = async (req, res) => {
  try {
    const { stations, distances } = req.body;

    // Validate input
    if (stations.length - 1 !== distances.length) {
      return res.status(400).json({
        message:
          "The number of distances must be one less than the number of stations.",
      });
    }

    // Fetch fare configuration
    const fareConfig = await FareConfig.findOne();
    if (!fareConfig) {
      return res
        .status(404)
        .json({ message: "Fare price configuration not found" });
    }
    const ratePerKm = fareConfig.ratePerKm;

    // Prepare the routes in O(N^2) time complexity by iterating over all pairs
    const routes = [];
    for (let i = 0; i < stations.length; i++) {
      for (let j = i + 1; j < stations.length; j++) {
        const from = stations[i];
        const to = stations[j];
        let totalDistance = 0;

        // Calculate total distance for this pair of stations
        for (let k = i; k < j; k++) {
          totalDistance += distances[k];
        }

        const fare = totalDistance * ratePerKm;

        // Create route document
        routes.push({ from, to, distance: totalDistance, fare });
      }
    }

    // Bulk insert all routes
    const insertedRoutes = await Station.insertMany(routes);

    res.status(201).json({
      message: "Routes added successfully",
      routes: insertedRoutes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFare = async (req, res) => {
  try {
    const { ratePerKm } = req.body;

    // Update the fare price in the FareConfig collection
    let fareConfig = await FareConfig.findOne();
    if (!fareConfig) {
      fareConfig = await FareConfig.create({ ratePerKm });
    } else {
      fareConfig.ratePerKm = ratePerKm;
      await fareConfig.save();
    }

    // Recalculate fares for all stations
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

module.exports = {
  adminSignup,
  verifySignupOTP,
  adminLogin,
  verifyLoginOTP,
  addStation,
  updateFare,
};