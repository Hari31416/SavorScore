import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, Button, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { getDishById, createDish, updateDish } from "../../utils/api";

const DishForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const isEditMode = !!id;

  const categories = [
    "Appetizer",
    "Main Course",
    "Dessert",
    "Beverage",
    "Side Dish",
    "Salad",
    "Soup",
    "Breakfast",
    "Other",
  ];

  useEffect(() => {
    if (isEditMode) {
      const fetchDish = async () => {
        try {
          const data = await getDishById(id);
          setDish(data);
        } catch (error) {
          setError("Failed to fetch dish details");
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchDish();
    }
  }, [id, isEditMode]);

  const initialValues = {
    name: dish?.name || "",
    description: dish?.description || "",
    category: dish?.category || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
    category: Yup.string(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditMode) {
        await updateDish(id, values);
        toast.success("Dish updated successfully");
      } else {
        await createDish(values);
        toast.success("Dish created successfully");
      }
      navigate("/dishes");
    } catch (error) {
      toast.error(error || "An error occurred");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading dish details...</div>;
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
        <div className="mt-3">
          <Button onClick={() => navigate("/dishes")} variant="outline-primary">
            Back to Dishes
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
              {isEditMode ? "Edit Dish" : "Add New Dish"}
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
                    <label htmlFor="name">Dish Name*</label>
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
                    <label htmlFor="category">Category</label>
                    <Field
                      as="select"
                      id="category"
                      name="category"
                      className="form-control"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="description">Description</label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      className="form-control"
                      rows="4"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="d-flex justify-content-between">
                    <Button
                      onClick={() => navigate("/dishes")}
                      variant="outline-secondary"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Dish"}
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

export default DishForm;
