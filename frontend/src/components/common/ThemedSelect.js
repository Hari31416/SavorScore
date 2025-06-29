import React, { useContext } from "react";
import { Form } from "react-bootstrap";
import { ThemeContext } from "../../context/ThemeContext";

const ThemedSelect = ({
  options,
  onChange,
  value,
  placeholder,
  className,
  ...props
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <Form.Select
      className={`${className || ""} ${
        isDarkMode ? "bg-dark text-light" : "bg-light text-dark"
      }`}
      value={value}
      onChange={onChange}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value || option} value={option.value || option}>
          {option.label || option}
        </option>
      ))}
    </Form.Select>
  );
};

export default ThemedSelect;
