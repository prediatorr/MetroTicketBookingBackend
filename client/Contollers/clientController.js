const Station = require("../../models/station");
const dotenv = require("dotenv");
const Ticket = require("../../models/ticket");
const QRCode = require("qrcode");
const Razorpay = require("razorpay");
const crypto = require("crypto");

dotenv.config();

// Get Stations
const getStations = async (req, res) => {
  try {
    const stations = await Station.find();
    res.status(200).json(stations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Replace with your Razorpay Key Secret
});

// Book Ticket
const bookTicket = async (req, res) => {
  try {
    const { departure, destination, passengers } = req.body;

    // Check for both departure-to-destination and destination-to-departure routes
    let station = await Station.findOne({ from: departure, to: destination });

    // If no route found, check the reverse (destination to departure)
    if (!station) {
      station = await Station.findOne({ from: destination, to: departure });
    }

    if (!station) return res.status(404).json({ message: "Route not found" });

    const totalFare = station.fare * passengers;

    // Create an order in Razorpay
    const options = {
      amount: totalFare * 100, // Razorpay accepts amount in paise
      currency: "INR",
      receipt: `${Date.now()}`,
      payment_capture: 1, // Automatic capture after successful payment
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      orderId: order.id,
      amount: totalFare,
      currency: "INR",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStations, bookTicket };
