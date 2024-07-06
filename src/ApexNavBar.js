import React from "react";
import { Button, Container, Image, Nav, Navbar } from "react-bootstrap";
import arrows from "./resources/ArrowsNoBckgd.png";
import { useAuth } from "./contexts/AuthContext";

const ApexNavBar = () => {
  const { currentUser } = useAuth();

  return (
    <Navbar className="navbar navbar-expand-lg fixed-top shadow-sm bg-gradient-primary-to-secondary" id="mainNav">
      <Container className="container px-5">
        <Button variant="link" href="/" style={{ padding: 0 }}> {/* Added Button and styles */}
          <Image 
            src={arrows} 
            style={
              { 
                width: `calc(1.7 * var(--bs-navbar-brand-font-size))`,
                // height: `calc(1.7 * var(--bs-navbar-brand-font-size))`,
                paddingBottom: '5px',
                marginRight: '3px'

              }
            }
            href="/"
          
          />
        </Button>

        <Navbar.Brand href="/">
          Apex Pies
        </Navbar.Brand>

          {/* Navigation Links */}
          <Navbar.Collapse>
          <Nav className="ms-auto">
            {currentUser && <Nav.Link href="/mypies">My Pies</Nav.Link> }
            {currentUser ? <Nav.Link href="/profile">Profile</Nav.Link> : <Nav.Link href="/login">Log In</Nav.Link> }
            <Nav.Link href="/resourcesfaq">Resources and FAQ</Nav.Link>
          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );

};

export default ApexNavBar;