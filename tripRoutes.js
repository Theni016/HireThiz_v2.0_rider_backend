const express = require("express");
const router = express.Router();
const TripController = require("../controllers/tripController");

// Create a new trip
router.post("/create", TripController.createTrip);

// Get all trips
router.get("/all", TripController.getAllTrips);

// Get a specific trip by ID
router.get("/:id", TripController.getTripById);

// Update a trip
router.put("/update/:id", TripController.updateTrip);

// Delete a trip
router.delete("/delete/:id", TripController.deleteTrip);

module.exports = router;
