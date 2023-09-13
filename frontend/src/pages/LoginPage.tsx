import React from "react";
import {LoginDataServices} from "../services/UsersServices";
import { withCookies } from "react-cookie";
import { Navigate } from "react-router-dom";

//Class login page that comunicate with the main page to pass around the token

class LoginPage extends React.Component<{ cookies: any }, {error: string, token: string}> {
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

	render(): React.ReactNode {
		let username: string = "";
		let password: string = "";

		return (
			<div>
				{
					//If there is an error display it
					this.state.error !== "" ? (
						<div>
							<p>{this.state.error}</p>
						</div>
					) : (
						<div></div>
					)
				}
				<div>
					<input
						type="text"
						placeholder="email"
						id="email"
						onChange={(event: any) => {
							username = event.target.value;
						}}
					/>
					<input
						type="password"
						placeholder="Password"
						id="password"
						onChange={(event: any) => {
							password = event.target.value;
						}}
					/>
					<button
						onClick={() => {
							this.login(username, password);
						}}
					>
						Login
					</button>
				</div>
			</div>
		);
	}
}
export default withCookies(LoginPage);
