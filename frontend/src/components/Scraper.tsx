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
function Scraper(props: {
	token: string;
	onStateChange: (message: string, error: string) => void;
}) {
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

function Converter(props: {
	token: string;
	onStateChange: (message: string, error: string) => void;
}) {
	return (
		<div>
			<Button
				onClick={(e) => {
					e.preventDefault();
					ScraperServices.convertAll(props.token)
						.then((resMessage: []) => {
							let nItems;
							let message;
							if (resMessage.length === 0) {
								message = "No files to convert";
							} else {
								nItems = resMessage.length;
								message = `Converted ${nItems} items`;
							}
							props.onStateChange(message, "");
						})
						.catch((error) => {
							props.onStateChange("", error);
						});
				}}
			>
				Convert All files
			</Button>
		</div>
	);
}

function Updater(props: {
	token: string;
	onStateChange: (message: string, error: string) => void;
}) {
	const [filesArray, setFilesArray] = useState([]);
	const [filesToUpdate, setFilesToUpdate] = useState([]);
	const getFiles = useCallback(() => {
		ScraperServices.getFiles(props.token)
			.then((res: []) => {
				setFilesArray(res);
			})
			.catch((error) => {
				props.onStateChange("", error);
			});
	}, [props]);

	return (
		<div>
			{filesArray.length === 0 ? (
				<Button
					onClick={(e) => {
						e.preventDefault();
						getFiles();
					}}
				>
					Get files
				</Button>
			) : (
				<div>
					{filesArray.map((item: string, index: number) => (
						<div key={index}>
							<label htmlFor={item}>{item}</label>
							<input
								type="checkbox"
								id={item}
								onChange={(e) => {
									let fileToUpdate: any = filesToUpdate;
									if (e.target.checked) {
										fileToUpdate.push(item);
									} else {
										fileToUpdate.splice(fileToUpdate.indexOf(item), 1);
									}
									setFilesToUpdate(fileToUpdate);
								}}
							/>
						</div>
					))}
					<Button
						onClick={(e) => {
							e.preventDefault();

							ScraperServices.updateDatabase(props.token, filesToUpdate)
								.then((res: any) => {
									//console.log(res);
									let resInseriti =
										res.itemInseriti === undefined
											? 0
											: res.itemInseriti.length;
									let message = `Updated ${resInseriti} items`;
									props.onStateChange(message, "");
								})
								.catch((error) => {
									props.onStateChange("", error);
								});
						}}
					>
						Update Items
					</Button>
				</div>
			)}
		</div>
	);
}

function DeleteAll(props: {
	token: string;
	onStateChange: (message: string, error: string) => void;
}) {
	return (
		<div>
			<Button
				onClick={(e) => {
					e.preventDefault();
					ScraperServices.deleteAll(props.token)
						.then((res: any) => {
							let message = res.message;
							props.onStateChange(message, "");
						})
						.catch((error: any) => {
							props.onStateChange("", error);
						});
				}}
			>
				Delete All
			</Button>
		</div>
	);
}

export { Scraper, Converter, Updater, DeleteAll };
