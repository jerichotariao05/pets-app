import TopNav from "../components/navbar";
import { Container } from "react-bootstrap";

const UserLayout = ({ children }) => {
  return (
    <>
      <TopNav />
      <Container
        fluid="lg"
        className="d-flex justify-content-center align-items-center mt-5">
      {children}
      </Container>
    </>
  );
};

export default UserLayout;
