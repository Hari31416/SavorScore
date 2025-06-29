const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");
const auth = require("../middleware/auth");

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/restaurants
// @desc    Get all restaurants
// @access  Private
router.get("/", restaurantController.getAllRestaurants);

// @route   GET /api/restaurants/:id
// @desc    Get restaurant by ID
// @access  Private
router.get("/:id", restaurantController.getRestaurantById);

// @route   POST /api/restaurants
// @desc    Create a new restaurant
// @access  Private
router.post("/", restaurantController.createRestaurant);

// @route   PUT /api/restaurants/:id
// @desc    Update a restaurant
// @access  Private
router.put("/:id", restaurantController.updateRestaurant);

// @route   DELETE /api/restaurants/:id
// @desc    Delete a restaurant
// @access  Private
router.delete("/:id", restaurantController.deleteRestaurant);

module.exports = router;
