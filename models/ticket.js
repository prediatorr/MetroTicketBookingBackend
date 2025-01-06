const mongoose = require("mongoose");
const ticketSchema = mongoose.Schema(
  {
    departure: { type: String, required: true },
    destination: { type: String, required: true },
    passengers: { type: Number, required: true },
    totalFare: { type: Number, required: true },
    qrCode: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
