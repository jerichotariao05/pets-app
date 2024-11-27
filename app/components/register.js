"use client";

import axios from "axios";
import { useState } from "react";
import { Container, Col, Form, Button, Card } from "react-bootstrap";
import Link from "next/link";


const SignupForm = () => {

  const handleSignup = async () => {

  };

  return (
    <>
      <Container
        className="d-flex justify-content-center align-items-center vh-100"
        fluid
      >
        <Col lg={4}>
          <Card className="shadow-sm rounded-1 p-2">
            <Card.Header className="border-0 bg-transparent text-center fw-bold">
              <h3>My Pets sign up</h3>
            </Card.Header>
            <Card.Body>
              <Form>
              <Form.Group controlId="firstName" className="mb-3">
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    type="text"
                    //value={username}
                    //onChange={(e) => setUsername(e.target.value)}
                    placeholder="First name"
                  />
                </Form.Group>

                <Form.Group controlId="lastName" className="mb-3">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    type="text"
                    //value={username}
                    //onChange={(e) => setUsername(e.target.value)}
                    placeholder="Last name"
                  />
                </Form.Group>

                <Form.Group controlId="username" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    //value={username}
                    //onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                  />
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    //value={username}
                    //onChange={(e) => setUsername(e.target.value)}
                    placeholder="Email"
                  />
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    //value={password}
                    //onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </Form.Group>

                <Form.Group controlId="password" className="mb-5">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    //value={password}
                    //onChange={(e) => setPassword(e.target.value)}
                    placeholder="Confirm password"
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={handleSignup}
                  className="w-100 shadow-sm text-white rounded-1"
                >
                  Sign up 
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer  className="border-0 bg-transparent text-center">
              Already have an account?
            <Link href="/login" className="text-primary text-underline ms-2">Login</Link>
            </Card.Footer>
          </Card>
        </Col>
      </Container>
    </>
  );
};

export default SignupForm;
