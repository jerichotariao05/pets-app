"use client";

import { Container, Nav, Navbar, NavDropdown, Image } from "react-bootstrap";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import "../../css/navbar.css";
import styles from "../../css/font_style.module.css";

const TopNav = () => {
  const router = useRouter();
  const { user, setUser } = useUser();

  const handleLogout = () => {
    sessionStorage.removeItem("PUID");
    setUser(null);
    router.push("/login");
  };

  return (
    <Navbar
      fixed="top"
      expand="lg"
      // data-bs-theme="dark"
      className="shadow-sm px-3 py-3"
      style={{ backgroundColor: "#CC9966" }}
    >
      <Container fluid>
        <Navbar.Brand href="/user" className={`text-white ${styles.pacifico}`}>
          Pet Care System
        </Navbar.Brand>
        <Navbar.Toggle
          className="cust-toggle"
          aria-controls="basic-navbar-nav"
          style={{ outline: "none" }}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/user" className="text-light">
              Dashboard
            </Nav.Link>
            <Nav.Link href="/user/owner" className="text-light">
              Owners
            </Nav.Link>
            <Nav.Link href="/user/specie" className="text-light">
              Species
            </Nav.Link>
            <Nav.Link href="/user/breed" className="text-light">
              Breeds
            </Nav.Link>
            <Nav.Link href="/user/pet" className="text-light">
              Pets
            </Nav.Link>
            <Nav.Link href="/user/users" className="text-light">
              Users
            </Nav.Link>
            <Nav.Link href="#" className="d-lg-none text-light">
              Profile
            </Nav.Link>
            <Nav.Link
              href=""
              className="d-lg-none text-light"
              onClick={handleLogout}
            >
              Log out
            </Nav.Link>
            <div className="d-flex align-items-center">
              <Image
                src={
                  user?.avatar
                    ? `http://localhost/pets-app/api/avatar/${user.avatar}`
                    : "/assets/blank_profile.webp"
                }
                alt={`${user?.first_name || "First name"} ${
                  user?.last_name || "Last name"
                }`}
                className="rounded-circle d-none d-lg-block"
                width={42}
                height={42}
              />
              <NavDropdown
                title="Account"
                id="navbarScrollingDropdown"
                className="cust-nav-dropdown d-none d-lg-block"
              >
                <NavDropdown.Item href="#">Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#" onClick={handleLogout}>
                  Log out
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNav;
