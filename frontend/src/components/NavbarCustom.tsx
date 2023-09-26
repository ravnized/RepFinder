import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import TokenChecker from "./CookieChecker";
import "../css/NavbarCustom.css";
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
					<Link to={"/"} className="repFinderLink">
						<Navbar.Brand className="repFinderBrand">RepFinder</Navbar.Brand>
					</Link>

					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="me-auto justify-content-end flex-grow-1 pe-3 navCustom">
							<Link className="navBarLink" to={"/"}>
								HOME
							</Link>
							<Link className="navBarLink" to={"/search"}>
								SEARCH
							</Link>
							<TokenChecker invert={true} name="DASHBOARD" link="dashboard" />
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
