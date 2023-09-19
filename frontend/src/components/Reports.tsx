import { useCallback, useEffect, useState } from "react";
import ReportServices from "../services/ReportServices";
import Button from "react-bootstrap/Button";
import "../css/reports.css";
import ScraperServices from "../services/PrivilegedServices";
import { Col, Offcanvas, Row } from "react-bootstrap";
import { FaPaintbrush, FaTrashCan } from "react-icons/fa6";
function AllReport(props: any) {
	const [reports, setReports] = useState([]);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [show, setShow] = useState(false);
	const [idItem, setIdItem] = useState("");
	const [itemName, setItemName] = useState("");
	const [itemCost, setItemCost] = useState(0);
	const [needToBeDeleted, setNeedToBeDeleted] = useState(false);
	const [_id, set_id] = useState("");
	const [item_id, setItem_id] = useState("");
	const [disabled, setDisabled] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [itemNameChanged, setItemNameChanged] = useState(false);
	const [itemCostChanged, setItemCostChanged] = useState(false);

	const handleReport = useCallback(async () => {
		await ReportServices.getAll(props.token)
			.then((res) => {
				setReports(res.reportList);
			})
			.catch((err) => {
				setError(err.error);
			});
	}, [props.token]);

	function generateListReport() {
		let listReport: JSX.Element[] = [];

		reports.map((report: any) => {
			
			listReport.push(
				<Row className="reportList" key={report._id}>
					<Col >
						<p>Id:{report.idItem}</p>
					</Col>
					<Col >
						<p>ItemName:{report.itemName} </p>
					</Col>
					<Col >
						<p>Cost:{report.cost}</p>
					</Col>
					
					<Col md={2}>
						<div className="buttonsGroup">
							<div className="buttonPaint">
								<FaPaintbrush
									onClick={() => {
										handleShow();
										set_id(report._id);
										setItem_id(report.item_id);
										setIdItem(report.idItem);
										setItemName(report.itemName);
										setItemCost(report.cost);
										setNeedToBeDeleted(report.needToDelete);
									}}
								/>
							</div>
							<div className="buttonTrash">
								<FaTrashCan
									onClick={() => {
										ReportServices.deleteReport(props.token, report._id)
											.then((res) => {
												handleReport();
											})
											.catch((err) => {
												console.log(err);
											});
										
									}}
								/>
							</div>
						</div>
					</Col>
				</Row>,
			);
		});
		return listReport;
	}

	useEffect(() => {
		handleReport();
	}, [handleReport]);

	return (
		<>
			<Offcanvas show={show} onHide={handleClose}>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>Report id:{_id}</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					<input
						type="hidden"
						id="itemId"
						value={idItem}
						onChange={(e: any) => setIdItem(e.target.value)}
					/>
					<label>Item Name</label>
					<input
						id="itemName"
						value={itemName}
						onChange={(e: any) => {
							setItemName(e.target.value);
							setItemNameChanged(true);
						}}
						disabled={disabled}
					/>
					<label>Cost</label>
					<input
						id="itemCost"
						value={itemCost}
						onChange={(e: any) => {
							setItemCost(e.target.value);
							setItemCostChanged(true);
						}}
						disabled={disabled}
					/>

					{needToBeDeleted ? (
						<div className="needToBeDeletedRow">
							<label>Need To be Deleted?</label>
							<input
								id="needToBeDeleted"
								type="checkbox"
								onChange={(e: any) => {
									setDisabled(!disabled);
									if (e.target.value === "on") {
										setNeedToBeDeleted(true);
									} else {
										setNeedToBeDeleted(false);
									}
								}}
							/>
						</div>
					) : (
						<></>
					)}
					<Button
						onClick={() => {
							if (disabled) {
								ScraperServices.blacklistItem(props.token, item_id, idItem)
									.then((res) => {
										console.log(res);
									})
									.catch((err) => {
										console.log(err);
									});
								ReportServices.deleteReport(props.token, _id)
									.then((res) => {
										console.log(res);
									})
									.catch((err) => {
										console.log(err);
									});
								generateListReport();
							} else {
								ScraperServices.updateItem(
									props.token,
									item_id,
									itemName,
									itemNameChanged,
									itemCost,
									itemCostChanged,
								)
									.then((res) => {
										console.log(res);
									})
									.catch((err) => {
										console.log(err);
									});
							}
							ReportServices.deleteReport(props.token, _id)
								.then((res) => {
									console.log(res);
								})
								.catch((err) => {
									console.log(err);
								});
							generateListReport();
							handleClose();
							setItemCostChanged(false);
							setItemNameChanged(false);
						}}
					>
						Invia{" "}
					</Button>
				</Offcanvas.Body>
			</Offcanvas>
			<div className="list">{generateListReport()}</div>
		</>
	);
}

export { AllReport };
