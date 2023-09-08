import React from "react";
import Scraper from "../components/Scraper";
class DashBoard extends React.Component<
	{cookies: any},
	{ token: string,message: string; error: string }
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
	
	render(): React.ReactNode {
		return (
			<div>
				<Scraper token={this.state.token}/>
				<h1>Dashboard</h1>
			</div>
		);
	}
}
export default DashBoard;