import { Card } from "../../interfaces/Cards/Card";
import { formCard } from "../../interfaces/Cards/FormCard";

export function normalizeCard(card: formCard): Card {
  return {
    title: card.title,
    subtitle: card.subtitle,
    description: card.description,
    phone: card.phone,
    email: card.email,
    web: card.web,
    image: {
      url: card.url ?? "",
      alt: card.alt ?? "",
    },
    address: {
      state: card.state ?? "",
      country: card.country,
      city: card.city,
      street: card.street,
      houseNumber: card.houseNumber ?? 0,
      zip: card.zip ?? 0,
    },
  };
}
