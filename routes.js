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

router.get("/trips/:tripId/bookings", async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const bookings = trip.bookings || [];
    res.status(200).json({ passengers: bookings });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: err.message });
  }
});

router.put(
  "/trips/:tripId/bookings/:passengerIndex/payment",
  async (req, res) => {
    try {
      const { tripId, passengerIndex } = req.params;

      const trip = await Trip.findById(tripId);
      if (!trip) return res.status(404).json({ message: "Trip not found" });

      if (!trip.bookings[passengerIndex]) {
        return res.status(404).json({ message: "Booking not found" });
      }

      trip.bookings[passengerIndex].payment = "Completed";
      await trip.save();

      res.status(200).json({ message: "Payment confirmed" });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Failed to confirm payment", error: err.message });
    }
  }
);

router.get("/trips/:tripId", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    res.status(200).json(trip);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching trip", error: err.message });
  }
});

module.exports = router;
