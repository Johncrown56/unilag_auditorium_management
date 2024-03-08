import * as yup from "yup";

export const featureValidationSchema = yup.object({
    name: yup
        .string()
        .trim()
        .min(2, "Please enter a valid name")
        .max(30, "Please enter maximum of 30 characters")
        .required("Feature name is required."),
    amount: yup
        .number()
        .typeError('Amount must be a number')
        .positive('Amount must be positive')
        .integer('Amount must be an number')
        .min(0, 'Amount must be at least 0')
        .max(1000000, 'Amount must be less than or equal to 1,000,000')
        .required("Feature amount is required."),
    description: yup
        .string()
        .trim()
        .min(2, "Please enter a valid description")
        .max(100, "Please enter maximum of 100 characters")
        .required("Description is required."),
});