import React from "react";
import { LoginDataServices } from "../services/UsersServices";
import { withCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import { Alert, Button, Container, Form } from "react-bootstrap";

function LoginPage(props: any) {
	let username: string = "";
	let password: string = "";
	const [error, setError] = React.useState("");
	const [show, setShow] = React.useState(true);

	const { cookies } = props;
	if (cookies.get("token") !== undefined) {
		return <Navigate to="/" />;
	}
	function handleTokenChange(token: string) {
		cookies.set("token", token, { path: "/" });
		//window.location.href = "/";
	}
	async function login(email: string, password: string) {
		LoginDataServices.getToken(email, password).then(async (res) => {
			if (res.error !== undefined) {
				setError(res.error);
			} else {
				handleTokenChange(res.token);
				setError("");
				window.location.href = "/";
			}
		});
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

			<Container className="RegisterForm">
				<Form>
					<Form.Group className="mb-3">
						<Form.Label className="white-text">Email address</Form.Label>
						<Form.Control
							placeholder="test@test.com"
							aria-label="Email"
							type="email"
							className="input-dark"
							aria-describedby="basic-addon1"
							onChange={(event: any) => {
								username = event.target.value;
							}}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label className="white-text">Password</Form.Label>
						<Form.Control
							placeholder="test123!"
							aria-label="password"
							type="password"
							className="input-dark"
							aria-describedby="basic-addon1"
							onChange={(event: any) => {
								password = event.target.value;
							}}
						/>
					</Form.Group>

					<Button
						className="white-text"
						style={{ margin: "1rem" }}
						onClick={() => {
							login(username, password);
						}}
					>
						Login
					</Button>
				</Form>
			</Container>
		</>
	);
}

export default withCookies(LoginPage);
