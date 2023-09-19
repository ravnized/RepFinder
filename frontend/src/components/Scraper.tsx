import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import ScraperServices from "../services/PrivilegedServices";
import useWebSocket from "react-use-websocket";
import { Button, Col, Container, ProgressBar, Row } from "react-bootstrap";
import "../css/Scraper.css";
function Scraper(props: any) {
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [nInput, setNInput] = useState(1);
	const [inputArray, setInputArray] = useState([{ filename: "", url: "" }]);
	const [progressObject, setProgressObject] = useState([]);
	const [socketUrl, setSocketUrl] = useState(
		"ws://localhost:5001/scraperMultiWs",
	);
	//const [messageHistory, setMessageHistory] = useState([]);
	const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketUrl);
	const last_json_message: any = lastJsonMessage;
	const progress_object: any = progressObject;
	const handleScrape = useCallback(() => {
		sendJsonMessage({ scraper: inputArray, token: props.token });
	}, [inputArray, props.token, sendJsonMessage]);
	useEffect(() => {
		if (last_json_message !== null) {
			let filename = last_json_message.filename;
			let progress = last_json_message.percent;
			console.log(`Filename: ${filename} Progress: ${progress}`);
			let arrayProgress: any = progressObject;
			arrayProgress[filename] = progress;
			setProgressObject(arrayProgress);
			console.log(last_json_message);
			if (progress === 100) {
				console.log("finito");
				props.onStateChange("Scraping completed", "");
			}
		}
	}, [last_json_message, progressObject, props]);

	let input = [];
	for (let i = 0; i < nInput; i++) {
		input.push(
			<Row key={i}>
				<Row className="rowInput">
					<h4>Input {i + 1}</h4>
					<Col>
						<input
							type="text"
							placeholder="url"
							onChange={(e) => {
								let arrayInput = inputArray;
								arrayInput[i].url = e.target.value;
								setInputArray(arrayInput);
							}}
						/>
					</Col>
					<Col>
						<input
							type="text"
							placeholder="filename"
							onChange={(e) => {
								let arrayInput = inputArray;
								arrayInput[i].filename = e.target.value;
								setInputArray(arrayInput);
							}}
						/>
					</Col>
				</Row>
				<Row>
					{inputArray[i].filename === undefined ||
					progress_object[inputArray[i].filename] === undefined ? (
						<></>
					) : (
						<ProgressBar
							now={progress_object[inputArray[i].filename]}
							label={`${progress_object[inputArray[i].filename]}%`}
						/>
					)}
				</Row>
			</Row>,
		);
	}
	return (
		<div>
			<form>
				{input}
				<Row>
					<Col>
						<Button
							onClick={(e) => {
								e.preventDefault();
								let input = nInput;
								input++;
								setInputArray([...inputArray, { filename: "", url: "" }]);
								setNInput(input);
							}}
						>
							Add input
						</Button>
					</Col>
					<Col>
						<Button
							variant="secondary"
							onClick={(e) => {
								e.preventDefault();
								handleScrape();
							}}
						>
							Scrape
						</Button>
					</Col>
				</Row>
			</form>
		</div>
	);
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
											res.itemInseriti === undefined
												? 0
												: res.itemInseriti.length;
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
