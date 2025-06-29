import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faPizzaSlice,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import ThemedSelect from "../common/ThemedSelect";
import { getDishes } from "../../utils/api";

const DishList = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const data = await getDishes();
        setDishes(data);
        setFilteredDishes(data);
      } catch (error) {
        toast.error("Failed to fetch dishes");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  useEffect(() => {
    let filtered = [...dishes];

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (dish) =>
          dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (dish.description &&
            dish.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter((dish) => dish.category === categoryFilter);
    }

    setFilteredDishes(filtered);
  }, [searchTerm, categoryFilter, dishes]);

  // Get unique categories from dishes
  const getCategories = () => {
    const categories = new Set();
    dishes.forEach((dish) => {
      if (dish.category) {
        categories.add(dish.category);
      }
    });
    return Array.from(categories);
  };

  if (loading) {
    return <div className="text-center py-5">Loading dishes...</div>;
  }

  return (
    <div className="dish-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dishes</h1>
        <Link to="/dishes/new">
          <Button variant="primary">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add Dish
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
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <ThemedSelect
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                placeholder="All Categories"
                options={getCategories()}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {filteredDishes.length === 0 ? (
        <div className="text-center py-5">
          <FontAwesomeIcon
            icon={faPizzaSlice}
            size="3x"
            className="mb-3 text-muted"
          />
          <p className="lead">No dishes found. Add your first dish!</p>
          <Link to="/dishes/new">
            <Button variant="outline-primary">Add Dish</Button>
          </Link>
        </div>
      ) : (
        <Row>
          {filteredDishes.map((dish) => (
            <Col md={4} className="mb-4" key={dish._id}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{dish.name}</Card.Title>
                  {dish.category && (
                    <Card.Subtitle className="mb-2 text-muted">
                      {dish.category}
                    </Card.Subtitle>
                  )}
                  {dish.description && (
                    <Card.Text>
                      {dish.description.length > 100
                        ? `${dish.description.substring(0, 100)}...`
                        : dish.description}
                    </Card.Text>
                  )}
                </Card.Body>
                <Card.Footer className="bg-white">
                  <Link to={`/dishes/${dish._id}`}>
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

export default DishList;
