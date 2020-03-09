import React, { useState } from 'react';
import './../pages/Login/LoginRegister.css';
import { Modal, Button } from 'react-bootstrap'
import Popup from "reactjs-popup";

/*
function Example() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Launch demo modal
      </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
          </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
          </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
*/

const Popupbox = () => (
    <Popup trigger={<button> Trigger</button>} position="right center">
        <div>Popup content here !!</div>
    </Popup>
);

export default Popupbox;