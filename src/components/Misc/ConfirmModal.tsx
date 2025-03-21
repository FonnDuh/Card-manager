import { FunctionComponent } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDarkMode } from "../../hooks/useDarkMode";

interface ConfirmModalProps {
  show: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: FunctionComponent<ConfirmModalProps> = ({
  show,
  message,
  onConfirm,
  onCancel,
}) => {
  const { isDarkMode } = useDarkMode();


  if (!show) return null;

  const handleConfirm = () => {
    try {
      onConfirm();
    } catch (error) {
      console.error("Error during confirmation:", error);
    } finally {
      onCancel();
    }
  };

  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      className={`custom-modal ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <Modal.Header
        closeButton
        className={isDarkMode ? "dark-header" : "light-header"}>
        <Modal.Title>Confirm Action</Modal.Title>
      </Modal.Header>
      <Modal.Body className={isDarkMode ? "dark-body" : "light-body"}>
        {message}
      </Modal.Body>
      <Modal.Footer className={isDarkMode ? "dark-footer" : "light-footer"}>
        <Button variant="secondary" onClick={onCancel} className="modal-button">
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirm}
          className="modal-button confirm-button">
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
