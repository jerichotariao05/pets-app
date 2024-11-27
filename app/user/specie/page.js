"use client";

import { useState, useEffect } from "react";
import { Container, Table, Button, Form, Modal, Card, Image, Dropdown, DropdownButton } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import Toast from "../../components/init_toast.js";
import { PencilSquare } from "react-bootstrap-icons";
import '../../../css/card.css';
import '../../../css/modal.css';

const SpeciePage = () => {
  const [loading, setLoading] = useState(true);
  const [specieId, setSpecieId] = useState(null);
  const [species, setSpecies] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const getSpecies = async () => {
    try {
      setLoading(true);
      const url = "http://localhost/pets-app/api/specie.php";

      let response = await axios.get(url, {
        params: { json: "", operation: "getSpecies" },
      });

      const result = response.data;
      setSpecies(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching species:", error);
    }
  };

  const saveSpecie = async () => {
    try {
      const url = "http://localhost/pets-app/api/specie.php";

      const jsonData = {
        name: formData.name,
      };

      if (isEditing) {
        jsonData.specieId = specieId;
      }

      const formDataObj = new FormData();
      formDataObj.append("operation", isEditing ? "updateSpecie" : "addSpecie");
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
        getSpecies();
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

  const handleEdit = (specie) => {
    setFormData({
      name: specie.SpeciesName,
    });
    setSpecieId(specie.SpeciesID);
    setIsEditing(true);
    setShowModal(true);
  };

  useEffect(() => {
    getSpecies();
  }, []);

  return (
    <Container className="mt-5">
      <Card>
      <Card.Header className="d-flex justify-content-between align-items-center border-0 p-3 cust-card-header">
          <h2 className="text-white">Species</h2>
          <Button
            variant="primary"
            className="shadow-sm rounded-pill"
            onClick={() => {
              setShowModal(true);
              setIsEditing(false);
              setFormData({ name: "" });
              setSpecieId(null);
            }}
          >
            Add Specie
          </Button>
        </Card.Header>
        <Card.Body className="cust-scroll">
          <Table hover responsive className="bg-transparent">
            <thead className="align-middle">
              <tr>
                <th>Specie's name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {loading ? (
                <tr>
                  <td colSpan="2" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : species.length > 0 ? (
                species.map((specie) => (
                  <tr key={specie.SpeciesID}>
                    <td>{specie.SpeciesName}</td>
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
                          <Dropdown.Item onClick={() => handleEdit(specie)}>
                            <div className="d-flex align-items-center">
                              <span>
                                <PencilSquare size={18} />
                              </span>
                              <span className="ms-2">Edit Specie</span>
                            </div>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center">
                    No records found.
                  </td>
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
            {isEditing ? "Edit Specie" : "Add Specie"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="cust-modal-body">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              saveSpecie();
            }}
          >
            <Form.Group className="mb-5">
              <Form.Label>Specie's name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
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
                {isEditing ? "Save Changes" : "Add Specie"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default SpeciePage;
