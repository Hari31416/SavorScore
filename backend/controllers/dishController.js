const Dish = require("../models/Dish");

// Get all dishes
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find({ user: req.user._id });
    res.json(dishes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get dish by ID
exports.getDishById = async (req, res) => {
  try {
    const dish = await Dish.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    res.json(dish);
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Dish not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new dish
exports.createDish = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    const newDish = new Dish({
      name,
      description,
      category,
      user: req.user._id,
    });

    const dish = await newDish.save();
    res.status(201).json(dish);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a dish
exports.updateDish = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    // Build dish object
    const dishFields = {};
    if (name) dishFields.name = name;
    if (description) dishFields.description = description;
    if (category) dishFields.category = category;

    let dish = await Dish.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    dish = await Dish.findByIdAndUpdate(
      req.params.id,
      { $set: dishFields },
      { new: true }
    );

    res.json(dish);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a dish
exports.deleteDish = async (req, res) => {
  try {
    let dish = await Dish.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    await Dish.findByIdAndRemove(req.params.id);

    res.json({ message: "Dish removed" });
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Dish not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
