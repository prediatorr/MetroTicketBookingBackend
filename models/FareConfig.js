const mongoose = require("mongoose");

const fareConfigSchema = new mongoose.Schema({
  ratePerKm: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("FareConfig", fareConfigSchema);