const mongoose = require("mongoose");

const dishRatingSchema = new mongoose.Schema(
  {
    dish: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dish",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    overallFlavorExperience: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    ingredientQuality: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    textureMouthfeel: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    executionCraftsmanship: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    valueForMoney: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    cravingReorderLikelihood: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    overallScore: {
      type: Number,
      min: 1,
      max: 5,
    },
    notes: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const DishRating = mongoose.model("DishRating", dishRatingSchema);

module.exports = DishRating;
