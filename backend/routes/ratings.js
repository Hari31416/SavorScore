const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const auth = require("../middleware/auth");

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/ratings
// @desc    Get all ratings
// @access  Private
router.get("/", ratingController.getAllRatings);

// @route   GET /api/ratings/:id
// @desc    Get rating by ID
// @access  Private
router.get("/:id", ratingController.getRatingById);

// @route   POST /api/ratings
// @desc    Create a new rating
// @access  Private
router.post("/", ratingController.createRating);

// @route   PUT /api/ratings/:id
// @desc    Update a rating
// @access  Private
router.put("/:id", ratingController.updateRating);

// @route   DELETE /api/ratings/:id
// @desc    Delete a rating
// @access  Private
router.delete("/:id", ratingController.deleteRating);

module.exports = router;
