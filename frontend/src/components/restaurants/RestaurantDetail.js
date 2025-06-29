import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, Button, Row, Col, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faStar } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import {
  getRestaurantById,
  deleteRestaurant,
  getJudgments,
} from "../../utils/api";

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [judgments, setJudgments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantData = await getRestaurantById(id);
        setRestaurant(restaurantData);

        const judgmentsData = await getJudgments();
        // Filter judgments for this restaurant
        const filteredJudgments = judgmentsData.filter(
          (judgment) => judgment.restaurant._id === id
        );
        setJudgments(filteredJudgments);
      } catch (error) {
        setError("Failed to fetch restaurant details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await deleteRestaurant(id);
        toast.success("Restaurant deleted successfully");
        navigate("/restaurants");
      } catch (error) {
        toast.error("Failed to delete restaurant");
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">Loading restaurant details...</div>
    );
  }

  if (error || !restaurant) {
    return (
      <Alert variant="danger">
        {error || "Restaurant not found"}
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

  // Calculate average rating if there are judgments
  const calculateAverageRating = () => {
    if (judgments.length === 0) return null;

    // First check if we can use overallScore
    if (judgments[0].overallScore !== undefined) {
      const sum = judgments.reduce(
        (total, judgment) => total + (judgment.overallScore || 0),
        0
      );
      return (sum / judgments.length).toFixed(1);
    }

    // Fallback to overallFlavorExperience
    const sum = judgments.reduce(
      (total, judgment) => total + judgment.overallFlavorExperience,
      0
    );
    return (sum / judgments.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

  return (
    <div className="restaurant-detail">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{restaurant.name}</h1>
        <div>
          <Link to={`/restaurants/${id}/edit`} className="me-2">
            <Button variant="outline-primary">
              <FontAwesomeIcon icon={faEdit} className="me-2" />
              Edit
            </Button>
          </Link>
          <Button variant="outline-danger" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrashAlt} className="me-2" />
            Delete
          </Button>
        </div>
      </div>

      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Body>
              <h4 className="mb-3">Restaurant Details</h4>

              {restaurant.cuisineType && (
                <p>
                  <strong>Cuisine:</strong> {restaurant.cuisineType}
                </p>
              )}

              {restaurant.address && (
                <p>
                  <strong>Address:</strong> {restaurant.address}
                </p>
              )}

              {restaurant.phone && (
                <p>
                  <strong>Phone:</strong> {restaurant.phone}
                </p>
              )}

              {restaurant.website && (
                <p>
                  <strong>Website:</strong>{" "}
                  <a
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {restaurant.website}
                  </a>
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="mb-3">Rating Summary</h4>

              {averageRating ? (
                <>
                  <div className="judgment-score mb-2">{averageRating}</div>
                  <div className="text-muted mb-3">
                    Based on {judgments.length} judgment
                    {judgments.length !== 1 ? "s" : ""}
                  </div>
                  <div className="text-center small text-muted mb-3">
                    Overall Score is a weighted average of all ratings
                  </div>
                </>
              ) : (
                <p className="text-muted">No judgments yet</p>
              )}

              <Link to="/judgments/new" state={{ restaurantId: id }}>
                <Button variant="primary">
                  <FontAwesomeIcon icon={faStar} className="me-2" />
                  Add Judgment
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h3 className="mb-3">Dish Judgments</h3>

      {judgments.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <p className="mb-3">No judgments for this restaurant yet.</p>
            <Link to="/judgments/new" state={{ restaurantId: id }}>
              <Button variant="outline-primary">Add First Judgment</Button>
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {judgments.map((judgment) => (
            <Col md={6} className="mb-4" key={judgment._id}>
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">{judgment.dish.name}</h5>
                    <span className="badge bg-primary rounded-pill">
                      {judgment.overallScore !== undefined
                        ? judgment.overallScore
                        : judgment.overallFlavorExperience}
                      /5
                    </span>
                  </div>

                  <p className="text-muted small">
                    Judged on {new Date(judgment.date).toLocaleDateString()}
                  </p>

                  {judgment.notes && <p className="mt-2">{judgment.notes}</p>}
                </Card.Body>
                <Card.Footer className="bg-white">
                  <Link to={`/judgments/${judgment._id}`}>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="w-100"
                    >
                      View Details
                    </Button>
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default RestaurantDetail;
