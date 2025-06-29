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
import { getJudgmentById, deleteJudgment } from "../../utils/api";

const JudgmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [judgment, setJudgment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJudgment = async () => {
      try {
        const data = await getJudgmentById(id);
        setJudgment(data);
      } catch (error) {
        setError("Failed to fetch judgment details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJudgment();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this judgment?")) {
      try {
        await deleteJudgment(id);
        toast.success("Judgment deleted successfully");
        navigate("/judgments");
      } catch (error) {
        toast.error("Failed to delete judgment");
        console.error(error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading judgment details...</div>;
  }

  if (error || !judgment) {
    return (
      <Alert variant="danger">
        {error || "Judgment not found"}
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
    <div className="judgment-detail">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{judgment.dish.name}</h1>
        <div>
          <Link to={`/judgments/${id}/edit`} className="me-2">
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
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h4 className="mb-3">Dish & Restaurant</h4>
                  <p>
                    <Link to={`/dishes/${judgment.dish._id}`}>
                      <FontAwesomeIcon icon={faUtensils} className="me-2" />
                      {judgment.dish.name}
                    </Link>
                    {judgment.dish.category && ` (${judgment.dish.category})`}
                  </p>
                  <p>
                    <Link to={`/restaurants/${judgment.restaurant._id}`}>
                      <FontAwesomeIcon icon={faBuilding} className="me-2" />
                      {judgment.restaurant.name}
                    </Link>
                    {judgment.restaurant.cuisineType &&
                      ` (${judgment.restaurant.cuisineType})`}
                  </p>
                  <p>
                    <strong>Judged on:</strong>{" "}
                    {new Date(judgment.date).toLocaleDateString()}
                  </p>
                </Col>
                <Col md={6}>
                  <h4 className="mb-3">Overall Score</h4>
                  <div className="judgment-score mb-2">
                    {judgment.overallScore ? judgment.overallScore : "N/A"}
                  </div>
                  <div className="judgment-score-label mb-3">
                    {(() => {
                      const score = judgment.overallScore || 0;
                      if (score <= 1.5) return "Poor";
                      if (score <= 2.5) return "Fair";
                      if (score <= 3.5) return "Good";
                      if (score <= 4.5) return "Very Good";
                      return "Excellent";
                    })()}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {judgment.notes && (
            <Card className="mb-4">
              <Card.Body>
                <h4 className="mb-3">Notes</h4>
                <p className="mb-0">{judgment.notes}</p>
              </Card.Body>
            </Card>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h4 className="mb-3">Detailed Ratings</h4>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Overall Flavor Experience</span>
                  <span>{judgment.overallFlavorExperience}/5</span>
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-fill"
                    style={{
                      width: `${judgment.overallFlavorExperience * 20}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Ingredient Quality</span>
                  <span>{judgment.ingredientQuality}/5</span>
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-fill"
                    style={{ width: `${judgment.ingredientQuality * 20}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Texture & Mouthfeel</span>
                  <span>{judgment.textureMouthfeel}/5</span>
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-fill"
                    style={{ width: `${judgment.textureMouthfeel * 20}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Execution & Craftsmanship</span>
                  <span>{judgment.executionCraftsmanship}/5</span>
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-fill"
                    style={{
                      width: `${judgment.executionCraftsmanship * 20}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Value for Money</span>
                  <span>{judgment.valueForMoney}/5</span>
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-fill"
                    style={{ width: `${judgment.valueForMoney * 20}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Craving & Reorder Likelihood</span>
                  <span>{judgment.cravingReorderLikelihood}/5</span>
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-fill"
                    style={{
                      width: `${judgment.cravingReorderLikelihood * 20}%`,
                    }}
                  ></div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="d-flex justify-content-between">
        <Button
          variant="outline-secondary"
          onClick={() => navigate("/judgments")}
        >
          Back to Judgments
        </Button>
        <Link to="/judgments/new">
          <Button variant="primary">Add Another Judgment</Button>
        </Link>
      </div>
    </div>
  );
};

export default JudgmentDetail;
