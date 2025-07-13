import axios from "axios";

// Create axios instance with configurable base URL
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Restaurant API calls
export const getRestaurants = async () => {
  try {
    const response = await api.get("/api/restaurants");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching restaurants";
  }
};

export const getRestaurantById = async (id) => {
  try {
    const response = await api.get(`/api/restaurants/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching restaurant";
  }
};

export const createRestaurant = async (restaurantData) => {
  try {
    const response = await api.post("/api/restaurants", restaurantData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error creating restaurant";
  }
};

export const updateRestaurant = async (id, restaurantData) => {
  try {
    const response = await api.put(`/api/restaurants/${id}`, restaurantData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error updating restaurant";
  }
};

export const deleteRestaurant = async (id) => {
  try {
    await api.delete(`/api/restaurants/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data?.message || "Error deleting restaurant";
  }
};

// Dish API calls
export const getDishes = async () => {
  try {
    const response = await api.get("/api/dishes");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching dishes";
  }
};

export const getDishById = async (id) => {
  try {
    const response = await api.get(`/api/dishes/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching dish";
  }
};

export const createDish = async (dishData) => {
  try {
    const response = await api.post("/api/dishes", dishData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error creating dish";
  }
};

export const updateDish = async (id, dishData) => {
  try {
    const response = await api.put(`/api/dishes/${id}`, dishData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error updating dish";
  }
};

export const deleteDish = async (id) => {
  try {
    await api.delete(`/api/dishes/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data?.message || "Error deleting dish";
  }
};

// Rating API calls
export const getRatings = async () => {
  try {
    const response = await api.get("/api/ratings");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching ratings";
  }
};

export const getRatingById = async (id) => {
  try {
    const response = await api.get(`/api/ratings/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching rating";
  }
};

export const createRating = async (ratingData) => {
  try {
    console.log("Sending rating data:", ratingData);
    const response = await api.post("/api/ratings", ratingData);
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
    const response = await api.put(`/api/ratings/${id}`, ratingData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error updating rating";
  }
};

export const deleteRating = async (id) => {
  try {
    await api.delete(`/api/ratings/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data?.message || "Error deleting rating";
  }
};
