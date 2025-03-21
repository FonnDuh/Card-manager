import * as yup from "yup";
import { changeBizStatus, updateUser } from "../../services/userService";
import { successMessage, errorMessage } from "../../services/feedbackService";
import { User } from "../../interfaces/Users/User";
import { NavigateFunction } from "react-router-dom";
import { ApiError } from "../ApiError";

export const getInitialValues = (user: User) => ({
  name: {
    first: user?.name?.first || "",
    middle: user?.name?.middle || "",
    last: user?.name?.last || "",
  },
  phone: user?.phone || "",
  image: {
    url: user?.image?.url || "",
    alt: user?.image?.alt || "",
  },
  address: {
    state: user?.address?.state || "",
    country: user?.address?.country || "",
    city: user?.address?.city || "",
    street: user?.address?.street || "",
    houseNumber: user?.address?.houseNumber || 0,
    zip: user?.address?.zip || 0,
  },
  isBusiness: user?.isBusiness || false,
});

export const getValidationSchema = (isUserAdmin: boolean) => {
  return yup.object({
    name: yup.object({
      first: yup.string().min(2).max(256).required("First name is required"),
      middle: yup.string().min(2).max(256),
      last: yup.string().min(2).max(256).required("Last name is required"),
    }),
    phone: yup.string().min(9).max(11).required("Phone is required"),
    image: yup.object({
      url: yup.string().min(14).url("Invalid URL"),
      alt: yup.string().min(2).max(256),
    }),
    address: yup.object({
      state: yup.string().min(2).max(256),
      country: yup.string().min(2).max(256).required("Country is required"),
      city: yup.string().min(2).max(256).required("City is required"),
      street: yup.string().min(2).max(256).required("Street is required"),
      houseNumber: yup
        .number()
        .min(2)
        .max(10000000)
        .required("House number is required"),
      zip: yup.number().min(2).max(10000000).required("Zip code is required"),
    }),
    isBusiness: isUserAdmin ? yup.boolean().required() : yup.boolean(),
  });
};

export const onSubmit = async (
  values: ReturnType<typeof getInitialValues>,
  navigate: NavigateFunction,
  userId: string,
  isAdmin: boolean,
  originalIsBusiness: boolean
) => {
  const { isBusiness, ...userValues } = values;
  try {
    if (isAdmin && originalIsBusiness !== isBusiness) {
      try {
        await changeBizStatus(userId);
        successMessage("Business status change successful");
      } catch (err: Error | unknown) {
        if (err && typeof err === "object" && "response" in err) {
          const apiError = err as ApiError;
          if (apiError.response.status === 400) {
            errorMessage("Invalid business status update. Please try again.");
            console.error(apiError.response.data);
          } else if (apiError.response.status === 401) {
            errorMessage("You are not authorized to update business status.");
            console.error(apiError.response.data);
          } else if (apiError.response.status === 500) {
            errorMessage("Internal server error. Please try again later.");
            console.error(apiError.response.data);
          } else {
            errorMessage("Connection error. Please try again later.");
            console.error(apiError.response.data);
          }
        } else {
          errorMessage(
            "Failed to update business status. Please try again later."
          );
          console.error(err);
        }
        return;
      }
    }
    const response = await updateUser(userId, userValues);
    if (response) {
      successMessage("Profile updated successfully");
      navigate("/profile/" + userId);
    } else {
      throw new Error("Update failed. Please try again later.");
    }
  } catch (err: Error | unknown) {
    if (err && typeof err === "object" && "response" in err) {
      const apiError = err as ApiError;
      if (apiError.response.status === 400) {
        errorMessage("Invalid input. Please check your values and try again.");
        console.error(apiError.response.data);
      } else if (apiError.response.status === 401) {
        errorMessage("You are not authorized to update your profile.");
        console.error(apiError.response.data);
      } else if (apiError.response.status === 500) {
        errorMessage("Internal server error. Please try again later.");
        console.error(apiError.response.data);
      } else {
        errorMessage("Connection error. Please try again later.");
        console.error(apiError.response.data);
      }
    } else if (err instanceof Error && err.message === "Update failed") {
      errorMessage("Failed to update profile. Please try again later.");
      console.error(err);
    } else {
      errorMessage(
        "An error occurred during profile update. Please try again later."
      );
      console.error(err);
    }
  }
};
