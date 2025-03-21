import * as yup from "yup";
import {
  changeBizNumber,
  postCard,
  updateCard,
} from "../../services/cardsService";
import { errorMessage, successMessage } from "../../services/feedbackService";
import { Card } from "./Card";
import { normalizeCard } from "../../utilities/cards/NormalizeCard";
import { ApiError } from "../ApiError";

// For new card
export const initialValues = {
  title: "",
  subtitle: "",
  description: "",
  phone: "",
  email: "",
  web: "",
  url: "",
  alt: "",
  state: "",
  country: "",
  city: "",
  street: "",
  houseNumber: 0,
  zip: 0,
  bizNumber: 0,
};

// To edit existing card
export const getInitialValues = (card: Card) => ({
  title: card?.title || "",
  subtitle: card?.subtitle || "",
  description: card?.description || "",
  phone: card?.phone || "",
  email: card?.email || "",
  web: card?.web || "",
  url: card?.image?.url || "",
  alt: card?.image?.alt || "",
  state: card?.address?.state || "",
  country: card?.address?.country || "",
  city: card?.address?.city || "",
  street: card?.address?.street || "",
  houseNumber: card?.address?.houseNumber || 0,
  zip: card?.address?.zip || 0,
  bizNumber: card?.bizNumber || 0,
});

export const getValidationSchema = (isUserAdmin: boolean) => {
  return yup.object({
    title: yup.string().min(2).max(256).required("Title is required"),
    subtitle: yup.string().min(2).max(256).required("Subtitle is required"),
    description: yup
      .string()
      .min(2, "Must be at least 2 characters long")
      .max(1024, "Much be less than 1024 Characters")
      .required("Description is required"),
    phone: yup.string().min(9).max(11).required("Phone is required"),
    email: yup.string().email().min(5).required("Email is required"),
    web: yup
      .string()
      .min(14, "Website Link must be at least 14 characters")
      .url("Invalid URL"),
    url: yup
      .string()
      .min(14, "Image URL must be at least 14 characters")
      .url("Invalid URL"),
    alt: yup.string().min(2, "Image Alt must at least 2 characters").max(256),
    state: yup.string(),
    country: yup.string().required("Country is required"),
    city: yup.string().required("City is required"),
    street: yup.string().required("Street is required"),
    houseNumber: yup
      .number()
      .min(1, "House Number must be 2 numbers or more")
      .required("House Number is required"),
    zip: yup.number().required("Zip is required"),
    bizNumber: isUserAdmin
      ? yup
          .number()
          .min(1000000, "Business Number must be at least 7 numbers")
          .max(9999999, "Business Number must be at most 7 numbers")
          .required("Business Number is required")
      : yup.number(),
  });
};

export const onSubmit = async (
  values: typeof initialValues,
  helpers: { resetForm: () => void },
  onSuccess: () => void,
  isEdit: boolean,
  cardId?: string,
  isUserAdmin?: boolean
) => {
  try {
    const normalizedCard = normalizeCard(values);

    if (isEdit && cardId) {
      if (isUserAdmin && values.bizNumber) {
        await changeBizNumber(cardId, Number(values.bizNumber));
      }
      const response = await updateCard({ _id: cardId, ...normalizedCard });
      if (response) {
        helpers.resetForm();
        successMessage("Card successfully updated");
        onSuccess();
      } else {
        throw new Error("Update failed. Please try again later.");
      }
    } else {
      const response = await postCard(normalizedCard);
      if (response) {
        helpers.resetForm();
        successMessage("Card successfully posted");
        onSuccess();
      } else {
        throw new Error("Post failed. Please try again later.");
      }
    }
  } catch (err: Error | unknown) {
    if (err && typeof err === "object" && "response" in err) {
      const apiError = err as ApiError;
      if (apiError.response.status === 400) {
        errorMessage("Invalid input. Please check your values and try again.");
      } else if (apiError.response.status === 401) {
        errorMessage("You are not authorized to perform this action.");
      } else if (apiError.response.status === 500) {
        errorMessage("Internal server error. Please try again later.");
      } else {
        errorMessage("Connection error. Please try again later.");
      }
    } else if (err instanceof Error && err.message === "Update failed") {
      errorMessage("Failed to update card. Please try again later.");
    } else if (err instanceof Error && err.message === "Post failed") {
      errorMessage("Failed to post card. Please try again later.");
    } else {
      errorMessage("An error occurred during submission");
    }
  }
};
