import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, Button, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
} from "../../utils/api";

const RestaurantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      const fetchRestaurant = async () => {
        try {
          const data = await getRestaurantById(id);
          setRestaurant(data);
        } catch (error) {
          setError("Failed to fetch restaurant details");
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchRestaurant();
    }
  }, [id, isEditMode]);

  const initialValues = {
    name: restaurant?.name || "",
    address: restaurant?.address || "",
    cuisineType: restaurant?.cuisineType || "",
    phone: restaurant?.phone || "",
    website: restaurant?.website || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    address: Yup.string(),
    cuisineType: Yup.string(),
    phone: Yup.string(),
    website: Yup.string().url("Invalid URL format"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditMode) {
        await updateRestaurant(id, values);
        toast.success("Restaurant updated successfully");
      } else {
        await createRestaurant(values);
        toast.success("Restaurant created successfully");
      }
      navigate("/restaurants");
    } catch (error) {
      toast.error(error || "An error occurred");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">Loading restaurant details...</div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
        <div className="mt-3">
          <Button
            onClick={() => navigate("/restaurants")}
            variant="outline-primary"
          >
            Back to Restaurants
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">
              {isEditMode ? "Edit Restaurant" : "Add New Restaurant"}
            </h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="form-group mb-3">
                    <label htmlFor="name">Restaurant Name*</label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="address">Address</label>
                    <Field
                      type="text"
                      id="address"
                      name="address"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="cuisineType">Cuisine Type</label>
                    <Field
                      type="text"
                      id="cuisineType"
                      name="cuisineType"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="cuisineType"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="phone">Phone Number</label>
                    <Field
                      type="text"
                      id="phone"
                      name="phone"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="website">Website</label>
                    <Field
                      type="text"
                      id="website"
                      name="website"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="website"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="d-flex justify-content-between">
                    <Button
                      onClick={() => navigate("/restaurants")}
                      variant="outline-secondary"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Restaurant"}
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

export default RestaurantForm;
