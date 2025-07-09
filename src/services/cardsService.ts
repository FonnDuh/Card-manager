import axios from "axios";
import { Card } from "../interfaces/Cards/Card";
import { User } from "../interfaces/Users/User";

const API: string = import.meta.env.VITE_CARDS_API;

// Get all cards
export function getAllCards() {
  return axios.get(API);
}

// Get card by id
export function getCardById(cardId: string) {
  return axios.get(`${API}/${cardId}`);
}

// Get all my cards
export function getMyCards() {
  return axios.get(`${API}/my-cards`, {
    headers: {
      "x-auth-token": sessionStorage.getItem("token"),
    },
  });
}

// Post new card
export function postCard(card: Card) {
  return axios.post(API, card, {
    headers: {
      "x-auth-token": sessionStorage.getItem("token"),
    },
  });
}

// Update card
export function updateCard(card: Card) {
  const { _id, ...cardWithoutId } = card;
  return axios.put(`${API}/${_id}`, cardWithoutId, {
    headers: {
      "x-auth-token": sessionStorage.getItem("token"),
    },
  });
}

// Like and unlike Card
export function likeCard(cardId: string) {
  return axios.patch(
    `${API}/${cardId}`,
    {},
    {
      headers: {
        "x-auth-token": sessionStorage.getItem("token"),
      },
    }
  );
}

// Toggle favorite status of a card
export async function toggleFavorite(
  card: Card,
  user: User | null,
  setCards: React.Dispatch<React.SetStateAction<Card[]>>,
  removeOnUnfavorite: boolean = false
) {
  if (!card._id || !user) return;

  try {
    await likeCard(card._id);

    setCards((prevCards) =>
      prevCards
        .map((existingCard) => {
          if (existingCard._id !== card._id) return existingCard;

          const likesArray = existingCard.likes ?? [],
            isLiked = likesArray.includes(user._id!);

          return {
            ...existingCard,
            likes: isLiked
              ? likesArray.filter((id) => id !== user._id!)
              : [...likesArray, user._id!],
          };
        })
        .filter((existingCard) =>
          removeOnUnfavorite
            ? (existingCard.likes ?? []).includes(user._id!)
            : true
        )
    );
  } catch (error) {
    console.error("Error toggling favorite status:", error);
  }
}

// Change card bizNumber
export function changeBizNumber(cardId: string, newBizNumber: number) {
  return axios.patch(
    `${API}/${cardId}/bizNumber`,
    { bizNumber: newBizNumber },
    {
      headers: {
        "x-auth-token": sessionStorage.getItem("token"),
      },
    }
  );
}

// Delete Card
export function deleteCard(cardId: string) {
  return axios.delete(`${API}/${cardId}`, {
    headers: {
      "x-auth-token": sessionStorage.getItem("token"),
    },
  });
}
