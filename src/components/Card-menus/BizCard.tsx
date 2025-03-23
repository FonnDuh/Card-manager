import {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { Card } from "../../interfaces/Cards/Card";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Card/BizCard.css";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useAuth } from "../../hooks/useAuth";
import ErrorBoundary from "../Misc/ErrorBoundary";

interface BizCardProps {
  card: Card;
  onDelete?: (cardId: string) => void;
  toggleFavorite: (card: Card) => void;
}

const ConfirmModal = lazy(() => import("../Misc/ConfirmModal")),
  BizCardModal = lazy(() => import("./BizCardModal"));

const BizCard: FunctionComponent<BizCardProps> = ({
  card,
  onDelete,
  toggleFavorite,
}) => {
  const [showModal, setShowModal] = useState(false),
    [isFavorite, setIsFavorite] = useState(false),
    [showDeleteModal, setShowDeleteModal] = useState(false),
    [showExtraButtons, setShowExtraButtons] = useState(false);

  const navigate = useNavigate(),
    { isDarkMode } = useDarkMode(),
    { user } = useAuth();

  useEffect(() => {
    if (user && user._id)
      setIsFavorite(card.likes?.includes(user._id) ?? false);
  }, [card.likes, user]);

  useEffect(() => {
    if (user) {
      if (user.isBusiness && user._id === card.user_id)
        setShowExtraButtons(true);
      else if (user.isAdmin) setShowExtraButtons(true);
      else setShowExtraButtons(false);
    } else setShowExtraButtons(false);
  }, [user, card.user_id, showExtraButtons]);

  const handleToggleFavorite = useCallback(async () => {
    if (user) {
      toggleFavorite(card);
      setIsFavorite((prev) => !prev);
    } else setShowExtraButtons(false);
  }, [card, toggleFavorite, user]);

  const handleDelete = useCallback(() => {
    if (onDelete && card._id) onDelete(card._id);
  }, [card._id, onDelete]);

  const handleEdit = useCallback(() => {
    navigate(`/my-cards/${card._id}/edit`);
  }, [card._id, navigate]);

  return (
    <>
      <div className="card-wrapper">
        <div
          className={`card shadow-sm ${
            isDarkMode
              ? "bg-dark text-white border-light"
              : "bg-light text-dark"
          }`}>
          <img
            className="card-img-top object-fit-cover"
            src={card.image?.url || "https://via.placeholder.com/150"}
            alt={card.image?.alt || "Business Card Image Alt"}
          />
          <div className="card-body flex-column justify-content-evenly">
            <h2 className="card-title fw-bold">{card.title}</h2>
            <h6
              className={`card-subtitle m-2 ${
                isDarkMode ? "text-white" : "text-muted"
              }`}>
              {card.subtitle}
            </h6>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item description overflow-auto">
              <strong>Description:</strong> {card.description}
            </li>
            <li className="list-group-item">
              <strong>Phone:</strong>{" "}
              <a href={`tel:${card.phone}`}>{card.phone}</a>
            </li>
            <li className="list-group-item">
              <strong>Email:</strong>{" "}
              <a href={`mailto:${card.email}`}>{card.email}</a>
            </li>
            {user && (user.isBusiness || user.isAdmin) ? (
              <>
                <li className="list-group-item">
                  <strong>Address:</strong>{" "}
                  {card.address
                    ? `${card.address.street} ${card.address.houseNumber}, ${card.address.city}`
                    : "No address provided"}
                </li>
                <li className="list-group-item">
                  <strong>Business Number:</strong> {card.bizNumber}
                </li>
              </>
            ) : (
              <li className="list-group-item text-center">
                <Link to="/login">Login</Link> to view more
              </li>
            )}
          </ul>
        </div>
        <div className="button-group">
          <button
            className="card-button phone"
            onClick={() => setShowModal(true)}>
            <i className="fa-solid fa-phone"></i>
          </button>
          <button
            className="card-button info"
            onClick={() => setShowModal(true)}>
            <i className="fa-solid fa-circle-info"></i>
          </button>
          {user && (
            <button
              className={`card-button ${
                isFavorite ? "not-favorite" : "favorite"
              } `}
              onClick={handleToggleFavorite}>
              <i
                className={`${
                  isFavorite ? "fa-solid" : "fa-regular"
                } fa-star`}></i>
              <span>{card.likes?.length}</span>
            </button>
          )}
          {showExtraButtons && (
            <>
              <button className="card-button edit" onClick={handleEdit}>
                <i className="fa-solid fa-pencil"></i>
              </button>
              <button
                className="card-button delete"
                onClick={() => setShowDeleteModal(true)}>
                <i className="fa-solid fa-trash"></i>
              </button>
            </>
          )}
        </div>
      </div>
      <Suspense fallback={null}>
        <BizCardModal
          card={card}
          isUserConnected={!!user}
          isDarkMode={isDarkMode}
          showModal={showModal}
          handleClose={() => setShowModal(false)}
        />
        <ErrorBoundary>
          <ConfirmModal
            show={showDeleteModal}
            message="Are you sure you want to delete this card?"
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteModal(false)}
          />
        </ErrorBoundary>
      </Suspense>
    </>
  );
};

export default BizCard;
