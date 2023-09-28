import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import TokenChecker from "./CookieChecker";
import "../css/NavbarCustom.css";
import { LinkContainer } from "react-router-bootstrap";
function NavbarCustom() {
	return (
		<div className="navbar-main">
			<Navbar
				collapseOnSelect
				bg="dark"
				sticky="top"
				variant="dark"
				expand="lg"
			>
				<Container>
					<LinkContainer to="/" className="repFinderLink">
						<Navbar.Brand className="repFinderBrand">RepFinder</Navbar.Brand>
					</LinkContainer>

					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="me-auto justify-content-end flex-grow-1 pe-3 navCustom">
							<LinkContainer to="/" className="repFinderLink">
								<Nav.Link>HOME</Nav.Link>
							</LinkContainer>

							<LinkContainer to="/search" className="repFinderLink">
								<Nav.Link>SEARCH</Nav.Link>
							</LinkContainer>

							<TokenChecker invert={true} name="DASHBOARD" link="dashboard" />
							<TokenChecker invert={true} name="FAVOURITES" link="favourites" />
							<TokenChecker invert={false} name="REGISTER" link="register" />
							<TokenChecker invert={false} name="LOGIN" link="login" />
							<TokenChecker invert={true} name="LOGOUT" link="logout" />
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</div>
	);
}
export default NavbarCustom;
