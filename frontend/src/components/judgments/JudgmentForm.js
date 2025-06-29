import React, { useState, useEffect } from "react";
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
  getJudgmentById,
  createJudgment,
  updateJudgment,
  getRestaurants,
  getDishes,
} from "../../utils/api";

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
      <span className="selected-rating ms-2">
        Selected: <strong>{value}</strong> / {max} ({getDescription(value, max)}
        )
      </span>
    </div>
  );
};

const JudgmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [judgment, setJudgment] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isEditMode = !!id;

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

        // If in edit mode, fetch the judgment
        if (isEditMode) {
          const judgmentData = await getJudgmentById(id);
          setJudgment(judgmentData);
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
    dish: judgment?.dish._id || preselectedDishId || "",
    restaurant: judgment?.restaurant._id || preselectedRestaurantId || "",
    date: judgment
      ? new Date(judgment.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    overallFlavorExperience: judgment?.overallFlavorExperience || 3,
    ingredientQuality: judgment?.ingredientQuality || 3,
    textureMouthfeel: judgment?.textureMouthfeel || 3,
    executionCraftsmanship: judgment?.executionCraftsmanship || 3,
    valueForMoney: judgment?.valueForMoney || 3,
    cravingReorderLikelihood: judgment?.cravingReorderLikelihood || 3,
    notes: judgment?.notes || "",
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
    notes: Yup.string(),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Ensure all rating values are numbers
      const formattedValues = {
        ...values,
        overallFlavorExperience: Number(values.overallFlavorExperience),
        ingredientQuality: Number(values.ingredientQuality),
        textureMouthfeel: Number(values.textureMouthfeel),
        executionCraftsmanship: Number(values.executionCraftsmanship),
        valueForMoney: Number(values.valueForMoney),
        cravingReorderLikelihood: Number(values.cravingReorderLikelihood),
      };

      console.log("Submitting judgment values:", formattedValues);

      if (isEditMode) {
        await updateJudgment(id, formattedValues);
        toast.success("Judgment updated successfully");
      } else {
        await createJudgment(formattedValues);
        toast.success("Judgment created successfully");
      }
      navigate("/judgments");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error?.message || "An error occurred while saving the judgment"
      );

      // If we have validation errors from the backend, format them for formik
      if (error?.errors) {
        const formikErrors = {};
        Object.keys(error.errors).forEach((key) => {
          formikErrors[key] = error.errors[key].message;
        });
        setErrors(formikErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
        <div className="mt-3">
          <Button
            onClick={() => navigate("/judgments")}
            variant="outline-primary"
          >
            Back to Judgments
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-10">
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">
              {isEditMode ? "Edit Judgment" : "Add New Judgment"}
            </h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form>
                  <Row className="mb-4">
                    <Col md={6}>
                      <div className="form-group mb-3">
                        <label htmlFor="dish">Dish*</label>
                        <Field
                          as="select"
                          id="dish"
                          name="dish"
                          className="form-control"
                        >
                          <option value="">Select a dish</option>
                          {dishes.map((dish) => (
                            <option key={dish._id} value={dish._id}>
                              {dish.name}{" "}
                              {dish.category ? `(${dish.category})` : ""}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="dish"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form-group mb-3">
                        <label htmlFor="restaurant">Restaurant*</label>
                        <Field
                          as="select"
                          id="restaurant"
                          name="restaurant"
                          className="form-control"
                        >
                          <option value="">Select a restaurant</option>
                          {restaurants.map((restaurant) => (
                            <option key={restaurant._id} value={restaurant._id}>
                              {restaurant.name}{" "}
                              {restaurant.cuisineType
                                ? `(${restaurant.cuisineType})`
                                : ""}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="restaurant"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </Col>
                  </Row>

                  <div className="form-group mb-4">
                    <label htmlFor="date">Date*</label>
                    <Field
                      type="date"
                      id="date"
                      name="date"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="date"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <h4 className="mb-4">
                    Ratings{" "}
                    <small className="text-muted">
                      (Click on a number to rate)
                    </small>
                  </h4>

                  <div className="form-group mb-4">
                    <label>
                      <strong>Overall Flavor Experience (1-5)*</strong>
                      <small className="text-muted ms-2">
                        How would you rate the overall taste?
                      </small>
                    </label>
                    <Field name="overallFlavorExperience" type="hidden" />
                    <RatingInput
                      name="overallFlavorExperience"
                      max={5}
                      value={values.overallFlavorExperience}
                      onChange={setFieldValue}
                    />
                    <ErrorMessage
                      name="overallFlavorExperience"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <Row>
                    <Col md={6}>
                      <div className="form-group mb-4">
                        <label>
                          <strong>Ingredient Quality (1-5)*</strong>
                          <small className="text-muted ms-2">
                            How fresh and high-quality were the ingredients?
                          </small>
                        </label>
                        <Field name="ingredientQuality" type="hidden" />
                        <RatingInput
                          name="ingredientQuality"
                          max={5}
                          value={values.ingredientQuality}
                          onChange={setFieldValue}
                        />
                        <ErrorMessage
                          name="ingredientQuality"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form-group mb-4">
                        <label>
                          <strong>Texture & Mouthfeel (1-5)*</strong>
                          <small className="text-muted ms-2">
                            How satisfying was the texture?
                          </small>
                        </label>
                        <Field name="textureMouthfeel" type="hidden" />
                        <RatingInput
                          name="textureMouthfeel"
                          max={5}
                          value={values.textureMouthfeel}
                          onChange={setFieldValue}
                        />
                        <ErrorMessage
                          name="textureMouthfeel"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <div className="form-group mb-4">
                        <label>
                          <strong>Execution & Craftsmanship (1-5)*</strong>
                          <small className="text-muted ms-2">
                            How well was the dish prepared?
                          </small>
                        </label>
                        <Field name="executionCraftsmanship" type="hidden" />
                        <RatingInput
                          name="executionCraftsmanship"
                          max={5}
                          value={values.executionCraftsmanship}
                          onChange={setFieldValue}
                        />
                        <ErrorMessage
                          name="executionCraftsmanship"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form-group mb-4">
                        <label>
                          <strong>Value for Money (1-5)*</strong>
                          <small className="text-muted ms-2">
                            Was it worth the price?
                          </small>
                        </label>
                        <Field name="valueForMoney" type="hidden" />
                        <RatingInput
                          name="valueForMoney"
                          max={5}
                          value={values.valueForMoney}
                          onChange={setFieldValue}
                        />
                        <ErrorMessage
                          name="valueForMoney"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </Col>
                  </Row>

                  <div className="form-group mb-4">
                    <label>
                      <strong>Craving & Reorder Likelihood (1-5)*</strong>
                      <small className="text-muted ms-2">
                        How likely are you to order this again?
                      </small>
                    </label>
                    <Field name="cravingReorderLikelihood" type="hidden" />
                    <RatingInput
                      name="cravingReorderLikelihood"
                      max={5}
                      value={values.cravingReorderLikelihood}
                      onChange={setFieldValue}
                    />
                    <ErrorMessage
                      name="cravingReorderLikelihood"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="notes">Notes</label>
                    <Field
                      as="textarea"
                      id="notes"
                      name="notes"
                      className="form-control"
                      rows="4"
                    />
                    <ErrorMessage
                      name="notes"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="mt-4 mb-4 p-3 bg-light rounded">
                    <h4 className="mb-2">Overall Score</h4>
                    <p className="text-muted">
                      This score is calculated automatically based on a weighted
                      average:
                    </p>
                    <ul className="small text-muted">
                      <li>Overall Flavor Experience: 30%</li>
                      <li>Ingredient Quality: 15%</li>
                      <li>Texture & Mouthfeel: 15%</li>
                      <li>Execution & Craftsmanship: 15%</li>
                      <li>Value for Money: 15%</li>
                      <li>Craving & Reorder Likelihood: 10%</li>
                    </ul>
                    <div className="calculated-score">
                      {(() => {
                        const weights = {
                          overallFlavorExperience: 0.3,
                          ingredientQuality: 0.15,
                          textureMouthfeel: 0.15,
                          executionCraftsmanship: 0.15,
                          valueForMoney: 0.15,
                          cravingReorderLikelihood: 0.1,
                        };

                        let weightedSum = 0;
                        for (const [field, weight] of Object.entries(weights)) {
                          weightedSum += values[field] * weight;
                        }

                        const score = Math.round(weightedSum * 10) / 10;

                        // Get description based on score
                        let description = "";
                        if (score <= 1.5) description = "Poor";
                        else if (score <= 2.5) description = "Fair";
                        else if (score <= 3.5) description = "Good";
                        else if (score <= 4.5) description = "Very Good";
                        else description = "Excellent";

                        return (
                          <div className="d-flex align-items-center">
                            <div className="display-4 me-3">{score}</div>
                            <div>
                              <div className="fs-5">{description}</div>
                              <div className="text-muted small">out of 5</div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <Button
                      onClick={() => navigate("/judgments")}
                      variant="outline-secondary"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Judgment"}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default JudgmentForm;
