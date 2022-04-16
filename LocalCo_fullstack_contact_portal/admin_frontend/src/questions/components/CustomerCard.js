import React, { useState } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./CustomerCard.css";

const CustomerCard = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/customers/${props.item.id}`,
        "DELETE"
      );
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="customer-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this customer and all associated questions? 
          Please note that it can't be undone thereafter.
        </p>
      </Modal>
      <ul className="customercard-list">
        <li className="customercard-item">
          <Card className="customercard-item__content" style={{background: '#ddd26e'}}>
            {isLoading && <LoadingSpinner asOverlay />}
            <div className="customercard-item__info">
              <h2>{props.item.name}</h2>
              <p>Email: {props.item.email}</p>
              <p>Phone Number: {props.item.phone}</p>
            </div>
            <div className="customercard-item__actions">
              <Button to={`/customers/${props.item.id}`}>EDIT</Button>
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            </div>
          </Card>
        </li>
      </ul>
    </React.Fragment>
  );
};

export default CustomerCard;
