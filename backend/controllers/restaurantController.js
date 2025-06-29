const Restaurant = require("../models/Restaurant");

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ user: req.user._id });
    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get restaurant by ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new restaurant
exports.createRestaurant = async (req, res) => {
  try {
    const { name, address, cuisineType, phone, website } = req.body;

    const newRestaurant = new Restaurant({
      name,
      address,
      cuisineType,
      phone,
      website,
      user: req.user._id,
    });

    const restaurant = await newRestaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a restaurant
exports.updateRestaurant = async (req, res) => {
  try {
    const { name, address, cuisineType, phone, website } = req.body;

    // Build restaurant object
    const restaurantFields = {};
    if (name) restaurantFields.name = name;
    if (address) restaurantFields.address = address;
    if (cuisineType) restaurantFields.cuisineType = cuisineType;
    if (phone) restaurantFields.phone = phone;
    if (website) restaurantFields.website = website;

    let restaurant = await Restaurant.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { $set: restaurantFields },
      { new: true }
    );

    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a restaurant
exports.deleteRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    await Restaurant.findByIdAndRemove(req.params.id);

    res.json({ message: "Restaurant removed" });
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
