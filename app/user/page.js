"use client";

import { useState, useEffect } from "react";
import { Container, Row, Col, Table, Card } from "react-bootstrap";
import { PersonFill, InfoCircleFill, ArrowRight } from "react-bootstrap-icons";
import Link from "next/link";
import axios from "axios";
import styles from "../../css/font_style.module.css";
import "../../css/card.css";
import "../../css/dashboard_card.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [ownerNum, setOwnerNum] = useState([]);
  const [specieNum, setSpecieNum] = useState([]);
  const [breedNum, setBreedNum] = useState([]);
  const [petNum, setPetNum] = useState([]);
  const [pets, setPets] = useState([]);

  const getNumOfOwners = async () => {
    try {
      const url = "http://localhost/pets-app/api/dashboard.php";

      let response = await axios.get(url, {
        params: { json: "", operation: "numOfOwners" },
      });

      const result = response.data;
      setOwnerNum(result);
    } catch (error) {
      console.error("Error fetching number of owners:", error);
    }
  };

  const getNumOfSpecies = async () => {
    try {
      const url = "http://localhost/pets-app/api/dashboard.php";

      let response = await axios.get(url, {
        params: { json: "", operation: "numOfSpecies" },
      });

      const result = response.data;
      setSpecieNum(result);
    } catch (error) {
      console.error("Error fetching number of species:", error);
    }
  };

  const getNumOfBreeds = async () => {
    try {
      const url = "http://localhost/pets-app/api/dashboard.php";

      let response = await axios.get(url, {
        params: { json: "", operation: "numOfBreeds" },
      });

      const result = response.data;
      setBreedNum(result);
    } catch (error) {
      console.error("Error fetching number of breeds:", error);
    }
  };

  const getNumOfPets = async () => {
    try {
      const url = "http://localhost/pets-app/api/dashboard.php";

      let response = await axios.get(url, {
        params: { json: "", operation: "numOfPets" },
      });

      const result = response.data;
      setPetNum(result);
    } catch (error) {
      console.error("Error fetching number of pets:", error);
    }
  };

  const getPets = async () => {
    try {
      setLoading(true);
      const url = "http://localhost/pets-app/api/dashboard.php";

      let response = await axios.get(url, {
        params: { json: "", operation: "getPets" },
      });

      console.log(response);

      const result = response.data;
      setPets(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching number of pets:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getNumOfOwners();
    getNumOfSpecies();
    getNumOfBreeds();
    getNumOfPets();
    getPets();
  }, []);

  return (
    <Container fluid className="mt-5">
      <Row className="mb-5">
        <Col lg={3} sm={6}>
          <Card className="card-box bg-blue text-white">
            <div className="icon">
              <PersonFill />
            </div>
            <Card.Body className="d-flex flex-column">
              <div className="d-flex flex-grow-1 flex-column justify-content-center align-items-center">
                <Card.Title className="mb-2">{ownerNum}</Card.Title>
                <Card.Text>Owners</Card.Text>
              </div>
            </Card.Body>
            <Card.Footer className="card-box-footer">
              <Link href="/user/owner" className="text-white">
                View More <ArrowRight size={18} />
              </Link>
            </Card.Footer>
          </Card>
        </Col>

        <Col lg={3} sm={6}>
          <Card className="card-box bg-green text-white">
            <div className="icon">
              <InfoCircleFill />
            </div>
            <Card.Body className="d-flex flex-column">
              <div className="d-flex flex-grow-1 flex-column justify-content-center align-items-center">
                <Card.Title className="mb-2">{specieNum}</Card.Title>
                <Card.Text>Species</Card.Text>
              </div>
            </Card.Body>
            <Card.Footer className="card-box-footer">
              <Link href="/user/specie" className="text-white">
                View More <ArrowRight size={18} />
              </Link>
            </Card.Footer>
          </Card>
        </Col>

        <Col lg={3} sm={6}>
          <Card className="card-box bg-orange text-white">
            <div className="icon">
              <InfoCircleFill />
            </div>
            <Card.Body className="d-flex flex-column">
              <div className="d-flex flex-grow-1 flex-column justify-content-center align-items-center">
                <Card.Title className="mb-2">{breedNum}</Card.Title>
                <Card.Text>Breeds</Card.Text>
              </div>
            </Card.Body>
            <Card.Footer className="card-box-footer">
              <Link href="/user/breed" className="text-white">
                View More <ArrowRight size={18} />
              </Link>
            </Card.Footer>
          </Card>
        </Col>

        <Col lg={3} sm={6}>
          <Card className="card-box bg-red text-white">
            <div className="icon">
              <InfoCircleFill />
            </div>
            <Card.Body className="d-flex flex-column">
              <div className="d-flex flex-grow-1 flex-column justify-content-center align-items-center">
                <Card.Title className="mb-2">{petNum}</Card.Title>
                <Card.Text>Pets</Card.Text>
              </div>
            </Card.Body>
            <Card.Footer className="card-box-footer">
              <Link href="/user/pet" className="text-white">
                View More <ArrowRight size={18} />
              </Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header className="border-0 pt-3 px-4 cust-card-header">
          <h1 className={`text-white ${styles.pacifico}`}>Pets Information</h1>
        </Card.Header>
        <Card.Body>
          <Table hover responsive className="bg-transparent mt-3 overflow-auto">
            <thead>
              <tr>
                <th>Owner's Name</th>
                <th>Pet Name</th>
                <th>Species</th>
                <th>Breed</th>
                <th>Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : pets.length > 0 ? (
                pets.map((pet) => (
                  <tr key={pet.PetID}>
                    <td>{pet.OwnerName}</td>
                    <td>{pet.PetName}</td>
                    <td>{pet.SpeciesName}</td>
                    <td>{pet.BreedName}</td>
                    <td>{pet.DateOfBirth}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;
