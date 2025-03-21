import { FunctionComponent, useCallback, useMemo } from "react";
import { Formik, FormikHelpers } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { loginUser } from "../../services/userService";
import { errorMessage, successMessage } from "../../services/feedbackService";
import FormInput from "../Misc/FormInput";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useAuth } from "../../hooks/useAuth";
import { ApiError } from "../../interfaces/ApiError";

const formOnSubmit = async (
  values: { email: string; password: string },
  helpers: FormikHelpers<{ email: string; password: string }>,
  onSuccess: () => void,
  login: (token: string) => void
) => {
  try {
    const response = await loginUser(values),
      token = response.data;
    if (token) {
      login(token);
      helpers.resetForm();
      successMessage(
        `${values.email.trim().split("@")[0]} has logged in successfully`
      );
      onSuccess();
    } else {
      throw new Error("Token is undefined");
    }
  } catch (err: Error | unknown) {
    if (err && typeof err === "object" && "response" in err) {
      const apiError = err as ApiError;
      if (apiError.response.status === 401) {
        errorMessage("Email or Password is incorrect");
      } else {
        errorMessage("Connection error. Please try again later.");
      }
    } else if (err instanceof Error && err.message === "Token is undefined") {
      errorMessage("Token is undefined. Please try again later.");
    } else {
      errorMessage("An error occurred during login");
    }
  }
};

const Login: FunctionComponent<object> = () => {
  const navigate = useNavigate(),
    { isDarkMode } = useDarkMode(),
    { login } = useAuth();

  const initialValues = useMemo(
    () => ({
      email: "",
      password: "",
    }),
    []
  );

  const validationSchema = useMemo(
    () =>
      yup.object({
        email: yup.string().email().min(5).required("Email is required"),
        password: yup
          .string()
          .min(7)
          .max(20)
          .required("Password is required")
          .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*\-"])[A-Za-z\d!@#$%^&*\-"]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-"), and be at least 8 characters long'
          ),
      }),
    []
  );

  const handleSubmit = useCallback(
    async (
      values: typeof initialValues,
      helpers: FormikHelpers<typeof initialValues>
    ) => {
      await formOnSubmit(
        values,
        helpers,
        () => {
          navigate("/");
        },
        login
      );
    },
    [navigate, login]
  );

  return (
    <div
      className={`container my-5 w-50 position-relative ${
        isDarkMode ? "bg-dark text-white" : "bg-light text-dark"
      }`}>
      <button
        className="back-button position-absolute d-flex align-items-center justify-content-center"
        onClick={() => navigate(-1)}
        aria-label="Go Back">
        <svg height="28" width="28" viewBox="0 0 1024 1024">
          <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
        </svg>
        <span>Go Back</span>
      </button>
      <h1 className="display-2 text-center mb-4">Login</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <div className="form-floating mb-3">
              <FormInput name="email" label="Email" type="email" />
            </div>
            <div className="form-floating mb-3">
              <FormInput name="password" label="Password" type="password" />
            </div>
            <h6 className="text-center">
              Don't have an account? <Link to={"/register"}>Sign Up</Link>
            </h6>
            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-primary mt-3 mx-3 w-25"
                disabled={!(formik.isValid && formik.dirty)}>
                Login
              </button>
              <button
                className="btn btn-danger mt-3 mx-3 w-25"
                onClick={() => navigate(`/`)}
                aria-label="Cancel">
                Cancel
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
