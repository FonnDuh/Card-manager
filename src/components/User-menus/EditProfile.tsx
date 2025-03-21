import { FunctionComponent, Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import { getUserbyId } from "../../services/userService";
import {
  getInitialValues,
  onSubmit,
  getValidationSchema,
} from "../../interfaces/Users/UpdateUserForm";
import FormInput from "../Misc/FormInput";
import { useDarkMode } from "../../hooks/useDarkMode";
import LoadingSpinner from "../Misc/LoadingSpinner";
import { errorMessage } from "../../services/feedbackService";
import { User } from "../../interfaces/Users/User";
import { useAuth } from "../../hooks/useAuth";

const EditProfile: FunctionComponent = () => {
  const { userId } = useParams<{ userId: string }>(),
    [initialValues, setInitialValues] = useState(getInitialValues({} as User)),
    [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate(),
    { isDarkMode } = useDarkMode(),
    { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await getUserbyId(userId!);
        // For some reason when address.state is empty the API returns it as "not defined", hence the check
        if (data.address && data.address.state === "not defined") {
          data.address.state = "";
        }
        const initialVals = getInitialValues(data);
        setInitialValues(initialVals);
      } catch (err) {
        console.error(err);
        errorMessage("Failed to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleSubmit = async (values: typeof initialValues) => {
    await onSubmit(
      values,
      navigate,
      userId as string,
      user?.isAdmin as boolean,
      initialValues?.isBusiness as boolean
    );
  };

  if (!initialValues || isLoading)
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <LoadingSpinner />
      </Suspense>
    );

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
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
          <h1 className="display-2 text-center">Edit Profile</h1>
          <Formik
            initialValues={initialValues}
            validationSchema={getValidationSchema(user?.isAdmin || false)}
            onSubmit={handleSubmit}
            enableReinitialize>
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <FormInput name="name.first" label="First Name *" />
                  </div>
                  <div className="col-md-4">
                    <FormInput name="name.middle" label="Middle Name" />
                  </div>
                  <div className="col-md-4">
                    <FormInput name="name.last" label="Last Name *" />
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-md-12">
                    <FormInput name="phone" label="Phone *" />
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-md-7">
                    <FormInput name="image.url" label="Image URL" />
                  </div>
                  <div className="col-md-5">
                    <FormInput name="image.alt" label="Image Alt Text" />
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-md-4">
                    <FormInput name="address.state" label="State" />
                  </div>
                  <div className="col-md-4">
                    <FormInput name="address.country" label="Country *" />
                  </div>
                  <div className="col-md-4">
                    <FormInput name="address.city" label="City *" />
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <FormInput name="address.street" label="Street *" />
                  </div>
                  <div className="col-md-3">
                    <FormInput
                      name="address.houseNumber"
                      label="House Number *"
                    />
                  </div>
                  <div className="col-md-3">
                    <FormInput name="address.zip" label="Zip *" />
                  </div>
                </div>
                {user?.isAdmin && (
                  <FormInput
                    name="isBusiness"
                    label="Is Business"
                    as="checkbox"
                  />
                )}
                <div className="d-flex justify-content-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary m-3 w-25"
                    disabled={!formik.isValid || !formik.dirty}
                    aria-label="Submit">
                    Update Profile
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger m-3 w-25"
                    onClick={() => navigate(`/profile/${userId}`)}
                    aria-label="Cancel">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      )}
    </Suspense>
  );
};

export default EditProfile;
