'use client'

import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Modal,
  Card,
  Image,
  Dropdown,
  DropdownButton
} from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import Toast from "../../components/init_toast.js";
import { PencilSquare } from "react-bootstrap-icons";
import '../../../css/card.css';
import '../../../css/modal.css';

const OwnerPage = () => {
  const [loading, setLoading] = useState(true);
  const [ownerId, setOwnerId] = useState(null);
  const [owners, setOwners] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contactDetails: "",
    address: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const getOwners = async () => {
    try {
      setLoading(true);
      const url = "http://localhost/pets-app/api/owner.php";

      let response = await axios.get(url, {
        params: { json: "", operation: "getOwners" },
      });

      const result = response.data;
      setOwners(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching owners:", error);
    }
  };

  const saveOwner = async () => {
    try {
      const url = "http://localhost/pets-app/api/owner.php";

      const jsonData = {
        name: formData.name,
        contactDetails: formData.contactDetails,
        address: formData.address,
      };

      if (isEditing) {
        jsonData.ownerId = ownerId;
    }

      const formDataObj = new FormData();
      formDataObj.append("operation", isEditing ? "updateOwner" : "addOwner");
      formDataObj.append("json", JSON.stringify(jsonData));


      let response = await axios({
        url: url,
        method: "POST",
        data: formDataObj,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = response.data;

      if (result && result.status === "success") {
        Toast.fire({
          icon: "success",
          title: `<small>${result.message}<small>`,
        });
        getOwners();
      } else {
        Toast.fire({
          icon: "error",
          title: `<small>${result.message}<small>`,
        });
      }
      setShowModal(false);
    } catch (error) {
      Swal.fire("Error", "An error occurred. Please try again.", "error");
    }
  };

  const handleEdit = (owner) => {
    setFormData({
      name: owner.Name,
      contactDetails: owner.ContactDetails,
      address: owner.Address,
    });
    setOwnerId(owner.OwnerID);
    setIsEditing(true);
    setShowModal(true);
  };

  useEffect(() => {
    getOwners();
  }, []);

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center border-0 p-3 cust-card-header">
          <h2 className="text-white">Owners</h2>
          <Button
            variant="primary"
            className="shadow-sm rounded-pill"
            onClick={() => {
              setShowModal(true);
              setIsEditing(false);
              setFormData({ name: "", contactDetails: "", address: "" });
              setOwnerId(null);
            }}
          >
            Add Owner
          </Button>
        </Card.Header>
        <Card.Body className="cust-scroll">
          <Table hover responsive className="bg-transparent">
            <thead className="align-middle">
              <tr>
                <th>Owner's name</th>
                <th>Contact details</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="align-middle">
            {loading ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : owners.length > 0 ? (
                owners.map((owner) => (
                  <tr key={owner.OwnerID}>
                    <td>{owner.Name}</td>
                    <td>{owner.ContactDetails}</td>
                    <td>{owner.Address}</td>
                    <td className="text-center">
                    <Dropdown>
                        <Dropdown.Toggle
                          variant="secondary"
                          id="dropdown-basic"
                          className="rounded-pill shadow-sm"
                        >
                          Options
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleEdit(owner)}>
                            <div className="d-flex align-items-center">
                              <span>
                                <PencilSquare size={18} />
                              </span>
                              <span className="ms-2">Edit Owner</span>
                            </div>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No records found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header className="cust-modal-header">
          {isEditing ? (
            <Image
              src="/assets/edit-bg.png"
              alt="Edit Header Background"
              className="header-image"
            />
          ) : (
            <Image
              src="/assets/add-bg.png"
              alt="Add Header Background"
              className="header-image"
            />
          )}
          <Modal.Title className="modal-title">
            {isEditing ? "Edit Owner" : "Add Owner"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="cust-modal-body">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              saveOwner();
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>Owner's name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contact details</Form.Label>
              <Form.Control
                type="text"
                value={formData.contactDetails}
                onChange={(e) =>
                  setFormData({ ...formData, contactDetails: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
            </Form.Group>

            <Modal.Footer>
              <Button
                variant="light"
                className="rounded-pill shadow-sm fixed"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="rounded-pill shadow-sm"
              >
                {isEditing ? "Save Changes" : "Add Owner"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default OwnerPage;
