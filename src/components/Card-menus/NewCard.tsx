import { Formik, FormikHelpers } from "formik";
import { FunctionComponent } from "react";
import FormInput from "../Misc/FormInput";
import {
  initialValues,
  onSubmit as formOnSubmit,
  getValidationSchema,
} from "../../interfaces/Cards/NewCardForm";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../hooks/useDarkMode";

const NewCard: FunctionComponent<object> = () => {
  const navigate = useNavigate(),
    { isDarkMode } = useDarkMode(),
    handleSubmit = async (
      values: typeof initialValues,
      helpers: FormikHelpers<typeof initialValues>
    ) => {
      await formOnSubmit(
        values,
        helpers,
        () => {
          navigate(-1);
        },
        false
      );
    };

  return (
    <div
      className={`container my-5 w-50 ${
        isDarkMode ? "bg-dark text-white" : "bg-light text-dark"
      }`}>
      <h1 className="display-2 text-center">New Card</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={getValidationSchema(false)}
        onSubmit={handleSubmit}>
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <FormInput name="title" label="Title *" />
              </div>
              <div className="col-md-6">
                <FormInput name="subtitle" label="Subtitle *" />
              </div>
            </div>
            <div className="row g-3">
              <div className="col-12">
                <FormInput
                  name="description"
                  label="Description *"
                  as="textarea"
                  rows={4}
                />
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
            <div className="row g-3">
              <div className="col-md">
                <FormInput name="web" label="Website Link" />
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-7">
                <FormInput name="url" label="Card Image URL" />
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
            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-primary mt-3 mx-3 w-25"
                disabled={!(formik.isValid && formik.dirty)}>
                Post Card
              </button>
              <button
                className="btn btn-danger mt-3 mx-3 w-25"
                onClick={() => navigate(-1)}
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

export default NewCard;
