import {
  FunctionComponent,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import "../../styles/User/CRM.css";
import Fuse from "fuse.js";
import { User } from "../../interfaces/Users/User";
import { useAuth } from "../../hooks/useAuth";
import { deleteUser, getAllUsers } from "../../services/userService";
import { errorMessage, successMessage } from "../../services/feedbackService";
import LoadingSpinner from "../Misc/LoadingSpinner";
import UserTable from "./userTable";
import ErrorBoundary from "../Misc/ErrorBoundary";

const Pagination = lazy(() => import("../Misc/Pagination")),
  ConfirmModal = lazy(() => import("../Misc/ConfirmModal"));

const ITEMS_PER_PAGE = 20;

const CRM: FunctionComponent = () => {
  const [users, setUsers] = useState<User[]>([]),
    [isLoading, setIsLoading] = useState(true),
    [error, setError] = useState<string | null>(null),
    [currentPage, setCurrentPage] = useState(1),
    [showDeleteModal, setShowDeleteModal] = useState(false),
    [userIdToDelete, setUserIdToDelete] = useState<string | null>(null),
    [searchQuery, setSearchQuery] = useState(""),
    [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setIsLoading(true);
      return;
    }

    if (!user.isAdmin) {
      setError("You are not authorized to view this page.");
      setIsLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data } = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch users.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = useCallback(async () => {
    if (!userIdToDelete) return;

    try {
      await deleteUser(userIdToDelete);
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.filter((u) => u._id !== userIdToDelete);
        if (updatedUsers.length % ITEMS_PER_PAGE === 0 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
        return updatedUsers;
      });
      successMessage("User Deleted Successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      errorMessage("Failed to Delete User");
    } finally {
      setShowDeleteModal(false);
      setUserIdToDelete(null);
    }
  }, [userIdToDelete, currentPage]);

  const fuse = useMemo(
    () =>
      new Fuse(users, {
        keys: [
          "name.first",
          "name.middle",
          "name.last",
          "email",
          "phone",
          "address.state",
          "address.country",
          "address.city",
          "address.street",
          "address.houseNumber",
          "address.zip",
        ],
        threshold: 0.3,
      }),
    [users]
  );

  const filteredUsers = useMemo(() => {
    return debouncedSearchQuery
      ? fuse.search(debouncedSearchQuery).map((result) => result.item)
      : users;
  }, [debouncedSearchQuery, users, fuse]);

  const currentUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
    },
    []
  );

  const paginate = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const userToDelete = useMemo(
    () => users.find((user) => user._id === userIdToDelete),
    [users, userIdToDelete]
  );

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <div className="d-flex justify-content-center">Error: {error}</div>;

  return (
    <div className="crm-container">
      <h2 className="display-2">User List</h2>
      <div className="search-container inputbox">
        <input
          type="text"
          id="search"
          placeholder=""
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <span>Search by name, email, phone, or address</span>
        <i></i>
      </div>
      {filteredUsers.length === 0 ? (
        <div className="display-5">No users found</div>
      ) : (
        <ErrorBoundary>
          <UserTable
            users={currentUsers}
            onDelete={(userId) => {
              setShowDeleteModal(true);
              setUserIdToDelete(userId);
            }}
          />
        </ErrorBoundary>
      )}
      <Suspense fallback={<LoadingSpinner />}>
        <Pagination
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredUsers.length}
          paginate={paginate}
          currentPage={currentPage}
        />
        <ErrorBoundary>
          <ConfirmModal
            show={showDeleteModal}
            message={
              userToDelete
                ? `Are You Sure You Want To Delete This User? (${
                    userToDelete.name.first
                  } ${userToDelete.name.middle || ""} ${
                    userToDelete.name.last
                  })`
                : "User not found"
            }
            onConfirm={handleDelete}
            onCancel={() => {
              setShowDeleteModal(false);
              setUserIdToDelete(null);
            }}
          />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};

export default CRM;
