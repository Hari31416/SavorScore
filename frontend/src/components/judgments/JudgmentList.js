import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { getJudgments } from "../../utils/api";

const JudgmentList = () => {
  const [judgments, setJudgments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJudgments, setFilteredJudgments] = useState([]);
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    const fetchJudgments = async () => {
      try {
        const data = await getJudgments();
        setJudgments(data);
        setFilteredJudgments(data);
      } catch (error) {
        toast.error("Failed to fetch judgments");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJudgments();
  }, []);

  useEffect(() => {
    let filtered = [...judgments];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (judgment) =>
          judgment.dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          judgment.restaurant.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (judgment.notes &&
            judgment.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "date-desc":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "date-asc":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "rating-desc":
        filtered.sort((a, b) => {
          const scoreA =
            a.overallScore !== undefined
              ? a.overallScore
              : a.overallFlavorExperience;
          const scoreB =
            b.overallScore !== undefined
              ? b.overallScore
              : b.overallFlavorExperience;
          return scoreB - scoreA;
        });
        break;
      case "rating-asc":
        filtered.sort((a, b) => {
          const scoreA =
            a.overallScore !== undefined
              ? a.overallScore
              : a.overallFlavorExperience;
          const scoreB =
            b.overallScore !== undefined
              ? b.overallScore
              : b.overallFlavorExperience;
          return scoreA - scoreB;
        });
        break;
      default:
        break;
    }

    setFilteredJudgments(filtered);
  }, [searchTerm, sortBy, judgments]);

  if (loading) {
    return <div className="text-center py-5">Loading judgments...</div>;
  }

  return (
    <div className="judgment-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dish Judgments</h1>
        <Link to="/judgments/new">
          <Button variant="primary">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add Judgment
          </Button>
        </Link>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={8}>
              <InputGroup className="mb-md-0 mb-3">
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by dish, restaurant, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="rating-desc">Highest Overall Score</option>
                <option value="rating-asc">Lowest Overall Score</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {filteredJudgments.length === 0 ? (
        <div className="text-center py-5">
          <FontAwesomeIcon
            icon={faClipboardList}
            size="3x"
            className="mb-3 text-muted"
          />
          <p className="lead">No judgments found. Add your first judgment!</p>
          <Link to="/judgments/new">
            <Button variant="outline-primary">Add Judgment</Button>
          </Link>
        </div>
      ) : (
        <Row>
          {filteredJudgments.map((judgment) => (
            <Col md={6} lg={4} className="mb-4" key={judgment._id}>
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <Card.Title>{judgment.dish.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {judgment.restaurant.name}
                      </Card.Subtitle>
                    </div>
                    <div className="judgment-score-small">
                      {judgment.overallScore
                        ? judgment.overallScore
                        : judgment.overallFlavorExperience}
                      /5
                    </div>
                  </div>

                  <p className="text-muted small">
                    Judged on {new Date(judgment.date).toLocaleDateString()}
                  </p>

                  {judgment.notes && (
                    <p className="mt-2">
                      {judgment.notes.length > 100
                        ? `${judgment.notes.substring(0, 100)}...`
                        : judgment.notes}
                    </p>
                  )}
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

export default JudgmentList;
