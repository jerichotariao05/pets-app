"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
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


const PetPage = () => {
  const [loading, setLoading] = useState(true);
  const [owners, setOwners] = useState([]);
  const [selectedSpeciesIdForTable, setSelectedSpeciesIdForTable] =
    useState("all");
  const [selectedSpeciesIdForForm, setSelectedSpeciesIdForForm] = useState("");
  const [species, setSpecies] = useState([]);
  const [petId, setPetId] = useState(null);
  const [breeds, setBreeds] = useState([]);
  const [petsInfo, setPetsInfo] = useState([]);
  const [formData, setFormData] = useState({
    ownerId: "",
    petName: "",
    specieId: "",
    breedId: "",
    dateOfBirth: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const getPets = async () => {
    try {
      setLoading(true);
      const url = "http://localhost/pets-app/api/pet.php";
      let jsonData = {};

      if (selectedSpeciesIdForTable && selectedSpeciesIdForTable !== "all") {
        jsonData.speciesId = selectedSpeciesIdForTable;
      }

      const formData = new FormData();
      formData.append("operation", "getPetsInfo");
      formData.append("json", JSON.stringify(jsonData));

      let response = await axios({
        url: url,
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = response.data.petsInfo;
      setPetsInfo(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const getOwners = async () => {
    try {
      const url = "http://localhost/pets-app/api/owner.php";
      let response = await axios.get(url, {
        params: { json: "", operation: "getOwners" },
      });
      const result = response.data;
      setOwners(result);
    } catch (error) {
      console.error("Error fetching owners:", error);
    }
  };

  const getSpecies = async () => {
    try {
      const url = "http://localhost/pets-app/api/specie.php";
      const response = await axios.get(url, {
        params: { json: "", operation: "getSpecies" },
      });
      const result = response.data;

      const initSpecies = result.map((specie) => ({
        id: specie.SpeciesID,
        name: specie.SpeciesName,
      }));

      setSpecies(initSpecies);
    } catch (error) {
      console.error("Error fetching species:", error);
    }
  };

  const getBreeds = async () => {
    try {
      const url = "http://localhost/pets-app/api/breed.php";
      let jsonData = {};

      if (formData.specieId) {
        jsonData.speciesId = formData.specieId;
      }

      const requestData = new FormData();
      requestData.append("operation", "getSpecieBreeds");
      requestData.append("json", JSON.stringify(jsonData));

      let response = await axios({
        url: url,
        method: "POST",
        data: requestData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = response.data;

      setBreeds(result);
    } catch (error) {
      console.error("Error fetching breeds:", error);
    }
  };

  const handleSpeciesChangeForTable = (event) => {
    setSelectedSpeciesIdForTable(event.target.value);
  };

  const handleSpeciesChangeForForm = (event) => {
    setSelectedSpeciesIdForForm(event.target.value);
    setFormData({ ...formData, specieId: event.target.value });
  };

  useEffect(() => {
    getPets();
  }, [selectedSpeciesIdForTable]);

  useEffect(() => {
    getBreeds();
  }, [formData.specieId]);

  useEffect(() => {
    getOwners();
    getSpecies();
  }, []);

  const handleEdit = (pet) => {
    setFormData({
      ownerId: pet.OwnerID,
      petName: pet.PetName,
      specieId: pet.SpeciesID,
      breedId: pet.BreedID,
      dateOfBirth: pet.DateOfBirth,
    });
    setPetId(pet.PetID);
    setSelectedSpeciesIdForForm(pet.SpeciesID);
    setIsEditing(true);
    setShowModal(true);
  };

  const savePet = async () => {
    try {
      const url = "http://localhost/pets-app/api/pet.php";
      const jsonData = {
        ownerId: formData.ownerId,
        petName: formData.petName,
        specieId: formData.specieId,
        breedId: formData.breedId,
        dateOfBirth: formData.dateOfBirth,
      };

      if (isEditing) {
        jsonData.petId = petId;
      }

      const formDataObj = new FormData();
      formDataObj.append("operation", isEditing ? "updatePet" : "addPet");
      formDataObj.append("json", JSON.stringify(jsonData));

      const response = await axios({
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
        getPets();
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

  return (
    <Container className="mt-5">
      <Card>
      <Card.Header className="d-flex justify-content-between align-items-center border-0 p-3 cust-card-header">
          <h2 className="text-white">Pets Information</h2>
          <Button
            variant="primary"
            className="shadow-sm rounded-pill"
            onClick={() => {
              setShowModal(true);
              setIsEditing(false);
              setFormData({
                ownerId: "",
                petName: "",
                specieId: "",
                breedId: "",
                dateOfBirth: "",
              });
              setSelectedSpeciesIdForForm("");
              setPetId(null);
            }}
          >
            Add Pet
          </Button>
        </Card.Header>
        <Card.Body className="cust-scroll">
          <Row className="mb-3">
            <Col lg={3}>
              <Form.Group controlId="groups-dropdown">
                <Form.Label>Select a specie:</Form.Label>
                <Form.Select
                  onChange={handleSpeciesChangeForTable}
                  value={selectedSpeciesIdForTable}
                >
                  <option value="all">All Species</option>
                  {species.length > 0 ? (
                    species.map((specie) => (
                      <option key={specie.id} value={specie.id}>
                        {specie.name}
                      </option>
                    ))
                  ) : (
                    <option key="" value="">
                      No options available
                    </option>
                  )}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={9}></Col>
          </Row>

          <Table hover responsive className="bg-transparent mt-3 overflow-auto">
            <thead className="align-middle">
              <tr>
                <th>Owner's Name</th>
                <th>Pet Name</th>
                <th>Species</th>
                <th>Breed</th>
                <th>Date of Birth</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : petsInfo.length > 0 ? (
                petsInfo.map((pet) => (
                  <tr key={pet.PetID}>
                    <td>{pet.OwnerName}</td>
                    <td>{pet.PetName}</td>
                    <td>{pet.SpeciesName}</td>
                    <td>{pet.BreedName}</td>
                    <td>{pet.DateOfBirth}</td>
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
                          <Dropdown.Item onClick={() => handleEdit(pet)}>
                            <div className="d-flex align-items-center">
                              <span>
                                <PencilSquare size={18} />
                              </span>
                              <span className="ms-2">Edit Pet</span>
                            </div>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No data available
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
            {isEditing ? "Edit User" : "Add Pet"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="cust-modal-body">
          <Form
            onSubmit={(e) => {
            e.preventDefault();
            savePet();
          }}
          >
            <Form.Group className="mb-3">
              <Form.Label>Owner</Form.Label>
              <Form.Control
                as="select"
                value={formData.ownerId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, ownerId: e.target.value })
                }
                required
              >
                <option value="">Select owner</option>
                {owners.map((owner) => (
                  <option key={owner.OwnerID} value={owner.OwnerID}>
                    {owner.Name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPetName">
              <Form.Label>Pet Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter pet name"
                value={formData.petName}
                onChange={(e) =>
                  setFormData({ ...formData, petName: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSpecies">
              <Form.Label>Species</Form.Label>
              <Form.Select
                value={formData.specieId}
                onChange={handleSpeciesChangeForForm}
              >
                <option value="">Select a species</option>
                {species.length > 0 ? (
                  species.map((specie) => (
                    <option key={specie.id} value={specie.id}>
                      {specie.name}
                    </option>
                  ))
                ) : (
                  <option value="">No options available</option>
                )}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBreeds">
              <Form.Label>Breed</Form.Label>
              <Form.Select
                value={formData.breedId}
                onChange={(e) =>
                  setFormData({ ...formData, breedId: e.target.value })
                }
              >
                <option value="">Select a breed</option>
                {breeds.length > 0 ? (
                  breeds.map((breed) => (
                    <option key={breed.BreedID} value={breed.BreedID}>
                      {breed.BreedName}
                    </option>
                  ))
                ) : (
                  <option value="">No breeds available</option>
                )}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDateOfBirth">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
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
                {isEditing ? "Save Changes" : "Add Pet"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PetPage;
