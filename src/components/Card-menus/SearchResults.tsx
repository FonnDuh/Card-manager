import {
  FunctionComponent,
  useState,
  useEffect,
  Suspense,
  useMemo,
  useCallback,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../../interfaces/Cards/Card";
import { deleteCard, toggleFavorite } from "../../services/cardsService";
import { errorMessage, successMessage } from "../../services/feedbackService";
import LoadingSpinner from "../Misc/LoadingSpinner";
import ErrorBoundary from "../Misc/ErrorBoundary";
import BizCard from "./BizCard";
import Pagination from "../Misc/Pagination";
import Fuse from "fuse.js";

const ITEMS_PER_PAGE = 20;

const SearchResults: FunctionComponent<object> = () => {
  const [cards, setCards] = useState<Card[]>([]),
    [isLoading, setIsLoading] = useState<boolean>(true),
    [error, setError] = useState<string | null>(null),
    [currentPage, setCurrentPage] = useState<number>(1);

  const navigate = useNavigate(),
    location = useLocation(),
    { user } = useAuth(),
    query = useMemo(
      () => new URLSearchParams(location.search).get("query") || "",
      [location.search]
    );

  useEffect(() => {
    if (!query.trim()) return;
    const fetchCards = async () => {
      try {
        const allCards = JSON.parse(localStorage.getItem("allCards") || "[]");
        setCards(allCards);
        setIsLoading(false);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error has occurred");
        setIsLoading(false);
      }
    };
    fetchCards();
  }, [query, navigate]);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
    }
  }, [user]);

  const fuse = useMemo(
    () =>
      new Fuse(cards, {
        keys: [
          "title",
          "subtitle",
          "description",
          "phone",
          "email",
          "address.state",
          "address.country",
          "address.city",
          "address.street",
          "address.houseNumber",
          "address.zip",
          "bizNumber",
          "createdAt",
        ],
        threshold: 0.3,
      }),
    [cards]
  );

  const filteredCards = useMemo(() => {
    return query ? fuse.search(query).map((result) => result.item) : cards;
  }, [query, fuse, cards]);

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
    return filteredCards.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredCards, currentPage]);

  useEffect(() => {
    if (currentCards.length === 0 && filteredCards.length > 0) {
      setCurrentPage(1);
    }
  }, [currentCards, filteredCards]);

  if (error) {
    return <p className="display-6 m-5 text-center">{error}</p>;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <h1 className="display-2 text-center my-4">Search</h1>
          <div className="container-fluid d-flex justify-content-center align-items-center mb-5">
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
                  <p className="display-6 text-center ">No cards found.</p>
                )}
              </div>
              {filteredCards.length > ITEMS_PER_PAGE && (
                <div className="d-flex justify-content-center my-4">
                  <Pagination
                    itemsPerPage={ITEMS_PER_PAGE}
                    totalItems={filteredCards.length}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Suspense>
  );
};

export default SearchResults;
