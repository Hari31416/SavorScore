import axios from "axios";

// Restaurant API calls
export const getRestaurants = async () => {
  try {
    const response = await axios.get("/api/restaurants");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching restaurants";
  }
};

export const getRestaurantById = async (id) => {
  try {
    const response = await axios.get(`/api/restaurants/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching restaurant";
  }
};

export const createRestaurant = async (restaurantData) => {
  try {
    const response = await axios.post("/api/restaurants", restaurantData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error creating restaurant";
  }
};

export const updateRestaurant = async (id, restaurantData) => {
  try {
    const response = await axios.put(`/api/restaurants/${id}`, restaurantData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error updating restaurant";
  }
};

export const deleteRestaurant = async (id) => {
  try {
    await axios.delete(`/api/restaurants/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data?.message || "Error deleting restaurant";
  }
};

// Dish API calls
export const getDishes = async () => {
  try {
    const response = await axios.get("/api/dishes");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching dishes";
  }
};

export const getDishById = async (id) => {
  try {
    const response = await axios.get(`/api/dishes/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching dish";
  }
};

export const createDish = async (dishData) => {
  try {
    const response = await axios.post("/api/dishes", dishData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error creating dish";
  }
};

export const updateDish = async (id, dishData) => {
  try {
    const response = await axios.put(`/api/dishes/${id}`, dishData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error updating dish";
  }
};

export const deleteDish = async (id) => {
  try {
    await axios.delete(`/api/dishes/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data?.message || "Error deleting dish";
  }
};

// Judgment API calls
export const getJudgments = async () => {
  try {
    const response = await axios.get("/api/judgments");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching judgments";
  }
};

export const getJudgmentById = async (id) => {
  try {
    const response = await axios.get(`/api/judgments/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching judgment";
  }
};

export const createJudgment = async (judgmentData) => {
  try {
    console.log("Sending judgment data:", judgmentData);
    const response = await axios.post("/api/judgments", judgmentData);
    console.log("Judgment creation response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Judgment creation error:",
      error.response?.data || error.message
    );
    throw error.response?.data?.message || "Error creating judgment";
  }
};

export const updateJudgment = async (id, judgmentData) => {
  try {
    const response = await axios.put(`/api/judgments/${id}`, judgmentData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error updating judgment";
  }
};

export const deleteJudgment = async (id) => {
  try {
    await axios.delete(`/api/judgments/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data?.message || "Error deleting judgment";
  }
};

// Rating API calls
export const getRatings = async () => {
  try {
    const response = await axios.get("/api/ratings");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching ratings";
  }
};

export const getRatingById = async (id) => {
  try {
    const response = await axios.get(`/api/ratings/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching rating";
  }
};

export const createRating = async (ratingData) => {
  try {
    console.log("Sending rating data:", ratingData);
    const response = await axios.post("/api/ratings", ratingData);
    console.log("Rating creation response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Rating creation error:",
      error.response?.data || error.message
    );
    throw error.response?.data?.message || "Error creating rating";
  }
};

export const updateRating = async (id, ratingData) => {
  try {
    const response = await axios.put(`/api/ratings/${id}`, ratingData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error updating rating";
  }
};

export const deleteRating = async (id) => {
  try {
    await axios.delete(`/api/ratings/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data?.message || "Error deleting rating";
  }
};
