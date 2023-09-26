import React, { useState } from "react";
import { RegisterDataServices } from "../services/UsersServices";
import { Container, Row, Form, Col, Button, Alert } from "react-bootstrap";
import "../css/Register.css";

function RegisterPage(props: any) {
	let [message, setMessage] = React.useState("");
	let [error, setError] = React.useState("");
	let [email, setEmail] = React.useState("");
	let [password, setPassword] = React.useState("");
	let [name, setName] = React.useState("");
	let [lastName, setLastName] = React.useState("");
	let [passwordConfirm, setPasswordConfirm] = React.useState("");
	const [show, setShow] = useState(true);
	function register(
		email: string,
		password: string,
		name: string,
		lastName: string,
	) {
		RegisterDataServices.registerData(email, password, name, lastName)
			.then(async (res) => {
				console.log(res);
				if (res.error === undefined) {
					setMessage(res.message.substring(0, 50) + "...");
				} else {
					setError("Error in Creating User");
				}
			})
			.catch((e) => {
				console.log(e);
			});
	}

	function checkPassword(password: string, passwordConfirm: string) {
		if (password !== passwordConfirm) {
			setError("Passwords don't match");
			return false;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters long");
			return false;
		}

		if (password.length > 20) {
			setError("Password must be less than 20 characters long");
			return false;
		}

		if (password.search(/[a-z]/i) < 0) {
			setError("Password must contain at least one letter");
			return false;
		}

		if (password.search(/[0-9]/) < 0) {
			setError("Password must contain at least one number");
			return false;
		}

		if (password.search(/[!@#$%^&*]/) < 0) {
			setError("Password must contain at least one special character");
			return false;
		}

		if (password.search(/[A-Z]/) < 0) {
			setError("Password must contain at least one uppercase letter");
			return false;
		}

		setError("");
		return true;
	}

	return (
		<>
			{error !== "" && show ? (
				<Container style={{ padding: "1rem" }}>
					<Alert
						key="warning"
						variant="warning"
						onClose={() => setShow(false)}
						dismissible
					>
						{error}
					</Alert>
				</Container>
			) : (
				<></>
			)}

			{message !== "" && show ? (
				<Container style={{ padding: "1rem" }}>
					<Alert
						key="info"
						variant="info"
						onClose={() => setShow(false)}
						dismissible
					>
						{message}
					</Alert>
				</Container>
			) : (
				<></>
			)}

			<Container className="RegisterForm">
				<Form>
					<Form.Group className="mb-3">
						<Form.Label className="white-text">Email address</Form.Label>
						<Form.Control
							placeholder="test@test.com"
							aria-label="Email"
							className="input-dark"
							aria-describedby="basic-addon1"
							onChange={(event: any) => {
								setEmail(event.target.value);
							}}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label className="white-text">Password</Form.Label>
						<Form.Control
							placeholder="test123"
							aria-label="password"
							className="input-dark"
							aria-describedby="basic-addon1"
							onChange={(event: any) => {
								setPassword(event.target.value);
							}}
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label className="white-text">Confirm Password</Form.Label>
						<Form.Control
							placeholder="test123"
							aria-label="password"
							className="input-dark"
							aria-describedby="basic-addon1"
							onChange={(event: any) => {
								setPasswordConfirm(event.target.value);
							}}
						/>
					</Form.Group>
					<Row style={{ padding: "1rem 0 1rem 0" }}>
						<Col>
							<Form.Group>
								<Form.Label className="white-text">Name</Form.Label>
								<Form.Control
									placeholder="Mario"
									aria-label="Name"
									className="input-dark"
									aria-describedby="basic-addon1"
									onChange={(event: any) => {
										setName(event.target.value);
									}}
								/>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group>
								<Form.Label className="white-text">Last Name</Form.Label>
								<Form.Control
									placeholder="Rossi"
									aria-label="Last Name"
									className="input-dark"
									aria-describedby="basic-addon1"
									onChange={(event: any) => {
										setLastName(event.target.value);
									}}
								/>
							</Form.Group>
						</Col>
					</Row>
				</Form>
				<Button
					className="white-text"
					style={{ margin: "1rem" }}
					onClick={(e: any) => {
						e.preventDefault();
						setShow(true);
						if (checkPassword(password, passwordConfirm)) {
							register(email, password, name, lastName);
						}
					}}
				>
					Register
				</Button>
			</Container>
		</>
	);
}
export default RegisterPage;
