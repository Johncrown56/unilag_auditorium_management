import * as yup from "yup";

export const step1ValidationSchema = yup.object({
  name: yup
    .object({
      value: yup
        .string()
        .min(2, "Remarks can not be less than 2 characters")
        .max(50, "Remarks can not be more than 50 characters"),
      label: yup.string(),
    })
    .required("Please select auditorium"),
  remarks: yup
    .string()
    .min(2, "Remarks can not be less than 2 characters")
    .max(500, "Remarks can not be more than 500 characters")
    .notRequired(),
  type: yup.string().trim().required("Please choose your event category"),
  purpose: yup
    .string()
    .min(2, "Purpose can not be less than 2 characters")
    .max(50, "Purpose can not be more than 50 characters")
    .required("Please enter purpose of event"),
  features: yup.array().of(yup.string().notRequired()),
});

export const step2ValidationSchema = yup.object({
  start: yup.object().shape({
    date: yup.date().required("Please enter the start date"),
    time: yup.date().required("Please enter the start time"),
  }),
  end: yup.object().shape({
    //date: yup.date().required("Please enter the end date"),
    date: yup
      .date()
      .required("Please enter the end date")
      .test(
        "is-after-start",
        "End date must be after start date",
        function (end: any, context) {
          const { start } = this.parent; // Access the value of start date
          if (!start || !end) {
            return true; // If either is not available, skip validation
          }
          return new Date(end) >= new Date(start);
        }
      ),
    time: yup.date().required("Please enter the end time"),
  }),
  available: yup
    .bool()
    .oneOf([true], "Auditorium booked for the Selected Date."),
});

export const step3ValidationSchema = yup.object({
  paymentMethod: yup
    .object({
      value: yup.string(),
      label: yup.string(),
    })
    .required("Please select payment method"),
});

export const step4ValidationSchema = yup.object().shape({
  paymentStatus: yup
    .bool()
    .oneOf([true], "Please make payment using the selected payment option"),
  receipt: yup
    .array()
    .min(1, "Please upload your receipt")
    .required("Receipt is required"),
});
// export const eventDateValidationSchema = yup.object({
//   available: yup.boolean().required("Selected Date not available"),
// });
