import { User } from "../../interfaces/Users/User";
import { formUser } from "../../interfaces/Users/FormUser";

export function normalizedUser(user: formUser): User {
  return {
    name: {
      first: user.first,
      middle: user.middle,
      last: user.last,
    },
    phone: user.phone,
    email: user.email,
    password: user.password,
    image: {
      url: user.url ?? "",
      alt: user.alt ?? "",
    },
    address: {
      state: user.state ?? "",
      country: user.country,
      city: user.city,
      street: user.street,
      houseNumber: (user.houseNumber as number),
      zip: (user.zip as number),
    },
    isBusiness: user.isBusiness,
  };
}
