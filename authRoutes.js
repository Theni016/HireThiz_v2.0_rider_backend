const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const DriverCreds = require("./models/DriverCreds");
const authMiddleware = require("./middleware/authMiddleware");

const router = express.Router();
const JWT_SECRET = "your_secret_key";

// Driver Sign-Up
router.post("/driver/signup", async (req, res) => {
  try {
    const { email, password, username, vehicle, phoneNumber } = req.body;

    const existingDriver = await DriverCreds.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newDriver = new DriverCreds({
      email,
      password: hashedPassword,
      username,
      vehicle,
      phoneNumber,
    });
    await newDriver.save();

    res.status(201).json({ message: "Driver registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
});

// Driver Login
router.post("/driver/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const driver = await DriverCreds.findOne({ email });
    if (!driver) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: driver._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// Driver Profile - Get Logged-in User Info
router.get("/driver/profile", authMiddleware, async (req, res) => {
  try {
    const driver = await DriverCreds.findById(req.user.id).select("-password");
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.json(driver);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

module.exports = router;
