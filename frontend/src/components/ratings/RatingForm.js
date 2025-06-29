import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Card,
  Button,
  Alert,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getRatingById,
  createRating,
  updateRating,
  getRestaurants,
  getDishes,
} from "../../utils/api";
import { ThemeContext } from "../../context/ThemeContext";

const RatingInput = ({ name, max, value, onChange }) => {
  const [hoveredValue, setHoveredValue] = useState(null);
  const buttons = [];

  // Rating descriptors for tooltips
  const getDescription = (val) => {
    const descriptions = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
    return descriptions[val - 1];
  };

  for (let i = 1; i <= max; i++) {
    buttons.push(
      <OverlayTrigger
        key={i}
        placement="top"
        overlay={<Tooltip>{getDescription(i, max)}</Tooltip>}
      >
        <button
          type="button"
          className={`btn mx-1 ${
            i === value
              ? "btn-primary"
              : i < value
              ? "btn-info"
              : hoveredValue && i <= hoveredValue
              ? "btn-outline-info"
              : "btn-outline-secondary"
          }`}
          onClick={() => onChange(name, i)}
          onMouseEnter={() => setHoveredValue(i)}
          onMouseLeave={() => setHoveredValue(null)}
          aria-label={`Rate ${i} out of ${max} (${getDescription(i, max)})`}
        >
          {i}
        </button>
      </OverlayTrigger>
    );
  }

  return (
    <div className="rating-input d-flex align-items-center">
      <div
        className="btn-group me-3"
        role="group"
        aria-label={`Rating for ${name}`}
      >
        {buttons}
      </div>
      <span className="selected-rating ms-2 dark-mode-text">
        Selected: <strong>{value}</strong> / {max} ({getDescription(value, max)}
        )
      </span>
    </div>
  );
};

const RatingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [rating, setRating] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isEditMode = !!id;
  const { isDarkMode } = useContext(ThemeContext);

  // Get preselected values from location state (if navigated from restaurant or dish pages)
  const preselectedRestaurantId = location.state?.restaurantId || "";
  const preselectedDishId = location.state?.dishId || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch restaurants and dishes for dropdowns
        const [restaurantsData, dishesData] = await Promise.all([
          getRestaurants(),
          getDishes(),
        ]);

        setRestaurants(restaurantsData);
        setDishes(dishesData);

        // If in edit mode, fetch the rating
        if (isEditMode) {
          const ratingData = await getRatingById(id);
          setRating(ratingData);
        }
      } catch (error) {
        setError("Failed to fetch data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const initialValues = {
    dish: rating?.dish._id || preselectedDishId || "",
    restaurant: rating?.restaurant._id || preselectedRestaurantId || "",
    date: rating
      ? new Date(rating.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    overallFlavorExperience: rating?.overallFlavorExperience || 3,
    ingredientQuality: rating?.ingredientQuality || 3,
    textureMouthfeel: rating?.textureMouthfeel || 3,
    executionCraftsmanship: rating?.executionCraftsmanship || 3,
    valueForMoney: rating?.valueForMoney || 3,
    cravingReorderLikelihood: rating?.cravingReorderLikelihood || 3,
    notes: rating?.notes || "",
  };

  const validationSchema = Yup.object({
    dish: Yup.string().required("Dish is required"),
    restaurant: Yup.string().required("Restaurant is required"),
    date: Yup.date().required("Date is required"),
    overallFlavorExperience: Yup.number()
      .required("Overall Flavor Experience is required")
      .min(1, "Minimum is 1")
      .max(5, "Maximum is 5"),
    ingredientQuality: Yup.number()
      .required("Ingredient Quality is required")
      .min(1, "Minimum is 1")
      .max(5, "Maximum is 5"),
    textureMouthfeel: Yup.number()
      .required("Texture & Mouthfeel is required")
      .min(1, "Minimum is 1")
      .max(5, "Maximum is 5"),
    executionCraftsmanship: Yup.number()
      .required("Execution & Craftsmanship is required")
      .min(1, "Minimum is 1")
      .max(5, "Maximum is 5"),
    valueForMoney: Yup.number()
      .required("Value for Money is required")
      .min(1, "Minimum is 1")
      .max(5, "Maximum is 5"),
    cravingReorderLikelihood: Yup.number()
      .required("Craving & Reorder Likelihood is required")
      .min(1, "Minimum is 1")
      .max(5, "Maximum is 5"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("Submitting rating with values:", values);

      if (isEditMode) {
        await updateRating(id, values);
        toast.success("Rating updated successfully");
      } else {
        const newRating = await createRating(values);
        toast.success("Rating added successfully");
      }

      navigate("/ratings");
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error(
        error ||
          (isEditMode ? "Failed to update rating" : "Failed to add rating")
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="rating-form">
      <h1>{isEditMode ? "Edit Rating" : "Add Rating"}</h1>
      <Card className={`mb-4 ${isDarkMode ? "bg-dark text-white" : ""}`}>
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({
              isSubmitting,
              touched,
              errors,
              values,
              setFieldValue,
              isValid,
            }) => (
              <Form>
                <Row>
                  <Col md={4} className="mb-3">
                    <div className="form-group">
                      <label htmlFor="restaurant">Restaurant</label>
                      <Field
                        as="select"
                        id="restaurant"
                        name="restaurant"
                        className={`form-select ${
                          touched.restaurant && errors.restaurant
                            ? "is-invalid"
                            : ""
                        } ${isDarkMode ? "bg-dark text-white" : ""}`}
                      >
                        <option value="">Select Restaurant</option>
                        {restaurants.map((restaurant) => (
                          <option key={restaurant._id} value={restaurant._id}>
                            {restaurant.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="restaurant"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </Col>

                  <Col md={4} className="mb-3">
                    <div className="form-group">
                      <label htmlFor="dish">Dish</label>
                      <Field
                        as="select"
                        id="dish"
                        name="dish"
                        className={`form-select ${
                          touched.dish && errors.dish ? "is-invalid" : ""
                        } ${isDarkMode ? "bg-dark text-white" : ""}`}
                      >
                        <option value="">Select Dish</option>
                        {dishes.map((dish) => (
                          <option key={dish._id} value={dish._id}>
                            {dish.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="dish"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </Col>

                  <Col md={4} className="mb-3">
                    <div className="form-group">
                      <label htmlFor="date">Date</label>
                      <Field
                        type="date"
                        id="date"
                        name="date"
                        className={`form-control ${
                          touched.date && errors.date ? "is-invalid" : ""
                        } ${isDarkMode ? "bg-dark text-white" : ""}`}
                      />
                      <ErrorMessage
                        name="date"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </Col>
                </Row>

                <h4 className="mb-3 mt-4">Rating Criteria</h4>

                <div className="rating-criteria mb-4">
                  {/* Overall Flavor Experience */}
                  <div className="form-group mb-4">
                    <label>Overall Flavor Experience (1-5)</label>
                    <div className="mt-2">
                      <RatingInput
                        name="overallFlavorExperience"
                        max={5}
                        value={values.overallFlavorExperience}
                        onChange={setFieldValue}
                      />
                    </div>
                    <small className="form-text text-muted">
                      Rate the overall taste experience of the dish
                    </small>
                    <ErrorMessage
                      name="overallFlavorExperience"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Ingredient Quality */}
                  <div className="form-group mb-4">
                    <label>Ingredient Quality (1-5)</label>
                    <div className="mt-2">
                      <RatingInput
                        name="ingredientQuality"
                        max={5}
                        value={values.ingredientQuality}
                        onChange={setFieldValue}
                      />
                    </div>
                    <small className="form-text text-muted">
                      Rate the quality of ingredients used in the dish
                    </small>
                    <ErrorMessage
                      name="ingredientQuality"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Texture & Mouthfeel */}
                  <div className="form-group mb-4">
                    <label>Texture & Mouthfeel (1-5)</label>
                    <div className="mt-2">
                      <RatingInput
                        name="textureMouthfeel"
                        max={5}
                        value={values.textureMouthfeel}
                        onChange={setFieldValue}
                      />
                    </div>
                    <small className="form-text text-muted">
                      Rate the textural elements and mouthfeel of the dish
                    </small>
                    <ErrorMessage
                      name="textureMouthfeel"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Execution & Craftsmanship */}
                  <div className="form-group mb-4">
                    <label>Execution & Craftsmanship (1-5)</label>
                    <div className="mt-2">
                      <RatingInput
                        name="executionCraftsmanship"
                        max={5}
                        value={values.executionCraftsmanship}
                        onChange={setFieldValue}
                      />
                    </div>
                    <small className="form-text text-muted">
                      Rate the technical execution and craftsmanship of the dish
                    </small>
                    <ErrorMessage
                      name="executionCraftsmanship"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Value for Money */}
                  <div className="form-group mb-4">
                    <label>Value for Money (1-5)</label>
                    <div className="mt-2">
                      <RatingInput
                        name="valueForMoney"
                        max={5}
                        value={values.valueForMoney}
                        onChange={setFieldValue}
                      />
                    </div>
                    <small className="form-text text-muted">
                      Rate the value provided relative to the price
                    </small>
                    <ErrorMessage
                      name="valueForMoney"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Craving & Reorder Likelihood */}
                  <div className="form-group mb-4">
                    <label>Craving & Reorder Likelihood (1-5)</label>
                    <div className="mt-2">
                      <RatingInput
                        name="cravingReorderLikelihood"
                        max={5}
                        value={values.cravingReorderLikelihood}
                        onChange={setFieldValue}
                      />
                    </div>
                    <small className="form-text text-muted">
                      Rate how likely you would be to order this dish again
                    </small>
                    <ErrorMessage
                      name="cravingReorderLikelihood"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="notes">Notes</label>
                  <Field
                    as="textarea"
                    id="notes"
                    name="notes"
                    rows="4"
                    className={`form-control ${
                      isDarkMode ? "bg-dark text-white" : ""
                    }`}
                    placeholder="Add any additional notes about your experience with this dish..."
                  />
                </div>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/ratings")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || !isValid}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : isEditMode
                      ? "Update Rating"
                      : "Add Rating"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RatingForm;
