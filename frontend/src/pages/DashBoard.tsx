import { useState } from "react";
import {
	Scraper,
	Converter,
	Updater,
	DeleteAll,
	ClearCache,
} from "../components/Scraper";
import { useCookies } from "react-cookie";
import { AllReport } from "../components/Reports";
import {
	Container,
	Row,
	Tab,
	Tabs,
	Toast,
	ToastContainer,
} from "react-bootstrap";

function DashBoard(props: any) {
	const [cookies] = useCookies(["token"]);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [showA, setShowA] = useState(false);
	const toggleShowA = () => {
		setShowA(!showA);
		if (showA) setMessage("");
	};
	const handleConvertState = (messagePass: string, errorPass: string) => {
		if (message !== messagePass) {
			setMessage(messagePass);
			toggleShowA();
		}
		if (error !== errorPass) {
			setError(error);
		}
	};

	return (
		<>
			<ToastContainer position="bottom-end" style={{ zIndex: 1 }}>
				<Toast show={showA} onClose={toggleShowA}>
					<Toast.Header></Toast.Header>
					<Toast.Body>{message}</Toast.Body>
				</Toast>
			</ToastContainer>

			<Container style={{ padding: "1rem" }}>
				<Tabs
					defaultActiveKey="reports"
					id="uncontrolled-tab-example"
					className="mb-3"
				>
					<Tab eventKey="reports" title="Reports">
						<h2>Reports</h2>
						<AllReport
							token={cookies.token}
							onStateChange={handleConvertState}
						/>
					</Tab>
					<Tab eventKey="scraper" title="Scraper">
						<Row>
							<h3>Scrape File</h3>
							<Scraper
								token={cookies.token}
								onStateChange={handleConvertState}
							/>
						</Row>
						<Row>
							<h3>Convert Files</h3>
							<Converter
								token={cookies.token}
								onStateChange={handleConvertState}
							/>
						</Row>
						<Row>
							<h3>Clear Cache</h3>
							<ClearCache
								token={cookies.token}
								onStateChange={handleConvertState}
							/>
						</Row>
						<Row>
							<h3>Update Database</h3>
							<Updater
								token={cookies.token}
								onStateChange={handleConvertState}
							/>
						</Row>
						<Row>
							<h3>Delete All</h3>
							<DeleteAll
								token={cookies.token}
								onStateChange={handleConvertState}
							/>
						</Row>
					</Tab>
				</Tabs>
			</Container>
		</>
	);
}

export default DashBoard;
