import { PASSWORD_MIN_LENGTH } from "./constants";

export const isRequired = (value) => {
  return value !== undefined &&
    value !== null &&
    String(value).trim() !== "";
};

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPassword = (password) => {
  return password?.length >= PASSWORD_MIN_LENGTH;
};

export const isValidPhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone);
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!isRequired(email)) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email address";
  }

  if (!isRequired(password)) {
    errors.password = "Password is required";
  }

  return errors;
};

export const validatePatientForm = (patient) => {
  const errors = {};

  if (!isRequired(patient.name)) {
    errors.name = "Patient name is required";
  }

  if (!isRequired(patient.phone)) {
    errors.phone = "Phone number is required";
  } else if (!isValidPhone(patient.phone)) {
    errors.phone = "Invalid phone number";
  }

  return errors;
};