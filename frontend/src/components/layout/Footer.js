import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const Footer = () => {
  const year = new Date().getFullYear();
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <footer
      className={`${
        isDarkMode ? "bg-dark" : "bg-dark"
      } text-light text-center py-3 mt-5`}
    >
      <div className="container">
        <p className="mb-0">SavorScore &copy; {year}</p>
      </div>
    </footer>
  );
};

export default Footer;
