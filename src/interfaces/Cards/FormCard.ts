// Basically a parallel to "unnormalized card"
export interface formCard {
  title: string;
  subtitle: string;
  description: string;
  phone: string;
  email: string;
  web: string;
  url?: string;
  alt?: string;
  state?: string;
  country: string;
  city: string;
  street: string;
  houseNumber: number;
  zip: number;
}
