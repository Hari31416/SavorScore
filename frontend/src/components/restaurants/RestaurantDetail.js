import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, Button, Row, Col, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faStar } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import {
  getRestaurantById,
  deleteRestaurant,
  getRatings,
} from "../../utils/api";

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantData = await getRestaurantById(id);
        setRestaurant(restaurantData);

        const ratingsData = await getRatings();
        // Filter ratings for this restaurant
        const filteredRatings = ratingsData.filter(
          (rating) => rating.restaurant._id === id
        );
        setRatings(filteredRatings);
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

  // Calculate average rating if there are ratings
  const calculateAverageRating = () => {
    if (ratings.length === 0) return null;

    // First check if we can use overallScore
    if (ratings[0].overallScore !== undefined) {
      const sum = ratings.reduce(
        (total, rating) => total + (rating.overallScore || 0),
        0
      );
      return (sum / ratings.length).toFixed(1);
    }

    // Fallback to overallFlavorExperience
    const sum = ratings.reduce(
      (total, rating) => total + rating.overallFlavorExperience,
      0
    );
    return (sum / ratings.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

  return (
    <div className="restaurant-detail">
      <Row className="justify-content-center mb-4">
        <Col md={8}>
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
        </Col>
      </Row>

      <Row className="justify-content-center mb-4">
        <Col md={4}>
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
                  <div className="rating-score mb-2">{averageRating}</div>
                  <div className="text-muted mb-3">
                    Based on {ratings.length} rating
                    {ratings.length !== 1 ? "s" : ""}
                  </div>
                  <div className="text-center small text-muted mb-3">
                    Overall Score is a weighted average of all ratings
                  </div>
                </>
              ) : (
                <p className="text-muted">No ratings yet</p>
              )}

              <Link to="/ratings/new" state={{ restaurantId: id }}>
                <Button variant="primary">
                  <FontAwesomeIcon icon={faStar} className="me-2" />
                  Add Rating
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <h3 className="mb-3">Dish Ratings</h3>

          {ratings.length === 0 ? (
            <Card>
              <Card.Body className="text-center py-5">
                <p className="mb-3">No ratings for this restaurant yet.</p>
                <Link to="/ratings/new" state={{ restaurantId: id }}>
                  <Button variant="outline-primary">Add First Rating</Button>
                </Link>
              </Card.Body>
            </Card>
      ) : (
        <Row>
          {ratings.map((rating) => (
            <Col md={6} className="mb-4" key={rating._id}>
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">{rating.dish.name}</h5>
                    <span className="badge bg-primary rounded-pill">
                      {rating.overallScore !== undefined
                        ? rating.overallScore
                        : rating.overallFlavorExperience}
                      /5
                    </span>
                  </div>

                  <p className="text-muted small">
                    Rated on {new Date(rating.date).toLocaleDateString()}
                  </p>

                  {rating.notes && <p className="mt-2">{rating.notes}</p>}
                </Card.Body>
                <Card.Footer className="bg-white">
                  <Link to={`/ratings/${rating._id}`}>
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
        </Col>
      </Row>
    </div>
  );
};

export default RestaurantDetail;
