const mongoose = require("mongoose");

const stationSchema = mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    distance: { type: Number, required: true },
    fare: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Station", stationSchema);
