const DishJudgment = require("../models/DishJudgment");
const Dish = require("../models/Dish");
const Restaurant = require("../models/Restaurant");

// Get all judgments
exports.getAllJudgments = async (req, res) => {
  try {
    const judgments = await DishJudgment.find({ user: req.user._id })
      .populate("dish")
      .populate("restaurant")
      .sort({ date: -1 });

    res.json(judgments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get judgment by ID
exports.getJudgmentById = async (req, res) => {
  try {
    const judgment = await DishJudgment.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate("dish")
      .populate("restaurant");

    if (!judgment) {
      return res.status(404).json({ message: "Judgment not found" });
    }

    res.json(judgment);
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Judgment not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new judgment
exports.createJudgment = async (req, res) => {
  try {
    const {
      dish,
      restaurant,
      date,
      overallFlavorExperience,
      ingredientQuality,
      textureMouthfeel,
      executionCraftsmanship,
      valueForMoney,
      cravingReorderLikelihood,
      notes,
    } = req.body;

    console.log("Creating judgment with data:", req.body);

    // Verify dish exists
    const dishExists = await Dish.findById(dish);
    if (!dishExists) {
      return res.status(404).json({ message: "Dish not found" });
    }

    // Verify restaurant exists
    const restaurantExists = await Restaurant.findById(restaurant);
    if (!restaurantExists) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Ensure values are numbers
    const ratingFields = {
      overallFlavorExperience: parseInt(overallFlavorExperience),
      ingredientQuality: parseInt(ingredientQuality),
      textureMouthfeel: parseInt(textureMouthfeel),
      executionCraftsmanship: parseInt(executionCraftsmanship),
      valueForMoney: parseInt(valueForMoney),
      cravingReorderLikelihood: parseInt(cravingReorderLikelihood),
    };

    // Calculate weighted overall score
    // Weights: flavor (30%), quality (15%), texture (15%), execution (15%), value (15%), craving (10%)
    const weights = {
      overallFlavorExperience: 0.3,
      ingredientQuality: 0.15,
      textureMouthfeel: 0.15,
      executionCraftsmanship: 0.15,
      valueForMoney: 0.15,
      cravingReorderLikelihood: 0.1,
    };

    let weightedSum = 0;
    for (const [field, value] of Object.entries(ratingFields)) {
      weightedSum += value * weights[field];
    }

    // Round to 1 decimal place
    ratingFields.overallScore = Math.round(weightedSum * 10) / 10;

    // Validate rating values
    for (const [field, value] of Object.entries(ratingFields)) {
      if (isNaN(value)) {
        return res.status(400).json({
          message: `Invalid value for ${field}. Must be a number.`,
          errors: { [field]: { message: "Must be a number" } },
        });
      }

      // All rating fields now have max of 5
      const max = 5;
      if (value < 1 || value > max) {
        return res.status(400).json({
          message: `${field} must be between 1 and ${max}`,
          errors: { [field]: { message: `Must be between 1 and ${max}` } },
        });
      }
    }

    const newJudgment = new DishJudgment({
      dish,
      restaurant,
      date: date || Date.now(),
      ...ratingFields,
      notes,
      user: req.user._id,
    });

    const judgment = await newJudgment.save();

    // Populate dish and restaurant data
    await judgment.populate("dish");
    await judgment.populate("restaurant");

    console.log("Judgment created successfully:", judgment);
    res.status(201).json(judgment);
  } catch (error) {
    console.error("Error creating judgment:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// Update a judgment
exports.updateJudgment = async (req, res) => {
  try {
    const {
      dish,
      restaurant,
      date,
      overallFlavorExperience,
      ingredientQuality,
      textureMouthfeel,
      executionCraftsmanship,
      valueForMoney,
      cravingReorderLikelihood,
      notes,
    } = req.body;

    console.log("Updating judgment with data:", req.body);

    // Build judgment object
    const judgmentFields = {};
    if (dish) {
      // Verify dish exists
      const dishExists = await Dish.findById(dish);
      if (!dishExists) {
        return res.status(404).json({ message: "Dish not found" });
      }
      judgmentFields.dish = dish;
    }

    if (restaurant) {
      // Verify restaurant exists
      const restaurantExists = await Restaurant.findById(restaurant);
      if (!restaurantExists) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      judgmentFields.restaurant = restaurant;
    }

    if (date) judgmentFields.date = date;

    // Process rating fields
    const ratingFields = {
      overallFlavorExperience,
      ingredientQuality,
      textureMouthfeel,
      executionCraftsmanship,
      valueForMoney,
      cravingReorderLikelihood,
    };

    // Validate and add each rating field
    const parsedRatings = {};
    let canCalculateOverall = true;

    for (const [field, value] of Object.entries(ratingFields)) {
      if (value !== undefined) {
        const numValue = parseInt(value);

        if (isNaN(numValue)) {
          return res.status(400).json({
            message: `Invalid value for ${field}. Must be a number.`,
            errors: { [field]: { message: "Must be a number" } },
          });
        }

        // All ratings now have max of 5
        const max = 5;
        if (numValue < 1 || numValue > max) {
          return res.status(400).json({
            message: `${field} must be between 1 and ${max}`,
            errors: { [field]: { message: `Must be between 1 and ${max}` } },
          });
        }

        parsedRatings[field] = numValue;
        judgmentFields[field] = numValue;
      } else {
        // If any rating is missing, we can't calculate the overall score
        canCalculateOverall = false;
      }
    }

    // Calculate weighted overall score if all ratings are provided
    if (canCalculateOverall && Object.keys(parsedRatings).length === 6) {
      // Weights: flavor (30%), quality (15%), texture (15%), execution (15%), value (15%), craving (10%)
      const weights = {
        overallFlavorExperience: 0.3,
        ingredientQuality: 0.15,
        textureMouthfeel: 0.15,
        executionCraftsmanship: 0.15,
        valueForMoney: 0.15,
        cravingReorderLikelihood: 0.1,
      };

      let weightedSum = 0;
      for (const [field, value] of Object.entries(parsedRatings)) {
        weightedSum += value * weights[field];
      }

      // Round to 1 decimal place
      judgmentFields.overallScore = Math.round(weightedSum * 10) / 10;
    } else if (Object.keys(parsedRatings).length > 0) {
      // For partial updates, get the existing judgment and recalculate if we have all ratings
      const existingJudgment = await DishJudgment.findById(req.params.id);
      const completeRatings = {
        ...existingJudgment.toObject(),
        ...parsedRatings,
      };

      // Only calculate if all required ratings are available
      if (
        completeRatings.overallFlavorExperience &&
        completeRatings.ingredientQuality &&
        completeRatings.textureMouthfeel &&
        completeRatings.executionCraftsmanship &&
        completeRatings.valueForMoney &&
        completeRatings.cravingReorderLikelihood
      ) {
        const weights = {
          overallFlavorExperience: 0.3,
          ingredientQuality: 0.15,
          textureMouthfeel: 0.15,
          executionCraftsmanship: 0.15,
          valueForMoney: 0.15,
          cravingReorderLikelihood: 0.1,
        };

        let weightedSum = 0;
        for (const field of Object.keys(weights)) {
          weightedSum += completeRatings[field] * weights[field];
        }

        // Round to 1 decimal place
        judgmentFields.overallScore = Math.round(weightedSum * 10) / 10;
      }
    }

    if (notes !== undefined) judgmentFields.notes = notes;

    let judgment = await DishJudgment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!judgment) {
      return res.status(404).json({ message: "Judgment not found" });
    }

    judgment = await DishJudgment.findByIdAndUpdate(
      req.params.id,
      { $set: judgmentFields },
      { new: true }
    )
      .populate("dish")
      .populate("restaurant");

    console.log("Judgment updated successfully:", judgment);
    res.json(judgment);
  } catch (error) {
    console.error("Error updating judgment:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// Delete a judgment
exports.deleteJudgment = async (req, res) => {
  try {
    let judgment = await DishJudgment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!judgment) {
      return res.status(404).json({ message: "Judgment not found" });
    }

    await DishJudgment.findByIdAndRemove(req.params.id);

    res.json({ message: "Judgment removed" });
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Judgment not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
