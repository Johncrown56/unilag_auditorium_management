import * as yup from "yup";

export const changePasswordValidationSchema = yup.object({
  oldPassword: yup
    .string()
    .trim()
    .min(2, "Please enter a valid password")
    .required("Old Password is required."),
  newPassword: yup
    .string()
    .required("Please specify your password")
    .min(8, "Must have at least minimum length of 8")
    .max(16, "Characters can not be more than 16")
    .matches(/^\S*$/, "Whitespace is not allowed")
    .matches(/[a-z]+/, "Must have at least one lowercase character")
    .matches(/[A-Z]+/, "Must have at least one uppercase character")
    .matches(
      /[!#@$%^&*)(+=}{/:;><?'"|`~._-]/,
      "Must have at least one special character"
    )
    .matches(/\d+/, "Must have at least one number"),
  confirmNewPassword: yup
    .string()
    .min(8, "Must have at least minimum length of 8")
    .required("Please confirm your password")
    .oneOf([yup.ref("newPassword")], "Passwords does not match"),
});
