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
  getAllCards,
  toggleFavorite,
} from "../../services/cardsService";
import ErrorBoundary from "../Misc/ErrorBoundary";
import "../../styles/Card/FavoriteCards.css";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useAuth } from "../../hooks/useAuth";
import { errorMessage, successMessage } from "../../services/feedbackService";
import LoadingSpinner from "../Misc/LoadingSpinner";

const BizCard = lazy(() => import("./BizCard")),
  Pagination = lazy(() => import("../Misc/Pagination"));

const ITEMS_PER_PAGE = 20;

const FavoriteCards: FunctionComponent = () => {
  const [cards, setCards] = useState<Card[]>([]),
    [isLoading, setIsLoading] = useState<boolean>(true),
    [currentPage, setCurrentPage] = useState<number>(1);

  const { isDarkMode } = useDarkMode(),
    { user } = useAuth();

  useEffect(() => {
    const fetchUserAndCards = async () => {
      if (!user) return setIsLoading(false);
      try {
        if (!sessionStorage.getItem("token")) return setIsLoading(false);
        const cardsRes = await getAllCards(),
          favoriteCards = cardsRes.data.filter((card: Card) =>
            card.likes?.includes(user._id as string)
          );
        setCards(favoriteCards);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndCards();
  }, [user]);

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

  const favoriteCardsList = useMemo(
    () =>
      currentCards.length > 0 ? (
        currentCards.map((card: Card) => (
          <div
            key={card._id}
            className="col-sm-12 col-md-6 col-lg d-flex justify-content-center p-4">
            <ErrorBoundary>
              <BizCard
                card={card}
                onDelete={handleDeleteCard}
                toggleFavorite={(card) =>
                  toggleFavorite(card, user, setCards, true)
                }
              />
            </ErrorBoundary>
          </div>
        ))
      ) : (
        <p className="display-6 text-center">No favorite cards found.</p>
      ),
    [user, handleDeleteCard, currentCards]
  );

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <section
          className={`favorite-cards-container ${
            isDarkMode ? "dark-mode" : ""
          }`}>
          <h1 className="display-2 text-center">Favorite Cards</h1>
          <div className="container-fluid d-flex justify-content-center">
            <div className="container">
              <div className="row">{favoriteCardsList}</div>
            </div>
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
        </section>
      )}
    </Suspense>
  );
};

export default FavoriteCards;
