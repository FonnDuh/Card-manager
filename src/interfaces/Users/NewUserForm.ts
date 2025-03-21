import * as yup from "yup";
import { errorMessage, successMessage } from "../../services/feedbackService";
import { registerUser } from "../../services/userService";
import { normalizedUser } from "../../utilities/users/NormalizeUser";
import { FormikHelpers } from "formik";
import { ApiError } from "../ApiError";

export const initialValues = {
  first: "",
  middle: "",
  last: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  image: "",
  alt: "",
  state: "",
  country: "",
  city: "",
  street: "",
  houseNumber: 0,
  zip: 0,
  isBusiness: false,
};

export const validationSchema = yup.object({
  first: yup.string().min(2).max(256).required("First Name is required"),
  middle: yup.string().min(2).max(256),
  last: yup.string().min(2).max(256).required("Last Name is required"),
  phone: yup.string().min(9).max(11).required("Phone is required"),
  email: yup.string().email().min(5).required("Email is required"),
  password: yup
    .string()
    .min(7)
    .max(20)
    .required("Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*\-"])[A-Za-z\d!@#$%^&*\-"]{7,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-"), and be at least 7 characters long'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match"),
  image: yup.string().min(14).url("Invalid URL"),
  alt: yup.string().min(2).max(256),
  state: yup.string().min(2).max(256),
  country: yup.string().min(2).max(256).required("Country is required"),
  city: yup.string().min(2).max(256).required("City is required"),
  street: yup.string().min(2).max(256).required("Street is required"),
  houseNumber: yup
    .number()
    .min(2, "House Number must be greater than or equal to 2")
    .max(256)
    .required("House Number is required"),
  zip: yup
    .number()
    .min(2, "Zip must be greater than or equal to 2")
    .max(1000000)
    .required("Zip is required"),
  isBusiness: yup.boolean().required(),
});

export const onSubmit = async (
  values: typeof initialValues,
  helpers: FormikHelpers<typeof initialValues>,
  onSuccess: () => void
) => {
  try {
    await registerUser(normalizedUser(values));
    helpers.resetForm();
    successMessage("User created successfully");
    onSuccess();
  } catch (err: Error | unknown) {
    if (err && typeof err === "object" && "response" in err) {
      const apiError = err as ApiError;
      const statusCode = apiError.response.status;
      const errorMessages: { [key: number]: string } = {
        400: "Invalid request. Please check your input.",
        409: "User already exists. Please try a different email or username.",
      };
      const message =
        errorMessages[statusCode] ||
        (statusCode >= 500
          ? "Server error. Please try again later."
          : "Error creating user. Please try again");
      errorMessage(message);
    } else {
      errorMessage("An unknown error occurred. Please try again later.");
    }
    console.error(err);
  }
};
