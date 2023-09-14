import React from "react";
import { Scraper, Converter, Updater, DeleteAll } from "../components/Scraper";
import { withCookies } from "react-cookie";
import { AllReport } from "../components/Reports";
class DashBoard extends React.Component<
	{ cookies: any },
	{ token: string; message: string; error: string }
> {
	constructor(props: any) {
		super(props);
		const { cookies } = props;
		this.state = {
			token: cookies.get("token") || "",
			message: "",
			error: "",
		};
	}

	handleConvertState = (message: string, error: string) => {
		this.setState({ message: message, error: error });
		if (message !== "") {
			alert(message);
		} else {
			alert(error);
		}
	};

	render(): React.ReactNode {
		return (
			<div>
				<h1>Dashboard</h1>
				<h2>Scraper</h2>
				<h3>Scrape File</h3>
				<Scraper
					token={this.state.token}
					onStateChange={this.handleConvertState}
				/>
				<h3>Convert Files</h3>
				<Converter
					token={this.state.token}
					onStateChange={this.handleConvertState}
				/>
				<h3>Update Database</h3>
				<Updater
					token={this.state.token}
					onStateChange={this.handleConvertState}
				/>
				<h3>Delete All</h3>
				<DeleteAll
					token={this.state.token}
					onStateChange={this.handleConvertState}
				/>

				<h2>Report</h2>
				<AllReport
					token={this.state.token}
					onStateChange={this.handleConvertState}
				/>
			</div>
		);
	}
}
export default withCookies(DashBoard);
