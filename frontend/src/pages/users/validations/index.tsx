import { isPossiblePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import * as yup from "yup";

export const userValidationSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .min(2, "Please enter a valid first name")
    .max(30, "Please enter maximum of 30 characters")
    .label("First Name")
    .required(),
  lastName: yup
    .string()
    .trim()
    .min(2, "Please enter a valid last name")
    .max(30, "Please enter maximum of 30 characters")
    .label("Last Name")
    .required(),
  role: yup
    .string()
    .trim()
    .label("Role")
    .min(2, "Please enter a valid role")
    .required(),
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .min(5, "Email must be more than 5 characters")
    .max(30, "Email should not be more than 30 characters")
    .required("Please email your email."),
  phone: yup
    .string()
    .trim()
    .matches(
      /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)$/,
      "Please enter a valid phone number."
    )
    .min(10, "Phone number should not be less than 10 digits")
    .max(16, "Phone number should not be more than 16 digits")
    .required("Please specify your phone number")
    .typeError("Phone no must be valid")
    .test((value, { path, createError }) => {
      if (!isValidPhoneNumber(String(value), "NG")) {
        return createError({ path, message: "Invalid phone number" });
      }
      if (!isPossiblePhoneNumber(String(value), "NG")) {
        return createError({ path, message: "Phone number not valid" });
      }

      return true;
    }),
});
