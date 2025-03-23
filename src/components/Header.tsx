import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import NavBarLinks from "./Misc/NavBarLinks";
import ProfileMenu from "./Misc/ProfileMenu";
import { lazy, Suspense } from "react";
import "../styles/Header.css";
import "../styles/Misc/HeaderNavbar.css";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../hooks/useAuth";
import Weather from "./Misc/Weather";
import ErrorBoundary from "./Misc/ErrorBoundary";

const ConfirmModal = lazy(() => import("./Misc/ConfirmModal"));

const Header: FunctionComponent = () => {
  const [searchTerm, setSearchTerm] = useState<string>(""),
    [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(""),
    [showLogoutModal, setShowLogoutModal] = useState<boolean>(false),
    searchInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate(),
    location = useLocation(),
    { isDarkMode, toggleDarkMode } = useDarkMode(),
    { user, logout } = useAuth();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (!searchTerm && location.pathname === "/search") {
      navigate("/", { replace: true });
    }
    if (!debouncedSearchTerm) return;

    if (searchInputRef.current === document.activeElement) {
      if (
        location.pathname !== "/search" ||
        location.search !== `?query=${debouncedSearchTerm}`
      ) {
        navigate(`/search?query=${debouncedSearchTerm}`, { replace: true });
      }
    }
  }, [
    debouncedSearchTerm,
    searchTerm,
    navigate,
    location.pathname,
    location.search,
  ]);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = sessionStorage.getItem("token");
      if (token && token.split(".").length === 3) {
        logout();
      } else {
        logout();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [logout]);

  return (
    <header
      className={`header position-fixed w-100 ${
        isDarkMode ? "bg-dark text-white" : "bg-light text-dark"
      } py-3`}>
      <div className="container-fluid">
        <nav
          className={`navbar navbar-expand-lg ${
            isDarkMode ? "navbar-dark" : "navbar-light"
          }`}>
          <Link
            className="navbar-brand custom-btn d-flex align-items-center"
            to="/"
            onClick={() => setSearchTerm("")}>
            <img
              src="/src/assets/ace-of-spades-logo.png"
              alt="Logo"
              className="logo"
            />
            Home
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ErrorBoundary>
              <NavBarLinks user={user} />
            </ErrorBoundary>
            <div className="navbar-nav ms-auto d-flex align-items-center flex-row">
              <ErrorBoundary>
                <Weather />
              </ErrorBoundary>
              {(location.pathname === "/" ||
                location.pathname === "/search") && (
                <form
                  className="d-flex search"
                  role="search"
                  onSubmit={(e) => e.preventDefault()}>
                  <input
                    ref={searchInputRef}
                    className="form-control me-2"
                    type="search"
                    name="search"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>
              )}
              <label className="toggle-darkmode d-grid" htmlFor="switch">
                <input
                  id="switch"
                  className="input-darkmode"
                  type="checkbox"
                  onClick={toggleDarkMode}
                />
                <div className="icon icon--moon">
                  <svg
                    height="30"
                    width="30"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"></path>
                  </svg>
                </div>
                <div className="icon icon--sun">
                  <svg
                    height="30"
                    width="30"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"></path>
                  </svg>
                </div>
              </label>
              <ErrorBoundary>
                <ProfileMenu onLogout={() => setShowLogoutModal(true)} />
              </ErrorBoundary>
              <ErrorBoundary>
                <Suspense fallback={null}>
                  <ConfirmModal
                    show={showLogoutModal}
                    message="Are you sure you want to logout?"
                    onConfirm={logout}
                    onCancel={() => setShowLogoutModal(false)}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
