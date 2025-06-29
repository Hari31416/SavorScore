import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Auth Components
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

// Restaurant Components
import RestaurantList from "./components/restaurants/RestaurantList";
import RestaurantForm from "./components/restaurants/RestaurantForm";
import RestaurantDetail from "./components/restaurants/RestaurantDetail";

// Dish Components
import DishList from "./components/dishes/DishList";
import DishForm from "./components/dishes/DishForm";
import DishDetail from "./components/dishes/DishDetail";

// Rating Components
import RatingList from "./components/ratings/RatingList";
import RatingForm from "./components/ratings/RatingForm";
import RatingDetail from "./components/ratings/RatingDetail";

// Context
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { ThemeContext, ThemeProvider } from "./context/ThemeContext";
import PrivateRoute from "./components/auth/PrivateRoute";

// Pages
import Home from "./components/layout/Home";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

const AppContent = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className={`app-container ${isDarkMode ? "dark-theme" : "light-theme"}`}
    >
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/restaurants"
            element={
              <PrivateRoute>
                <RestaurantList />
              </PrivateRoute>
            }
          />
          <Route
            path="/restaurants/new"
            element={
              <PrivateRoute>
                <RestaurantForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/restaurants/:id"
            element={
              <PrivateRoute>
                <RestaurantDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/restaurants/:id/edit"
            element={
              <PrivateRoute>
                <RestaurantForm />
              </PrivateRoute>
            }
          />

          <Route
            path="/dishes"
            element={
              <PrivateRoute>
                <DishList />
              </PrivateRoute>
            }
          />
          <Route
            path="/dishes/new"
            element={
              <PrivateRoute>
                <DishForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/dishes/:id"
            element={
              <PrivateRoute>
                <DishDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/dishes/:id/edit"
            element={
              <PrivateRoute>
                <DishForm />
              </PrivateRoute>
            }
          />

          <Route
            path="/ratings"
            element={
              <PrivateRoute>
                <RatingList />
              </PrivateRoute>
            }
          />
          <Route
            path="/ratings/new"
            element={
              <PrivateRoute>
                <RatingForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/ratings/:id"
            element={
              <PrivateRoute>
                <RatingDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/ratings/:id/edit"
            element={
              <PrivateRoute>
                <RatingForm />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default App;
