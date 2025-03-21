import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "./styles/Misc/Buttons.css";
import "./styles/Misc/FormInput.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/Misc/ErrorBoundary";
import { AuthProvider } from "./context/AuthenticationContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/Misc/LoadingSpinner";

const MainMenu = lazy(() => import("./components/MainMenu")),
  NewCard = lazy(() => import("./components/Card-menus/NewCard")),
  About = lazy(() => import("./components/About")),
  Register = lazy(() => import("./components/User-menus/Register")),
  Login = lazy(() => import("./components/User-menus/Login")),
  FavoriteCards = lazy(() => import("./components/Card-menus/FavoriteCards")),
  SearchResults = lazy(() => import("./components/Card-menus/SearchResults")),
  Profile = lazy(() => import("./components/User-menus/Profile")),
  EditProfile = lazy(() => import("./components/User-menus/EditProfile")),
  MyCards = lazy(() => import("./components/Card-menus/MyCards")),
  EditCard = lazy(() => import("./components/Card-menus/EditCard")),
  CRM = lazy(() => import("./components/User-menus/CRM")),
  NotFound = lazy(() => import("./components/Misc/NotFound"));

function App() {
  return (
    <>
      <ToastContainer />
      <AuthProvider>
        <Router>
          <Header />
          <div className="d-flex flex-wrap justify-content-center">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ErrorBoundary>
                      <MainMenu />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/new-card"
                  element={
                    <ErrorBoundary>
                      <NewCard />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/my-cards/:cardId/edit"
                  element={
                    <ErrorBoundary>
                      <EditCard />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/my-cards"
                  element={
                    <ErrorBoundary>
                      <MyCards />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <ErrorBoundary>
                      <About />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/favorites"
                  element={
                    <ErrorBoundary>
                      <FavoriteCards />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <ErrorBoundary>
                      <Register />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <ErrorBoundary>
                      <Login />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <ErrorBoundary>
                      <SearchResults />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/profile/:userId"
                  element={
                    <ErrorBoundary>
                      <Profile />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/profile/:userId/edit"
                  element={
                    <ErrorBoundary>
                      <EditProfile />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/CRM"
                  element={
                    <ErrorBoundary>
                      <CRM />
                    </ErrorBoundary>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
