import {
  FunctionComponent,
  useEffect,
  useState,
  useCallback,
  Suspense,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../interfaces/Cards/Card";
import { getCardById } from "../../services/cardsService";
import { Formik, FormikHelpers } from "formik";
import {
  getInitialValues,
  onSubmit as formOnSubmit,
  getValidationSchema,
} from "../../interfaces/Cards/NewCardForm";
import FormInput from "../Misc/FormInput";
import { useDarkMode } from "../../hooks/useDarkMode";
import LoadingSpinner from "../Misc/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import { ApiError } from "../../interfaces/ApiError";

const EditCard: FunctionComponent<object> = () => {
  const { cardId } = useParams<{ cardId: string }>(),
    [initialValues, setInitialValues] = useState(getInitialValues({} as Card)),
    [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate(),
    { isDarkMode } = useDarkMode(),
    { user } = useAuth();

  useEffect(() => {
    if (cardId) {
      const fetchCard = async () => {
        try {
          const res = await getCardById(cardId),
            card = res.data;
          setInitialValues(getInitialValues(card));
        } catch (err: unknown) {
          if (err && typeof err === "object" && "response" in err) {
            console.error((err as ApiError).response?.data);
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchCard();
    }
  }, [cardId]);

  const handleSubmit = useCallback(
    async (
      values: typeof initialValues,
      helpers: FormikHelpers<typeof initialValues>
    ) => {
      const formValues = {
        ...values,
      };
      await formOnSubmit(
        formValues,
        helpers,
        () => {
          navigate(-1);
        },
        true,
        cardId,
        user?.isAdmin
      );
    },
    [cardId, navigate, user]
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
          <h1 className="display-2 text-center">Edit Card</h1>
          <Formik
            initialValues={initialValues}
            validationSchema={getValidationSchema(user?.isAdmin || false)}
            onSubmit={handleSubmit}
            enableReinitialize>
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
                {user?.isAdmin && (
                  <div className="row g-3">
                    <div className="col-md">
                      <FormInput
                        name="bizNumber"
                        label="Business Number *"
                        type="number"
                      />
                    </div>
                  </div>
                )}
                <div className="d-flex justify-content-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary m-3 w-25"
                    disabled={!(formik.isValid && formik.dirty)}
                    aria-label="Submit">
                    Update Card
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger m-3 w-25"
                    onClick={() => navigate(-1)}
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

export default EditCard;
