import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { User } from "../../interfaces/Users/User";
import { useDarkMode } from "../../hooks/useDarkMode";
import "../../styles/User/UserTable.css";

interface UserTableProps {
  users: User[];
  onDelete: (userId: string) => void;
}

const UserTable: FunctionComponent<UserTableProps> = ({ users, onDelete }) => {
  const { isDarkMode } = useDarkMode(),
    capitalize = (str: string) => str && str[0].toUpperCase() + str.slice(1);

  const formatName = (name: { first: string; middle?: string; last: string }) =>
    `${capitalize(name.first)} ${capitalize(name.middle || "")} ${capitalize(
      name.last
    )}`;

  const formatAddress = (address: {
    state?: string;
    country: string;
    city: string;
    street: string;
    houseNumber: number;
  }) =>
    `${capitalize(address.street)} ${address.houseNumber} ${capitalize(
      address.city
    )}, ${
      // If state is empty the API sets it to "not defined" so check is to the save space on screen
      address.state && address.state !== "not defined"
        ? `${capitalize(address.state)}, `
        : ""
    }${capitalize(address.country)}`;

  const formatType = (isAdmin: boolean, isBusiness: boolean) =>
    isAdmin
      ? isBusiness
        ? "Admin, Business"
        : "Admin"
      : isBusiness
      ? "Business"
      : "";

  const formatCreatedAt = (createdAt: string) => {
    const date = new Date(createdAt || "No Date Found");
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <table className={`table-dark user-table ${isDarkMode ? "dark-mode" : ""}`}>
      <thead>
        <tr>
          <th scope="col">User ID</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Phone</th>
          <th scope="col">Address</th>
          <th scope="col">Type</th>
          <th scope="col">Created At</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user._id}</td>
            <td>{formatName(user.name)}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
            <td>{formatAddress(user.address)}</td>
            <td>{formatType(user.isAdmin as boolean, user.isBusiness)}</td>
            <td>{formatCreatedAt(user.createdAt || "No Date Found")}</td>
            <td>
              <Link
                to={`/profile/${user._id}`}
                className="btn btn-outline-primary btn-sm mb-1">
                View
              </Link>
              <Link
                to={`/profile/${user._id}/edit`}
                className="btn btn-outline-success btn-sm mb-1">
                Edit
              </Link>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => onDelete(user._id as string)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
