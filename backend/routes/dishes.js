const express = require("express");
const router = express.Router();
const dishController = require("../controllers/dishController");
const auth = require("../middleware/auth");

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/dishes
// @desc    Get all dishes
// @access  Private
router.get("/", dishController.getAllDishes);

// @route   GET /api/dishes/:id
// @desc    Get dish by ID
// @access  Private
router.get("/:id", dishController.getDishById);

// @route   POST /api/dishes
// @desc    Create a new dish
// @access  Private
router.post("/", dishController.createDish);

// @route   PUT /api/dishes/:id
// @desc    Update a dish
// @access  Private
router.put("/:id", dishController.updateDish);

// @route   DELETE /api/dishes/:id
// @desc    Delete a dish
// @access  Private
router.delete("/:id", dishController.deleteDish);

module.exports = router;
