import {
  FunctionComponent,
  useEffect,
  useState,
  useMemo,
  Suspense,
} from "react";
import { User } from "../../interfaces/Users/User";
import { getUserById } from "../../services/userService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDarkMode } from "../../hooks/useDarkMode";
import LoadingSpinner from "../Misc/LoadingSpinner";

const Profile: FunctionComponent<object> = () => {
  const { userId } = useParams<{ userId: string }>(),
    [user, setUser] = useState<User | null>(null),
    [isLoading, setIsLoading] = useState<boolean>(true),
    [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(),
    { isDarkMode } = useDarkMode();

  const accountType = useMemo(() => {
    if (user) {
      if (user.isAdmin && user.isBusiness) {
        return "Admin & Business";
      } else if (user.isAdmin) {
        return "Admin";
      } else if (user.isBusiness) {
        return "Business";
      } else {
        return "Regular";
      }
    }
    return "";
  }, [user]);

  const capitalize = (str: string) => {
    return str ? str[0].toUpperCase() + str.slice(1) : "";
  };

  const fullName = useMemo(() => {
    if (user?.name) {
      const first = capitalize(user.name.first || ""),
        middle = user.name.middle ? `${capitalize(user.name.middle)} ` : "",
        last = capitalize(user.name.last || "");
      return `${first} ${middle}${last}`.trim();
    }
    return "No name provided";
  }, [user]);

  const formattedAddress = useMemo(() => {
    if (user && user.address) {
      const street = capitalize(user.address.street || ""),
        houseNumber = user.address.houseNumber || "",
        city = capitalize(user.address.city || ""),
        state = user.address.state ? ` ${capitalize(user.address.state)}` : "";
      return `${street} ${houseNumber}, ${city}${state}`;
    }
    return "No address provided";
  }, [user]);

  const formattedCreatedAt = useMemo(() => {
    if (user) {
      return new Date(user.createdAt || "No Date Found").toLocaleString(
        "en-GB",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }
      );
    }
    return "No Date Found";
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError("No user ID found");
        setIsLoading(false);
        return;
      }
      try {
        const response = await getUserById(userId),
          userData = response.data;
        // For some reason when address.state is empty the API returns it as "not defined", hence the check
        if (userData.address && userData.address.state === "not defined") {
          userData.address.state = "";
        }
        setUser(userData);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (error) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div
            className={`display-6 m-5 text-center ${
              isDarkMode ? "bg-dark text-white" : "bg-light text-dark"
            }`}>
            {error}
          </div>
        )}
      </Suspense>
    );
  }

  if (!user) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div
            className={`display-6 m-5 text-center ${
              isDarkMode ? "bg-dark text-white" : "bg-light text-dark"
            }`}>
            No user data available
          </div>
        )}
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div
          className={`container my-5 p-4 w-50 d-flex flex-column align-items-center position-relative ${
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
          <h1 className="display-2 text-center mb-4">User Profile</h1>
          <div
            className={`card w-50 ${
              isDarkMode ? "bg-dark text-white" : "bg-light text-dark"
            }`}
            style={{ maxWidth: "750px" }}>
            <div className="card-header text-center pt-3">
              <h2>{fullName}</h2>
            </div>
            <div className="card-body d-flex flex-column align-items-start pt-0">
              <img
                src={user.image.url || "https://via.placeholder.com/150"}
                alt={user.image.alt || "User Image"}
                className="img-fluid w-75 m-auto mb-2"
                aria-label="User Profile Image"
              />
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
              <p>
                <strong>Address:</strong> {formattedAddress}
              </p>
              <p>
                <strong>Country:</strong> {capitalize(user.address.country)}
              </p>
              <p>
                <strong>Zip:</strong> {user.address.zip}
              </p>
              <p>
                <strong>Account Type:</strong> {accountType}
              </p>
              <p>
                <strong>User Created At:</strong> {formattedCreatedAt}
              </p>
              <p>
                <strong>User Id:</strong> {user._id}
              </p>
            </div>
          </div>
          <Link
            className={`btn mt-4 edit ${isDarkMode ? "btn-light" : "btn-dark"}`}
            to={`/profile/${user._id}/edit`}
            aria-label="Edit Profile">
            Edit
          </Link>
        </div>
      )}
    </Suspense>
  );
};

export default Profile;
