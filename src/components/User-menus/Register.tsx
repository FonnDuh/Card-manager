import { FunctionComponent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  initialValues,
  validationSchema,
  onSubmit as formOnSubmit,
} from "../../interfaces/Users/NewUserForm";
import { Formik, FormikHelpers } from "formik";
import FormInput from "../Misc/FormInput";
import { useDarkMode } from "../../hooks/useDarkMode";

const passwordStrength = (password: string) => {
  const rules = [
      { regex: /[A-Z]/, text: "At least one uppercase letter" },
      { regex: /[a-z]/, text: "At least one lowercase letter" },
      { regex: /\d/, text: "At least one number" },
      {
        regex: /[!@#$%^&*\-/]/,
        text: "At least one special character (!@#$%^&*-)",
      },
      { regex: /^.{7,}$/, text: "At least 7 characters long" },
    ],
    passedRules = rules.filter((rule) => rule.regex.test(password)),
    strength = passedRules.length,
    strengthLevels = [
      {
        strength: 5,
        text: "Very Strong",
        color: "bg-success",
        width: "100%",
      },
      { strength: 4, text: "Strong", color: "bg-primary", width: "80%" },
      { strength: 3, text: "Medium", color: "bg-warning", width: "60%" },
      { strength: 2, text: "Weak", color: "bg-danger", width: "40%" },
      { strength: 1, text: "Very Weak", color: "bg-secondary", width: "20%" },
    ],
    level = strengthLevels.find((current) => current.strength === strength) ?? {
      text: "Very Weak",
      color: "bg-dark",
      width: "20%",
    };

  return { ...level };
};

const Register: FunctionComponent<object> = () => {
  const navigate = useNavigate(),
    { isDarkMode } = useDarkMode();

  const handleSubmit = async (
    values: typeof initialValues,
    helpers: FormikHelpers<typeof initialValues>
  ) => {
    await formOnSubmit(values, helpers, () => {
      navigate("/");
    });
  };

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
      <h1 className="display-3 text-center">Register</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {(formik) => {
          const strength = passwordStrength(formik.values.password);
          return (
            <form onSubmit={formik.handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <FormInput name="first" label="First Name *" />
                </div>
                <div className="col-md-4">
                  <FormInput name="middle" label="Middle Name" />
                </div>
                <div className="col-md-4">
                  <FormInput name="last" label="Last Name *" />
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <FormInput name="phone" label="Phone *" />
                </div>
                <div className="col-md-6">
                  <FormInput name="email" label="Email *" type="email" />
                </div>
              </div>
              <div className="row g-3 password-group">
                <div className="col-md-6">
                  <FormInput name="password" label="Password *" type="password" />
                  {formik.values.password && (
                    <div>
                      <div className="d-flex align-items-center justify-content-between">
                        <span>Password Strength:</span>
                        <span
                          className={`text-white px-2 py-1 rounded ${strength.color}`}>
                          {strength.text}
                        </span>
                      </div>
                      <div className="password-progress">
                        <div
                          className={`progress-bar ${strength.color}`}
                          style={{ width: strength.width }}></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <FormInput
                    name="confirmPassword"
                    label="Confirm Password *"
                    type="password"
                  />
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-7">
                  <FormInput name="url" label="Image URL" />
                </div>
                <div className="col-md-5">
                  <FormInput name="alt" label="Image Alt Text" />
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-4">
                  <FormInput name="state" label="State" />
                </div>
                <div className="col-md-4">
                  <FormInput name="country" label="Country *" />
                </div>
                <div className="col-md-4">
                  <FormInput name="city" label="City *" />
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <FormInput name="street" label="Street *" />
                </div>
                <div className="col-md-3">
                  <FormInput name="houseNumber" label="House Number *" />
                </div>
                <div className="col-md-3">
                  <FormInput name="zip" label="Zip Code *" />
                </div>
              </div>
              <FormInput name="isBusiness" label="Is Business" as="checkbox" />
              <div className="mt-5">
                <h6 className="text-center">
                  Already have an account? <Link to={"/login"}>Login</Link>
                </h6>
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-primary mt-3 mx-3 w-25"
                    disabled={!(formik.isValid && formik.dirty)}
                    aria-label="Register">
                    Register
                  </button>
                  <button
                    className="btn btn-danger mt-3 mx-3 w-25"
                    onClick={() => navigate(`/login`)}
                    aria-label="Cancel">
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Register;
