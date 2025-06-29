import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, Button, Row, Col, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
  faBuilding,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { getRatingById, deleteRating } from "../../utils/api";

const RatingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const data = await getRatingById(id);
        setRating(data);
      } catch (error) {
        setError("Failed to fetch rating details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this rating?")) {
      try {
        await deleteRating(id);
        toast.success("Rating deleted successfully");
        navigate("/ratings");
      } catch (error) {
        toast.error("Failed to delete rating");
        console.error(error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading rating details...</div>;
  }

  if (error || !rating) {
    return (
      <Alert variant="danger">
        {error || "Rating not found"}
        <div className="mt-3">
          <Button
            onClick={() => navigate("/ratings")}
            variant="outline-primary"
          >
            Back to Ratings
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div className="rating-detail">
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>{rating.dish.name}</h1>
            <div>
              <Link to={`/ratings/${id}/edit`} className="me-2">
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

      <Row className="mb-4 justify-content-center">
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col>
                  <h4 className="mb-3">Dish & Restaurant</h4>
                  <p>
                    <Link to={`/dishes/${rating.dish._id}`}>
                      <FontAwesomeIcon icon={faUtensils} className="me-2" />
                      {rating.dish.name}
                    </Link>
                    {rating.dish.category && ` (${rating.dish.category})`}
                  </p>
                  <p>
                    <Link to={`/restaurants/${rating.restaurant._id}`}>
                      <FontAwesomeIcon icon={faBuilding} className="me-2" />
                      {rating.restaurant.name}
                    </Link>
                    {rating.restaurant.cuisineType &&
                      ` (${rating.restaurant.cuisineType})`}
                  </p>
                  <p>
                    <strong>Rated on:</strong>{" "}
                    {new Date(rating.date).toLocaleDateString()}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {rating.notes && (
            <Card className="mb-4">
              <Card.Body>
                <h4 className="mb-3">Notes</h4>
                <p className="mb-0">{rating.notes}</p>
              </Card.Body>
            </Card>
          )}
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <h4 className="mb-3">Overall Score</h4>
              <div className="rating-score mb-2">
                {rating.overallScore ? rating.overallScore : "N/A"}
              </div>
              <div className="rating-score-label mb-3">
                {(() => {
                  const score = rating.overallScore || 0;
                  if (score <= 1.5) return "Poor";
                  if (score <= 2.5) return "Fair";
                  if (score <= 3.5) return "Good";
                  if (score <= 4.5) return "Very Good";
                  return "Excellent";
                })()}
              </div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Body>
              <h4 className="mb-3">Detailed Ratings</h4>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Overall Flavor Experience</span>
                  <span>{rating.overallFlavorExperience}/5</span>
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-fill"
                    style={{
                      width: `${rating.overallFlavorExperience * 20}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Ingredient Quality</span>
                  <span>{rating.ingredientQuality}/5</span>
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-fill"
                    style={{ width: `${rating.ingredientQuality * 20}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Texture & Mouthfeel</span>
                  <span>{rating.textureMouthfeel}/5</span>
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-fill"
                    style={{ width: `${rating.textureMouthfeel * 20}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Execution & Craftsmanship</span>
                  <span>{rating.executionCraftsmanship}/5</span>
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-fill"
                    style={{
                      width: `${rating.executionCraftsmanship * 20}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Value for Money</span>
                  <span>{rating.valueForMoney}/5</span>
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-fill"
                    style={{ width: `${rating.valueForMoney * 20}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Craving & Reorder Likelihood</span>
                  <span>{rating.cravingReorderLikelihood}/5</span>
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-fill"
                    style={{
                      width: `${rating.cravingReorderLikelihood * 20}%`,
                    }}
                  ></div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8}>
          <div className="d-flex justify-content-between">
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/ratings")}
            >
              Back to Ratings
            </Button>
            <Link to="/ratings/new">
              <Button variant="primary">Add Another Rating</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default RatingDetail;
