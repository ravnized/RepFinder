import React from "react";
import ScraperServices from "../services/PrivilegedServices";

class Scraper extends React.Component<
	{ token: string },
	{ message: string; error: string }
> {
	constructor(props: any) {
		super(props);
		this.state = {
			message: "",
			error: "",
		};
	}

	async scraper(filenameUrl: string[]) {
		await ScraperServices.scraping(filenameUrl, this.props.token).then(
			(res) => {
				console.log(res);
			},
		);
	}

	render(): React.ReactNode {
		return (
			<div>
				<h1>Scraper</h1>
			</div>
		);
	}
}
export default Scraper;
