import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, Button, Row, Col, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faStar } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { getDishById, deleteDish, getJudgments } from "../../utils/api";

const DishDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dish, setDish] = useState(null);
  const [judgments, setJudgments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dishData = await getDishById(id);
        setDish(dishData);

        const judgmentsData = await getJudgments();
        // Filter judgments for this dish
        const filteredJudgments = judgmentsData.filter(
          (judgment) => judgment.dish._id === id
        );
        setJudgments(filteredJudgments);
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
    if (judgments.length === 0) return null;

    // Check if we can use overallScore
    const hasOverallScore = judgments.some((j) => j.overallScore !== undefined);

    const totalOverallScore = hasOverallScore
      ? judgments.reduce((sum, j) => sum + (j.overallScore || 0), 0)
      : 0;

    const totalOverall = judgments.reduce(
      (sum, j) => sum + j.overallFlavorExperience,
      0
    );
    const totalIngredient = judgments.reduce(
      (sum, j) => sum + j.ingredientQuality,
      0
    );
    const totalTexture = judgments.reduce(
      (sum, j) => sum + j.textureMouthfeel,
      0
    );
    const totalExecution = judgments.reduce(
      (sum, j) => sum + j.executionCraftsmanship,
      0
    );
    const totalValue = judgments.reduce((sum, j) => sum + j.valueForMoney, 0);
    const totalCraving = judgments.reduce(
      (sum, j) => sum + j.cravingReorderLikelihood,
      0
    );

    return {
      overallScore: hasOverallScore
        ? (totalOverallScore / judgments.length).toFixed(1)
        : null,
      overallFlavorExperience: (totalOverall / judgments.length).toFixed(1),
      ingredientQuality: (totalIngredient / judgments.length).toFixed(1),
      textureMouthfeel: (totalTexture / judgments.length).toFixed(1),
      executionCraftsmanship: (totalExecution / judgments.length).toFixed(1),
      valueForMoney: (totalValue / judgments.length).toFixed(1),
      cravingReorderLikelihood: (totalCraving / judgments.length).toFixed(1),
    };
  };

  const averages = calculateAverages();

  return (
    <div className="dish-detail">
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

      <Row className="mb-4">
        <Col md={6}>
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
        <Col md={6}>
          <Card>
            <Card.Body>
              <h4 className="mb-3">Rating Summary</h4>

              {averages ? (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="judgment-score">
                      {averages.overallScore ||
                        averages.overallFlavorExperience}
                    </div>
                    <div className="text-muted">
                      Based on {judgments.length} judgment
                      {judgments.length !== 1 ? "s" : ""}
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
                <p className="text-muted">No judgments yet</p>
              )}

              <div className="mt-4 text-center">
                <Link to="/judgments/new" state={{ dishId: id }}>
                  <Button variant="primary">
                    <FontAwesomeIcon icon={faStar} className="me-2" />
                    Add Judgment
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h3 className="mb-3">Judgments by Restaurant</h3>

      {judgments.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <p className="mb-3">No judgments for this dish yet.</p>
            <Link to="/judgments/new" state={{ dishId: id }}>
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
                    <h5 className="mb-0">{judgment.restaurant.name}</h5>
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

export default DishDetail;
