const express = require("express");
const DriverCreds = require("./models/DriverCreds");
const router = express.Router();
const Trip = require("./Trip");

router.post("/createTrip", async (req, res) => {
  try {
    const {
      driver,
      startLocation,
      destination,
      seatsAvailable,
      pricePerSeat,
      date,
      description,
    } = req.body;

    console.log("Received trip data:", req.body);

    // Validate driver
    const driverExists = await DriverCreds.findById(driver);
    if (!driverExists) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const newTrip = new Trip({
      driver, // Associate trip with the driver
      driverName: driverExists.username, // ✅ Store Driver Name
      vehicle: driverExists.vehicle, // ✅ Store Vehicle Model
      startLocation,
      destination,
      seatsAvailable,
      pricePerSeat,
      date,
      description,
    });

    await newTrip.save();
    res
      .status(201)
      .json({ message: "Trip created successfully", trip: newTrip });
  } catch (error) {
    console.error("Error creating trip:", error);
    res
      .status(500)
      .json({ message: "Error creating trip", error: error.message });
  }
});

router.get("/trips/driver/:driverId", async (req, res) => {
  try {
    const { driverId } = req.params;
    const trips = await Trip.find({ driver: driverId }).select("-__v");
    res.status(200).json(trips);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching trips", error: error.message });
  }
});

router.put("/trips/:id/status", async (req, res) => {
  try {
    const tripId = req.params.id;
    const { status } = req.body;
    await Trip.findByIdAndUpdate(tripId, { status });
    res.status(200).json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
