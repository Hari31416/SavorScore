import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { getRestaurants } from "../../utils/api";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
        setFilteredRestaurants(data);
      } catch (error) {
        toast.error("Failed to fetch restaurants");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = restaurants.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (restaurant.cuisineType &&
            restaurant.cuisineType
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants(restaurants);
    }
  }, [searchTerm, restaurants]);

  if (loading) {
    return <div className="text-center py-5">Loading restaurants...</div>;
  }

  return (
    <div className="restaurant-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Restaurants</h1>
        <Link to="/restaurants/new">
          <Button variant="primary">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add Restaurant
          </Button>
        </Link>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <InputGroup>
            <InputGroup.Text>
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by name or cuisine type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Card.Body>
      </Card>

      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-5">
          <FontAwesomeIcon
            icon={faUtensils}
            size="3x"
            className="mb-3 text-muted"
          />
          <p className="lead">
            No restaurants found. Add your first restaurant!
          </p>
          <Link to="/restaurants/new">
            <Button variant="outline-primary">Add Restaurant</Button>
          </Link>
        </div>
      ) : (
        <Row>
          {filteredRestaurants.map((restaurant) => (
            <Col md={4} className="mb-4" key={restaurant._id}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{restaurant.name}</Card.Title>
                  {restaurant.cuisineType && (
                    <Card.Subtitle className="mb-2 text-muted">
                      {restaurant.cuisineType}
                    </Card.Subtitle>
                  )}
                  {restaurant.address && (
                    <Card.Text className="small">
                      {restaurant.address}
                    </Card.Text>
                  )}
                </Card.Body>
                <Card.Footer className="bg-white">
                  <Link to={`/restaurants/${restaurant._id}`}>
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

export default RestaurantList;
