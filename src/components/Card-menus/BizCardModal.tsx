import { FunctionComponent } from "react";
import { Modal, Button } from "react-bootstrap";
import { Card } from "../../interfaces/Cards/Card";
import "../../styles/Card/BizCardModal.css";
import { Link } from "react-router-dom";

interface BizCardModalProps {
  card: Card;
  isUserConnected: boolean;
  showModal: boolean;
  handleClose: () => void;
  isDarkMode: boolean;
}

const BizCardModal: FunctionComponent<BizCardModalProps> = ({
  card,
  isUserConnected,
  showModal,
  handleClose,
  isDarkMode,
}) => {
  const truncate = (str: string, max: number) =>
      str.length > max ? str.substring(0, max) + "..." : str,
    googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(
      `${card.address?.street} ${card.address?.houseNumber}, ${card.address?.city}`
    )}&output=embed`;

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      className={`custom-modal ${isDarkMode ? "dark-mode" : "light-mode"}`}
      centered>
      <Modal.Header
        closeButton
        className={isDarkMode ? "dark-header" : "light-header"}>
        <Modal.Title>{card.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={isDarkMode ? "dark-body" : "light-body"}>
        <img
          className="img-fluid mb-3 w-100"
          src={card.image?.url || "https://via.placeholder.com/250"}
          alt={card.image?.alt || "Business Card"}
        />
        <h6
          className={`text-center p-2 ${
            isDarkMode ? "text-white" : "text-muted"
          }`}>
          {card.subtitle}
        </h6>
        <p className="overflow-auto">
          <strong>Description:</strong> {card.description}
        </p>
        <p>
          <strong>Phone:</strong> <a href={`tel:${card.phone}`}>{card.phone}</a>
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${card.email}`}>{card.email}</a>
        </p>
        <p>
          <strong>Website:</strong>{" "}
          {card.web ? (
            <a href={card.web} target="_blank" rel="noopener noreferrer">
              {truncate(card.web, 30)}
            </a>
          ) : (
            "No website provided"
          )}
        </p>
        {isUserConnected ? (
          <>
            <p>
              <strong>Address:</strong>{" "}
              {card.address
                ? `${card.address.street} ${card.address.houseNumber}, ${card.address.city}`
                : "No address provided"}
            </p>
            {card.address && (
              <iframe
                src={googleMapsUrl}
                width="100%"
                height="200"
                style={{
                  border: 0,
                  borderRadius: "8px",
                }}
                allowFullScreen={false}
                loading="lazy"
              />
            )}
          </>
        ) : (
          <p className="text-center mt-2">
            <Link to="/login">Login</Link> to view more
          </p>
        )}
      </Modal.Body>
      <Modal.Footer className={isDarkMode ? "dark-footer" : "light-footer"}>
        <Button
          variant={isDarkMode ? "light" : "secondary"}
          onClick={handleClose}
          className="modal-button">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BizCardModal;
