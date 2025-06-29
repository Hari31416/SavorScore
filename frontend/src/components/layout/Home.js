import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faStore, faStar } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

const Home = () => {
  // Get authentication state from AuthContext
  const { isAuthenticated } = useContext(AuthContext);
  // Get theme state from ThemeContext
  const { isDarkMode } = useContext(ThemeContext);

  // Use theme-specific styles
  const themeClass = isDarkMode ? "dark-theme" : "light-theme";

  return (
    <div className={`home-page ${themeClass}`}>
      <Container>
        <Row className="mb-5">
          <Col md={12} className="text-center">
            <h1 className="display-4 mb-4">Welcome to SavorScore</h1>
            <p className="lead">
              Your personal dish rating tracker. Record, analyze, and remember
              your culinary experiences.
            </p>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center">
              <Card.Body>
                <FontAwesomeIcon
                  icon={faStore}
                  size="3x"
                  className="mb-3 text-primary"
                />
                <Card.Title>Restaurants</Card.Title>
                <Card.Text>
                  Keep track of all the restaurants you've visited and
                  categorize them by cuisine.
                </Card.Text>
                <Link to="/restaurants">
                  <Button variant="outline-primary">Explore Restaurants</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center">
              <Card.Body>
                <FontAwesomeIcon
                  icon={faUtensils}
                  size="3x"
                  className="mb-3 text-primary"
                />
                <Card.Title>Dishes</Card.Title>
                <Card.Text>
                  Build your database of dishes and compare how they vary across
                  different restaurants.
                </Card.Text>
                <Link to="/dishes">
                  <Button variant="outline-primary">Explore Dishes</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center">
              <Card.Body>
                <FontAwesomeIcon
                  icon={faStar}
                  size="3x"
                  className="mb-3 text-primary"
                />
                <Card.Title>Ratings</Card.Title>
                <Card.Text>
                  Record detailed ratings with multiple criteria to remember
                  what made a dish special.
                </Card.Text>
                <Link to="/ratings">
                  <Button variant="outline-primary">Explore Ratings</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {!isAuthenticated && (
          <Row className="mb-4">
            <Col md={12} className="text-center">
              <h2>Get Started</h2>
              <p>
                Create an account or login to start recording your culinary
                experiences.
              </p>
              <div className="mt-4">
                <Link to="/register" className="me-3">
                  <Button variant="primary" size="lg">
                    Register
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline-primary" size="lg">
                    Login
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Home;
