// Basically a parallel to "unnormalized user"
export interface formUser {
  first: string;
  middle?: string;
  last: string;
  phone: string;
  email: string;
  password: string;
  url?: string;
  alt?: string;
  state?: string;
  country: string;
  city: string;
  street: string;
  houseNumber: number;
  zip: number;
  isBusiness: boolean;
}
