import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, Button, Row, Col, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faStar } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { getDishById, deleteDish, getRatings } from "../../utils/api";

const DishDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dish, setDish] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dishData = await getDishById(id);
        setDish(dishData);

        const ratingsData = await getRatings();
        // Filter ratings for this dish
        const filteredRatings = ratingsData.filter(
          (rating) => rating.dish._id === id
        );
        setRatings(filteredRatings);
      } catch (error) {
        setError("Failed to fetch dish details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this dish?")) {
      try {
        await deleteDish(id);
        toast.success("Dish deleted successfully");
        navigate("/dishes");
      } catch (error) {
        toast.error("Failed to delete dish");
        console.error(error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading dish details...</div>;
  }

  if (error || !dish) {
    return (
      <Alert variant="danger">
        {error || "Dish not found"}
        <div className="mt-3">
          <Button onClick={() => navigate("/dishes")} variant="outline-primary">
            Back to Dishes
          </Button>
        </div>
      </Alert>
    );
  }

  // Calculate average ratings
  const calculateAverages = () => {
    if (ratings.length === 0) return null;

    // Check if we can use overallScore
    const hasOverallScore = ratings.some((r) => r.overallScore !== undefined);

    const totalOverallScore = hasOverallScore
      ? ratings.reduce((sum, r) => sum + (r.overallScore || 0), 0)
      : 0;

    const totalOverall = ratings.reduce(
      (sum, r) => sum + r.overallFlavorExperience,
      0
    );
    const totalIngredient = ratings.reduce(
      (sum, r) => sum + r.ingredientQuality,
      0
    );
    const totalTexture = ratings.reduce(
      (sum, r) => sum + r.textureMouthfeel,
      0
    );
    const totalExecution = ratings.reduce(
      (sum, r) => sum + r.executionCraftsmanship,
      0
    );
    const totalValue = ratings.reduce((sum, r) => sum + r.valueForMoney, 0);
    const totalCraving = ratings.reduce(
      (sum, r) => sum + r.cravingReorderLikelihood,
      0
    );

    return {
      overallScore: hasOverallScore
        ? (totalOverallScore / ratings.length).toFixed(1)
        : null,
      overallFlavorExperience: (totalOverall / ratings.length).toFixed(1),
      ingredientQuality: (totalIngredient / ratings.length).toFixed(1),
      textureMouthfeel: (totalTexture / ratings.length).toFixed(1),
      executionCraftsmanship: (totalExecution / ratings.length).toFixed(1),
      valueForMoney: (totalValue / ratings.length).toFixed(1),
      cravingReorderLikelihood: (totalCraving / ratings.length).toFixed(1),
    };
  };

  const averages = calculateAverages();

  return (
    <div className="dish-detail">
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>{dish.name}</h1>
            <div>
              <Link to={`/dishes/${id}/edit`} className="me-2">
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
              <h4 className="mb-3">Dish Details</h4>

              {dish.category && (
                <p>
                  <strong>Category:</strong> {dish.category}
                </p>
              )}

              {dish.description && (
                <div>
                  <strong>Description:</strong>
                  <p className="mt-2">{dish.description}</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h4 className="mb-3">Rating Summary</h4>

              {averages ? (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="rating-score">
                      {averages.overallScore ||
                        averages.overallFlavorExperience}
                    </div>
                    <div className="text-muted">
                      Based on {ratings.length} rating
                      {ratings.length !== 1 ? "s" : ""}
                    </div>
                  </div>

                  {averages.overallScore && (
                    <div className="text-center small text-muted mt-2 mb-3">
                      Overall Score is a weighted average of all ratings
                    </div>
                  )}

                  <div className="mt-4">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Ingredient Quality</span>
                      <span>{averages.ingredientQuality}/5</span>
                    </div>
                    <div className="metric-bar">
                      <div
                        className="metric-fill"
                        style={{ width: `${averages.ingredientQuality * 20}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Texture & Mouthfeel</span>
                      <span>{averages.textureMouthfeel}/5</span>
                    </div>
                    <div className="metric-bar">
                      <div
                        className="metric-fill"
                        style={{ width: `${averages.textureMouthfeel * 20}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Execution & Craftsmanship</span>
                      <span>{averages.executionCraftsmanship}/5</span>
                    </div>
                    <div className="metric-bar">
                      <div
                        className="metric-fill"
                        style={{
                          width: `${averages.executionCraftsmanship * 20}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Value for Money</span>
                      <span>{averages.valueForMoney}/5</span>
                    </div>
                    <div className="metric-bar">
                      <div
                        className="metric-fill"
                        style={{ width: `${averages.valueForMoney * 20}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Craving & Reorder Likelihood</span>
                      <span>{averages.cravingReorderLikelihood}/5</span>
                    </div>
                    <div className="metric-bar">
                      <div
                        className="metric-fill"
                        style={{
                          width: `${averages.cravingReorderLikelihood * 20}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted">No ratings yet</p>
              )}

              <div className="mt-4 text-center">
                <Link to="/ratings/new" state={{ dishId: id }}>
                  <Button variant="primary">
                    <FontAwesomeIcon icon={faStar} className="me-2" />
                    Add Rating
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <h3 className="mb-3">Ratings by Restaurant</h3>
          {ratings.length === 0 ? (
            <Card>
              <Card.Body className="text-center py-5">
                <p className="mb-3">No ratings for this dish yet.</p>
                <Link to="/ratings/new" state={{ dishId: id }}>
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
                    <h5 className="mb-0">{rating.restaurant.name}</h5>
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

export default DishDetail;
