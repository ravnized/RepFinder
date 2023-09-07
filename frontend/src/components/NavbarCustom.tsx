import React from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import TokenChecker from "./CookieChecker";

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
					<Link to={"/"}>
						<Navbar.Brand>RepFinder</Navbar.Brand>
					</Link>

					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="me-auto justify-content-end flex-grow-1 pe-3">
							<Link to={"/search"}>Search</Link>
							<TokenChecker name="login" link="login" />
							<TokenChecker name="register" link="register" />
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</div>
	);
}
export default NavbarCustom;
