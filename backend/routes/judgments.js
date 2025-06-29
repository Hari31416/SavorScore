const express = require("express");
const router = express.Router();
const judgmentController = require("../controllers/judgmentController");
const auth = require("../middleware/auth");

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/judgments
// @desc    Get all judgments
// @access  Private
router.get("/", judgmentController.getAllJudgments);

// @route   GET /api/judgments/:id
// @desc    Get judgment by ID
// @access  Private
router.get("/:id", judgmentController.getJudgmentById);

// @route   POST /api/judgments
// @desc    Create a new judgment
// @access  Private
router.post("/", judgmentController.createJudgment);

// @route   PUT /api/judgments/:id
// @desc    Update a judgment
// @access  Private
router.put("/:id", judgmentController.updateJudgment);

// @route   DELETE /api/judgments/:id
// @desc    Delete a judgment
// @access  Private
router.delete("/:id", judgmentController.deleteJudgment);

module.exports = router;
