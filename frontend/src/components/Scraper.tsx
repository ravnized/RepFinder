import React from "react";
import ScraperServices from "../services/PrivilegedServices";

class Scraper extends React.Component<
	{ token: string; onStateChange: (error: string, message: string) => void },
	{
		message: string;
		error: string;
		nInput: number;
		inputArray: [{ filename: string; url: string }];
	}
> {
	constructor(props: any) {
		super(props);
		this.state = {
			message: "",
			error: "",
			nInput: 1,
			inputArray: [{ filename: "", url: "" }],
		};
	}

	async scraper(filenameUrl: [{ filename: string; url: string }]) {
		await ScraperServices.scraping(filenameUrl, this.props.token)
			.then((res) => {
				if (res["data"] === undefined) {
					this.props.onStateChange(res.error.message, "");
					this.setState({ error: res.error.message });
				} else {
					this.props.onStateChange("", res["data"].message);
					this.setState({ message: res["data"].message });
				}
			})
			.catch((error) => {
				this.props.onStateChange(error, "");
				this.setState({ error: error });
			});
	}

	/*
	componentDidUpdate(prevProps: Readonly<{ token: string; }>, prevState: Readonly<{ message: string; error: string; nInput: number; input: [JSX.Element] }>, snapshot?: any): void {
		let nInput = this.state.nInput;
		let input = this.state.input;
		for (let i = 0; i < nInput; i++) {
			input.push(
				<div key={i}>
					<input type="text" placeholder="url"/>
					<input type="text" placeholder="filename"/>
				</div>,
			);
		}
		this.setState({ input: input });
	}

	 */
	// create a form with 2 input, one for the url and one for the filename
	// and a button that can add more input
	render(): React.ReactNode {
		let nInput = this.state.nInput;
		let input = [];

		for (let i = 0; i < nInput; i++) {
			input.push(
				<div key={i}>
					<input
						type="text"
						placeholder="url"
						onChange={(e) => {
							let inputArray = this.state.inputArray;
							if (inputArray[i] === undefined) {
								inputArray.push({ filename: "", url: "" });
							}
							inputArray[i].url = e.target.value;
							this.setState({ inputArray: inputArray });
						}}
					/>
					<input
						type="text"
						placeholder="filename"
						onChange={(e) => {
							let inputArray = this.state.inputArray;
							if (inputArray[i] === undefined) {
								inputArray.push({ filename: "", url: "" });
							}
							inputArray[i].filename = e.target.value;
							this.setState({ inputArray: inputArray });
						}}
					/>
				</div>,
			);
		}
		return (
			<div>
				<form>
					{input}
					<button
						onClick={(e) => {
							e.preventDefault();
							this.setState({ nInput: nInput + 1 });
						}}
					>
						Add input
					</button>
					<button
						onClick={(e) => {
							e.preventDefault();
							this.scraper(this.state.inputArray);
						}}
					>
						Scrape
					</button>
				</form>
			</div>
		);
	}
}
class Converter extends React.Component<
	{ token: string; onStateChange: (error: string, message: string) => void },
	{
		message: string;
		error: string;
	}
> {
	constructor(props: any) {
		super(props);
		this.state = {
			message: "",
			error: "",
		};
	}

	render(): React.ReactNode {
		return (
			<div>
				<button
					onClick={(e) => {
						e.preventDefault();
						ScraperServices.convertAll(this.props.token)
							.then((resMessage: []) => {
								let nItems;
								let message;
								if (resMessage.length === 0) {
									message = "No files to convert";
								} else {
									nItems = resMessage.length;
									message = `Converted ${nItems} items`;
								}
								this.setState({ message: message });
								this.props.onStateChange("", message);
							})
							.catch((error) => {
								this.setState({ error: error });
								this.props.onStateChange(this.state.error, "");
							});
					}}
				>
					Convert All files
				</button>
			</div>
		);
	}
}

class Updater extends React.Component<
	{ token: string; onStateChange: (error: string, message: string) => void },
	{
		message: string;
		error: string;
		filesArray: [];
		filesToUpdate: string[];
	}
> {
	constructor(props: any) {
		super(props);
		this.state = {
			message: "",
			error: "",
			filesArray: [],
			filesToUpdate: [],
		};
	}
	async getFiles() {
		await ScraperServices.getFiles(this.props.token)
			.then((res: []) => {
				this.setState({ filesArray: res });
			})
			.catch((error) => {
				this.setState({ error: error });
				this.props.onStateChange(this.state.error, "");
			});
	}

	render(): React.ReactNode {
		return (
			<div>
				{this.state.filesArray.length === 0 ? (
					<button
						onClick={(e) => {
							e.preventDefault();
							this.getFiles();
						}}
					>
						Get files
					</button>
				) : (
					<div>
						{this.state.filesArray.map((item: string, index: number) => (
							<div key={index}>
								<label htmlFor={item}>{item}</label>
								<input
									type="checkbox"
									id={item}
									onChange={(e) => {
										let fileToUpdate: string[] = this.state.filesToUpdate;
										if (e.target.checked) {
											fileToUpdate.push(item);
										} else {
											fileToUpdate.splice(fileToUpdate.indexOf(item), 1);
										}

										this.setState({ filesToUpdate: fileToUpdate });
									}}
								/>
							</div>
						))}
						<button
							onClick={(e) => {
								e.preventDefault();

								ScraperServices.updateDatabase(
									this.props.token,
									this.state.filesToUpdate,
								)
									.then((res: any) => {
										//console.log(res);
										let resInseriti =
											res.itemInseriti === undefined ? 0 : res.itemInseriti.length;
										let message = `Updated ${resInseriti} items`;
										this.setState({ message: message });
										this.props.onStateChange("", message);
									})
									.catch((error) => {
										this.setState({ error: error });
										this.props.onStateChange(error, "");
									});
							}}
						>
							Update Items
						</button>
					</div>
				)}
			</div>
		);
	}
}

class DeleteAll extends React.Component<
	{ token: string; onStateChange: (error: string, message: string) => void },
	{
		message: string;
		error: string;
	}
> {
	constructor(props: any) {
		super(props);
		this.state = {
			message: "",
			error: "",
		};
	}
	render(): React.ReactNode {
		return (
			<div>
				<button
					onClick={(e) => {
						e.preventDefault();
						ScraperServices.deleteAll(this.props.token)
							.then((res: any) => {
								let message = res.message;
								this.setState({ message: message });
								this.props.onStateChange("", message);
							})
							.catch((error: any) => {
								this.setState({ error: error });
								this.props.onStateChange(error, "");
							});
					}}
				>
					Delete All
				</button>
			</div>
		);
	}
}

export { Scraper, Converter, Updater, DeleteAll };
