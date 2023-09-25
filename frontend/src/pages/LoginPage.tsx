import React from "react";
import { LoginDataServices } from "../services/UsersServices";
import { withCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import InputGroup from "react-bootstrap/InputGroup";
import { Alert, Button, Container, Form, Row } from "react-bootstrap";
//Class login page that comunicate with the main page to pass around the token

class LoginPage extends React.Component<
	{ cookies: any },
	{ error: string; token: string }
> {
	constructor(props: any) {
		super(props);
		const { cookies } = props;
		this.state = {
			error: "",
			token: cookies.get("token") || "",
		};
	}

	handleTokenChange(token: string) {
		const { cookies } = this.props;
		cookies.set("token", token, { path: "/" });
		this.setState({ token });
		//window.location.href = "/";
	}

	async login(email: string, password: string) {
		LoginDataServices.getToken(email, password)
			.then(async (res) => {
				//console.log(res);
				if (res.error !== undefined) {
					this.setState({ error: res.error });
					//console.log("error");
				} else {
					this.handleTokenChange(res.token);
					this.setState({ error: "" });
					window.location.href = "/";
				}
			})
			.catch((e) => {
				console.log(e);
			});
	}
	//Center the page and display the login form
	render(): React.ReactNode {
		let username: string = "";
		let password: string = "";

		return (
			<>
				{
					//If there is an error display it
					this.state.error !== "" ? (
						<Container style={{ padding: "1rem" }}>
							<Alert key="warning" variant="warning">
								{this.state.error}
							</Alert>
						</Container>
					) : (
						<div></div>
					)
				}
				<Container
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
					}}
				>
					<Row>
						<InputGroup className="mb-3">
							<InputGroup.Text id="email">@</InputGroup.Text>
							<Form.Control
								placeholder="test@test.com"
								aria-label="Email"
								aria-describedby="basic-addon1"
								onChange={(event: any) => {
									username = event.target.value;
								}}
							/>
						</InputGroup>

						<InputGroup className="mb-3">
							<InputGroup.Text id="password">**</InputGroup.Text>
							<Form.Control
								placeholder="test123!"
								aria-label="password"
								aria-describedby="basic-addon1"
								onChange={(event: any) => {
									password = event.target.value;
								}}
							/>
						</InputGroup>

						<Button
							onClick={() => {
								this.login(username, password);
							}}
						>
							Login
						</Button>
					</Row>
				</Container>
			</>
		);
	}
}
export default withCookies(LoginPage);
