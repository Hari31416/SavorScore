const DishRating = require("../models/DishRating");
const Dish = require("../models/Dish");
const Restaurant = require("../models/Restaurant");

// Get all ratings
exports.getAllRatings = async (req, res) => {
  try {
    const ratings = await DishRating.find({ user: req.user._id })
      .populate("dish")
      .populate("restaurant")
      .sort({ date: -1 });

    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get rating by ID
exports.getRatingById = async (req, res) => {
  try {
    const rating = await DishRating.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate("dish")
      .populate("restaurant");

    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.json(rating);
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Rating not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new rating
exports.createRating = async (req, res) => {
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

    console.log("Creating rating with data:", req.body);

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

    const newRating = new DishRating({
      dish,
      restaurant,
      date: date || Date.now(),
      ...ratingFields,
      notes,
      user: req.user._id,
    });

    const rating = await newRating.save();

    // Populate dish and restaurant data
    await rating.populate("dish");
    await rating.populate("restaurant");

    console.log("Rating created successfully:", rating);
    res.status(201).json(rating);
  } catch (error) {
    console.error("Error creating rating:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// Update a rating
exports.updateRating = async (req, res) => {
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

    console.log("Updating rating with data:", req.body);

    // Build rating object
    const ratingFields = {};
    if (dish) {
      // Verify dish exists
      const dishExists = await Dish.findById(dish);
      if (!dishExists) {
        return res.status(404).json({ message: "Dish not found" });
      }
      ratingFields.dish = dish;
    }

    if (restaurant) {
      // Verify restaurant exists
      const restaurantExists = await Restaurant.findById(restaurant);
      if (!restaurantExists) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      ratingFields.restaurant = restaurant;
    }

    if (date) ratingFields.date = date;

    // Process rating fields
    const ratingValues = {
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

    for (const [field, value] of Object.entries(ratingValues)) {
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
        ratingFields[field] = numValue;
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
      ratingFields.overallScore = Math.round(weightedSum * 10) / 10;
    } else if (Object.keys(parsedRatings).length > 0) {
      // For partial updates, get the existing rating and recalculate if we have all ratings
      const existingRating = await DishRating.findById(req.params.id);
      const completeRatings = {
        ...existingRating.toObject(),
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
        ratingFields.overallScore = Math.round(weightedSum * 10) / 10;
      }
    }

    if (notes !== undefined) ratingFields.notes = notes;

    let rating = await DishRating.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    rating = await DishRating.findByIdAndUpdate(
      req.params.id,
      { $set: ratingFields },
      { new: true }
    )
      .populate("dish")
      .populate("restaurant");

    console.log("Rating updated successfully:", rating);
    res.json(rating);
  } catch (error) {
    console.error("Error updating rating:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// Delete a rating
exports.deleteRating = async (req, res) => {
  try {
    let rating = await DishRating.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    await DishRating.findByIdAndRemove(req.params.id);

    res.json({ message: "Rating removed" });
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Rating not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
