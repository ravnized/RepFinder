import React from "react";
import {RegisterDataServices} from "../services/UsersServices";
class RegisterPage extends React.Component<
	{},
	{ message: string; error: string }
> {
	constructor(props: any) {
		super(props);
		this.state = {
			message: "",
			error: "",
		};
	}

	register(email: string, password: string, name: string, lastName: string) {
		RegisterDataServices.registerData(email, password, name, lastName)
			.then(async (res) => {
				if (res.error !== undefined) {
					this.setState({ error: res.error });
				} else {
					this.setState({ message: res.message });
				}
			})
			.catch((e) => {
				console.log(e);
			});
	}

	render(): React.ReactNode {
		let email: string = "";
		let password: string = "";
		let name: string = "";
		let lastName: string = "";
		return (
			<div>
				{
					//If there is an error display it
					this.state.message !== "" ? (
						<div>
							<p>{this.state.message}</p>
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
							email = event.target.value;
						}}
					/>
					<input
						type="text"
						placeholder="password"
						id="password"
						onChange={(event: any) => {
							password = event.target.value;
						}}
					/>
					<input
						type="text"
						placeholder="name"
						id="name"
						onChange={(event: any) => {
							name = event.target.value;
						}}
					/>
					<input
						type="text"
						placeholder="lastName"
						id="lastName"
						onChange={(event: any) => {
							lastName = event.target.value;
						}}
					/>
					<button
						onClick={() => {
							this.register(email, password, name, lastName);
						}}
					>
						Registrati
					</button>
				</div>
			</div>
		);
	}
}
export default RegisterPage;
