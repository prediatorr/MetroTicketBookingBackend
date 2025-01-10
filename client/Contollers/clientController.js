const Station = require("../../models/station");
const dotenv = require("dotenv");
const Ticket = require("../../models/ticket");
const QRCode = require("qrcode");
const Razorpay = require("razorpay");
const crypto = require("crypto");

dotenv.config();

// Get Stations
const   getStations = async (req, res) => {
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

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      departure,
      destination,
      passengers,
      totalFare,
      isTestMode // Add this for testing
    } = req.body;

    // Skip signature verification if in test mode
    if (!isTestMode) {
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign)
        .digest("hex");

      if (razorpay_signature !== expectedSign) {
        return res.status(400).json({ message: "Invalid payment signature" });
      }
    }

    // Generate unique QR code data
    const qrData = JSON.stringify({
      ticketId: crypto.randomBytes(16).toString('hex'),
      departure,
      destination,
      passengers,
      totalFare,
      timestamp: Date.now()
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(qrData);

    // Create ticket in database
    const ticket = await Ticket.create({
      departure,
      destination,
      passengers,
      totalFare,
      qrCode: qrData,
      paymentId: razorpay_payment_id || 'test_payment_id',
      orderId: razorpay_order_id || 'test_order_id',
    });

    res.status(201).json({
      message: "Ticket booked successfully",
      ticket: {
        ...ticket.toObject(),
        qrCode: qrCode
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Verify Ticket QR Code
const verifyTicket = async (req, res) => {
  try {
    const { qrData } = req.body;

    // Parse QR data
    const ticketData = JSON.parse(qrData);

    // Find ticket in database
    const ticket = await Ticket.findOne({
      qrCode: qrData
    });

    if (!ticket) {
      return res.status(404).json({
        valid: false,
        message: "Invalid ticket"
      });
    }

    // Check if ticket is expired (optional: add your own expiration logic)
    const ticketAge = Date.now() - ticketData.timestamp;
    const isExpired = ticketAge > (24 * 60 * 60 * 1000); // 24 hours

    if (isExpired) {
      return res.status(400).json({
        valid: false,
        message: "Ticket has expired"
      });
    }

    res.status(200).json({
      valid: true,
      message: "Valid ticket",
      ticketDetails: {
        departure: ticket.departure,
        destination: ticket.destination,
        passengers: ticket.passengers,
        totalFare: ticket.totalFare,
        purchaseDate: new Date(ticketData.timestamp)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      valid: false,
      message: error.message 
    });
  }
};

module.exports = {
  getStations,
  bookTicket,
  verifyPayment,
  verifyTicket
};