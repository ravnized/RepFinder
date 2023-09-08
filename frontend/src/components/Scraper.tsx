import React from "react";
import ScraperServices from "../services/PrivilegedServices";

class Scraper extends React.Component<
	{ token: string },
	{ message: string; error: string, nInput: number }
> {
	constructor(props: any) {
		super(props);
		this.state = {
			message: "",
			error: "",
			nInput: 1,
		};
	}

	async scraper(filenameUrl: string[]) {
		await ScraperServices.scraping(filenameUrl, this.props.token).then(
			(res) => {
				console.log(res);
			},
		);
	}
	// create a form with 2 input, one for the url and one for the filename
	// and a button that can add more input
	render(): React.ReactNode {
		let nInput = this.state.nInput;
		let input = [];
		for (let i = 0; i < nInput; i++) {
			input.push(
				<div>
					<input type="text" placeholder="url" />
					<input type="text" placeholder="filename" />
				</div>,
			);
		}
		return (
			<div>
				<form>
					<button onClick={(e) => this.setState({ nInput: nInput + 1 })}> Add input </button>
				</form>
			</div>
		);
	}
}
export default Scraper;
