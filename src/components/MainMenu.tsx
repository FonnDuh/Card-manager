import {
  FunctionComponent,
  useEffect,
  useState,
  lazy,
  Suspense,
  useCallback,
  useMemo,
} from "react";
import { Card } from "../interfaces/Cards/Card";
import {
  deleteCard,
  getAllCards,
  toggleFavorite,
} from "../services/cardsService";
import { useNavigate } from "react-router-dom";
import { errorMessage, successMessage } from "../services/feedbackService";
import ErrorBoundary from "./Misc/ErrorBoundary";
import "../styles/MainMenu.css";
import { useDarkMode } from "../hooks/useDarkMode";
import LoadingSpinner from "./Misc/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";

const BizCard = lazy(() => import("./Card-menus/BizCard")),
  Pagination = lazy(() => import("./Misc/Pagination"));

const ITEMS_PER_PAGE = 20;

const MainMenu: FunctionComponent = () => {
  const [cards, setCards] = useState<Card[]>([]),
    [isLoading, setIsLoading] = useState<boolean>(true),
    [currentPage, setCurrentPage] = useState<number>(1),
    [isPopular, setIsPopular] = useState<boolean>(false);

  const navigate = useNavigate(),
    { isDarkMode } = useDarkMode(),
    { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cardsRes = await getAllCards();
        localStorage.setItem("allCards", JSON.stringify(cardsRes.data));
        setCards(cardsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        errorMessage("Error fetching cards");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  const handleFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsPopular(event.target.checked);
    },
    []
  );

  const sortedCards = useMemo(() => {
    if (!cards) {
      return [];
    }

    const sortByDate = (currentCard: Card, nextCard: Card) => {
      if (!currentCard.createdAt || !nextCard.createdAt) {
        return 0;
      }
      const currentData = new Date(currentCard.createdAt),
        nextData = new Date(nextCard.createdAt);
      if (isNaN(currentData.getTime()) || isNaN(nextData.getTime())) {
        return 0;
      }
      return nextData.getTime() - currentData.getTime();
    };

    const sortByLikes = (currentCard: Card, nextCard: Card) => {
        return (nextCard.likes?.length || 0) - (currentCard.likes?.length || 0);
      },
      filteredCards = cards.filter((card: Card) => card && card.createdAt);

    if (isPopular) {
      return [...filteredCards].sort(sortByLikes);
    } else {
      return [...filteredCards].sort(sortByDate);
    }
  }, [cards, isPopular]);

  const currentCards = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE,
      indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    return sortedCards.slice(indexOfFirstItem, indexOfLastItem);
  }, [sortedCards, currentPage]);

  useEffect(() => {
    if (currentCards.length === 0 && sortedCards.length > 0) {
      setCurrentPage(1);
    }
  }, [currentCards, sortedCards]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <section
          className={`main-menu-container ${isDarkMode ? "dark-mode" : ""}`}>
          <h1 className="display-2 text-center my-3">Posted Cards</h1>
          <label
            htmlFor="filter"
            className="filter-switch mb-3"
            aria-label="Toggle Filter">
            <input
              type="checkbox"
              id="filter"
              checked={isPopular}
              onChange={handleFilterChange}
            />
            <span>Latest</span>
            <span>Popular</span>
          </label>
          <div className="container-fluid d-flex justify-content-center">
            <div className="container">
              <div className="row d-flex flex-wrap justify-content-center">
                {currentCards.length > 0 ? (
                  currentCards.map((card) => (
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
                  <p className="display-6 text-center">No cards available.</p>
                )}
              </div>
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
        </section>
      )}
    </Suspense>
  );
};

export default MainMenu;
