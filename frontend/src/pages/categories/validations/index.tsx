import * as yup from "yup";

export const categoryValidationSchema = yup.object({
    name: yup
        .string()
        .trim()
        .min(2, "Please enter a valid name")
        .max(30, "Please enter maximum of 30 characters")
        .required("Feature name is required."),
    description: yup
        .string()
        .trim()
        .min(2, "Please enter a valid description")
        .max(100, "Please enter maximum of 100 characters")
        .required("Description is required."),
});