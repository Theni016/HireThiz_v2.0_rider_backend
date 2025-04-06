// models/Trip.js
const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DriverCreds",
    required: true,
  },
  driverName: { type: String, required: true },
  vehicle: { type: String, required: true },

  bookings: [
    {
      passengerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PassengerCreds",
      },
      name: String,
      phone: String,
      seatsBooked: Number,
      payment: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending",
      },
    },
  ],
  startLocation: {
    latitude: Number,
    longitude: Number,
    address: String,
  },
  destination: {
    latitude: Number,
    longitude: Number,
    address: String,
  },
  seatsAvailable: { type: Number, required: true },
  pricePerSeat: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["Available", "In Progress", "Completed", "Cancelled"],
    default: "Available",
  },
});

module.exports = mongoose.model("Trip", TripSchema);
