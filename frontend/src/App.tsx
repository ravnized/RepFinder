import React from "react";
import logo from "./logo.svg";
import NavbarCustom from "./components/NavbarCustom";
import { withCookies } from "react-cookie";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Outlet } from "react-router-dom";
function App() {
	return (
		<div className="App">
			<NavbarCustom />
			<Outlet />
		</div>
	);
}

export default withCookies(App);
