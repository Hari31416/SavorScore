import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light text-center py-3 mt-5">
      <div className="container">
        <p className="mb-0">SavorScore &copy; {year}</p>
      </div>
    </footer>
  );
};

export default Footer;
