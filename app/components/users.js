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
  InputGroup,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import Toast from "./init_toast.js";
import { useUser } from "../context/UserContext.js";
import { EyeFill, EyeSlash, PencilSquare } from "react-bootstrap-icons";
import "../../css/card.css";
import "../../css/modal.css";

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user } = useUser();

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  const getUsers = async () => {
    try {
      setLoading(true);
      const url = "http://localhost/pets-app/api/user.php";

      const jsonData = { userId: user?.user_id };

      const formData = new FormData();
      formData.append("operation", "getUsers");
      formData.append("json", JSON.stringify(jsonData));

      let response = await axios({
        url: url,
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = response.data;
      setUsers(result);
      console.log(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching owners:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        Swal.fire("Error", "Please select a valid image file.", "error");
        return;
      }
      if (file.size > 500 * 1024) {
        Swal.fire("Error", "Image size should not exceed 500KB.", "error");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveUser = async () => {
    if (formData.password !== formData.confirmPassword) {
      Swal.fire("Error", "Passwords do not match!", "error");
      return;
    }

    try {
      const url = "http://localhost/pets-app/api/user.php";

      const jsonData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      if (isEditing) {
        jsonData.userId = userId;
      }

      const formDataObj = new FormData();
      formDataObj.append("operation", isEditing ? "updateUser" : "addUser");
      formDataObj.append("json", JSON.stringify(jsonData));
      if (imageFile) {
        formDataObj.append("image", imageFile);
      }

      let response = await axios({
        url: url,
        method: "POST",
        data: formDataObj,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(response);
      const result = response.data;

      if (result && result.status === "success") {
        Toast.fire({
          icon: "success",
          title: `<small>${result.message}<small>`,
        });
        getUsers();
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

  const handleEdit = (user) => {
    setFormData({
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      email: user.email,
      password: "",
      confirmPassword: "",
    });
    setUserId(user.user_id);
    setIsEditing(true);
    setShowModal(true);
    setImageFile(null);
    setImagePreview(
      user.avatar
        ? `http://localhost/pets-app/api/avatar/${user.avatar}`
        : "/assets/blank_profile.webp"
    );
  };

  useEffect(() => {
    getUsers();
  }, [user?.user_id]);

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center border-0 p-3 cust-card-header">
          <h2 className="text-white">System users</h2>
          <Button
            variant="primary"
            className="shadow-sm rounded-pill"
            onClick={() => {
              setShowModal(true);
              setIsEditing(false);
              setFormData({
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
              });
              setUserId(null);
              setImageFile(null);
              setImagePreview(null);
            }}
          >
            Add user
          </Button>
        </Card.Header>
        <Card.Body className="cust-scroll">
          <Table hover responsive className="bg-transparent">
            <thead className="align-middle">
              <tr>
                <th>Avatar</th>
                <th>Fullname</th>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.user_id}>
                    <td className="text-center">
                      {" "}
                      <Image
                        src={`${
                          user?.avatar
                            ? `http://localhost/pets-app/api/avatar/${user.avatar}`
                            : "/assets/blank_profile.webp"
                        }`}
                        alt={`${user?.first_name || "First name"} ${
                          user?.last_name || "Last name"
                        }`}
                        className="rounded"
                        width={72}
                        height={72}
                      />
                    </td>
                    <td>
                      {user.first_name} {user.last_name}
                    </td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td className="text-center">
                      {/* <Button
                        variant="warning"
                        onClick={() => handleEdit(user)}
                      >
                        <div className="d-flex align-items-center">
                          <span>
                            <PencilSquare size={18} className="text-white" />
                          </span>
                          <span className="text-white ms-2">Edit</span>
                        </div>
                      </Button>{" "} */}
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="secondary"
                          id="dropdown-basic"
                          className="rounded-pill shadow-sm"
                        >
                          Options
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleEdit(user)}>
                            <div className="d-flex align-items-center">
                              <span>
                                <PencilSquare size={18} />
                              </span>
                              <span className="ms-2">Edit User</span>
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
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        style={{ maxHeight: `calc(100vh - 16px)` }}
      >
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
            {isEditing ? "Edit User" : "Add User"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="cust-modal-body">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              saveUser();
            }}
          >
            <Container>
              <Col>
                <Row>
                  <Col lg={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Upload Image</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Label>Image Preview</Form.Label>
                      <Image
                        src={
                          imagePreview
                            ? imagePreview
                            : isEditing
                            ? `/assets/blank_profile.webp`
                            : `/assets/blank_profile.webp`
                        }
                        width={260}
                        height={260}
                        thumbnail
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        username: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                {!isEditing && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={toggleShowPassword}
                        >
                          {showPassword ? <EyeSlash /> : <EyeFill />}
                        </Button>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={toggleShowConfirmPassword}
                        >
                          {showConfirmPassword ? <EyeSlash /> : <EyeFill />}
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </>
                )}
              </Col>
            </Container>
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
                {isEditing ? "Save Changes" : "Add User"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Users;
