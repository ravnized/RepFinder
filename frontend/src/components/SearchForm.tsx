import React, { useLayoutEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputSpinner from "react-bootstrap-input-spinner";
import ItemsDataServices from "../services/ItemsServices";
import Spinner from "react-bootstrap/Spinner";
import "../css/SearchForm.css";

function SearchForm(props: any) {
	const valueSpinner = useRef(0);
	const valueItemName = useRef("");
	const valueSelector = useRef("$eq");
	const [stateButtonSearch, setStateButtonSearch] = useState("");
	const storeName = useRef("");
	const [storeNameList, setStoreNameList] = React.useState([]);
	function handleSubmit(e: any) {
		e.preventDefault();
	}

	function getValueStore() {
		let storenameList: any = [];
		ItemsDataServices.getStoreNames()
			.then((res: []) => {
				
				for (let i = 0; i < res.length; i++) {
					let resi: any = res[i];
					storenameList.push(resi._id);
				}
			})
			.then(() => {
				setStoreNameList(storenameList);
			});
	}
	useLayoutEffect(() => {
		if (storeNameList.length === 0) {
			getValueStore();
		}
		if (props.statusResponse !== stateButtonSearch) {
			setStateButtonSearch(props.statusResponse);
		}
	}, [props, props.statusResponse, stateButtonSearch, storeNameList.length]);

	return (
		<Form className="paddingSearchForm">
			<Row>
				<Col xs="auto">
					<Form.Group className="mb-3">
						<Form.Control
							type="text"
							placeholder="Name"
							id="itemName"
							onChange={(value: any) =>
								(valueItemName.current = value.target["value"])
							}
						/>
					</Form.Group>
				</Col>
				<Col xs="auto">
					<InputSpinner
						type={"int"}
						precision={1}
						min={1}
						max={99999}
						step={1}
						value={valueSpinner.current}
						onChange={(num: any) => (valueSpinner.current = num)}
						variant={"dark"}
						size="sm"
					/>
				</Col>
				<Col xs={3}>
					<Form.Select
						aria-label="Default select example"
						onChange={(value: any) =>
							(valueSelector.current = value.target["value"])
						}
					>
						<option value="$eq"> {"="} </option>
						<option value="$gt">{">"}</option>
						<option value="$gte">{">="}</option>
						<option value="$lt">{"<"}</option>
						<option value="$lte">{"<="}</option>
					</Form.Select>
				</Col>
				<Col xs="auto">
					<Form.Select
						className="mb-3"
						onChange={(value: any) =>
							(storeName.current = value.target["value"])
						}
					>
						<option value="">All</option>
						{storeNameList.map((store: any, index: number) => (
							<option value={store} key={index}>
								{store}
							</option>
						))}
					</Form.Select>
				</Col>
				<Col xs="auto">
					{stateButtonSearch === "" ? (
						<Button
							variant="primary"
							type="submit"
							onClick={(e) => {
								handleSubmit(e);
								setStateButtonSearch("disabled");
								props.statusGet("disabled");
								props.getForm(
									valueItemName.current,
									valueSpinner.current,
									valueSelector.current,
									storeName.current,
								);
							}}
						>
							Search
						</Button>
					) : (
						<Button variant="primary" disabled>
							<Spinner
								as="span"
								animation="border"
								size="sm"
								role="status"
								aria-hidden="true"
							/>
							<span className="visually-hidden">Loading...</span>
						</Button>
					)}
				</Col>
			</Row>
		</Form>
	);
}
export default SearchForm;
