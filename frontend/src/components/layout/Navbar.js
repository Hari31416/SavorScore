import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  NavDropdown,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const authLinks = (
    <>
      <Nav.Link as={Link} to="/judgments">
        Judgments
      </Nav.Link>
      <Nav.Link as={Link} to="/restaurants">
        Restaurants
      </Nav.Link>
      <Nav.Link as={Link} to="/dishes">
        Dishes
      </Nav.Link>
      <NavDropdown title={user?.username || "Account"} id="nav-dropdown">
        <NavDropdown.Item as={Link} to="/profile">
          Profile
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
      </NavDropdown>
    </>
  );

  const guestLinks = (
    <>
      <Nav.Link as={Link} to="/login">
        Login
      </Nav.Link>
      <Nav.Link as={Link} to="/register">
        Register
      </Nav.Link>
    </>
  );

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          SavorScore
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? authLinks : guestLinks}
            <Button
              variant="outline-light"
              className="theme-toggle-btn ml-2"
              onClick={toggleTheme}
              aria-label={
                isDarkMode ? "Switch to Light Side" : "Switch to Dark Side"
              }
            >
              <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
              {isDarkMode ? " Light Side" : " Dark Side"}
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
