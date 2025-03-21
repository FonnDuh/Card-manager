import {
  FunctionComponent,
  useEffect,
  useState,
  lazy,
  Suspense,
  useCallback,
  useMemo,
} from "react";
import { Card } from "../../interfaces/Cards/Card";
import {
  deleteCard,
  getMyCards,
  toggleFavorite,
} from "../../services/cardsService";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "../Misc/ErrorBoundary";
import "../../styles/MainMenu.css"; // Exact same CSS as MainMenu.tsx
import { useDarkMode } from "../../hooks/useDarkMode";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../Misc/LoadingSpinner";
import { errorMessage, successMessage } from "../../services/feedbackService";

const BizCard = lazy(() => import("./BizCard")),
  Pagination = lazy(() => import("../Misc/Pagination"));

const ITEMS_PER_PAGE = 20;

const MyCards: FunctionComponent = () => {
  const [cards, setCards] = useState<Card[]>([]),
    [isLoading, setIsLoading] = useState<boolean>(true),
    [currentPage, setCurrentPage] = useState<number>(1);

  const navigate = useNavigate(),
    { isDarkMode } = useDarkMode(),
    { user } = useAuth();

  useEffect(() => {
    const fetchUserAndCards = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return setIsLoading(false);
      try {
        const cardsRes = await getMyCards();
        setCards(cardsRes.data);
      } catch (err: unknown) {
        console.error(
          "Error fetching data:",
          err instanceof Error ? err.message : "An error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserAndCards();
  }, []);

  const handleDeleteCard = useCallback(async (cardId: string) => {
    try {
      await deleteCard(cardId);
      setCards((prevCards) => prevCards.filter((card) => card._id !== cardId));
      successMessage("Card deleted successfully");
    } catch (error) {
      console.error("Error deleting card:", error);
      errorMessage("Failed to delete card");
    }
  }, []);

  const paginate = useCallback(
    (pageNumber: number) => setCurrentPage(pageNumber),
    []
  );

  const currentCards = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE,
      indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    return cards.slice(indexOfFirstItem, indexOfLastItem);
  }, [cards, currentPage]);

  useEffect(() => {
    if (currentCards.length === 0 && cards.length > 0) {
      setCurrentPage(1);
    }
  }, [currentCards, cards]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <section
          className={`main-menu-container ${isDarkMode ? "dark-mode" : ""}`}>
          <h1 className="display-2 text-center my-3">My Cards</h1>
          <div className="container-fluid d-flex justify-content-center">
            <div className="container">
              <div className="row">
                {currentCards.length > 0 ? (
                  currentCards.map((card: Card) => (
                    <div
                      key={card._id}
                      className="col-sm-12 col-md-6 col-lg d-flex justify-content-center p-4">
                      <ErrorBoundary>
                        <BizCard
                          card={card}
                          onDelete={handleDeleteCard}
                          toggleFavorite={(card) =>
                            toggleFavorite(card, user, setCards, false)
                          }
                        />
                      </ErrorBoundary>
                    </div>
                  ))
                ) : (
                  <p
                    className={`text-center display-6 p-2 ${
                      isDarkMode ? "text-light" : "text-muted"
                    }`}>
                    No cards found.
                  </p>
                )}
              </div>
            </div>
          </div>
          {(user?.isBusiness || user?.isAdmin) && (
            <button
              className="icon-btn add-btn position-fixed overflow-hidden"
              onClick={() => navigate("/new-card")}>
              <div className="add-icon"></div>
              <div className="btn-txt text-nowrap">Add Card</div>
            </button>
          )}
          {cards.length > ITEMS_PER_PAGE && (
            <div className="d-flex justify-content-center my-4">
              <Pagination
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={cards.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          )}
        </section>
      )}
    </Suspense>
  );
};

export default MyCards;
