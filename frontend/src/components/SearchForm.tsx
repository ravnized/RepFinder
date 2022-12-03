import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputSpinner from "react-bootstrap-input-spinner";
import ItemsDataServices from "../services/ItemsServices";

const SearchForm = ({ formsValue }: any) => {
	const [valueSpinner, setValueSpinner] = useState(Number);
	const [valueItemName, setValueItemName] = useState("");
	const [valueSelector, setValueSelector] = useState("$eq");
	const [items, setItems] = useState([]);
	const [page, setPage] = useState(0);
	function handleSubmit(e: any) {
		e.preventDefault();
	}

	function submitSearch(): Promise<boolean> {
		ItemsDataServices.getItems(valueItemName, valueSpinner, valueSelector, page)
			.then((res) => {
				console.log(res);
				setItems(res.items);
				return Promise.resolve(true);
			})
			.catch((e) => {
				console.error(`Errore :${e}`);
			});
		return Promise.resolve(false);
	}

	useEffect(() => {
		let valueData = {
			items: items,
		};
		formsValue(valueData);
	});

	return (
		<Form>
			<Row>
				<Col xs="auto">
					<Form.Group className="mb-3">
						<Form.Control
							type="text"
							placeholder="Name"
							id="itemName"
							onChange={(value: any) => setValueItemName(value.target["value"])}
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
						value={valueSpinner}
						onChange={(num: any) => setValueSpinner(num)}
						variant={"dark"}
						size="sm"
					/>
				</Col>
				<Col xs={3}>
					<Form.Select
						aria-label="Default select example"
						onChange={(value: any) => setValueSelector(value.target["value"])}
					>
						<option value="$eq"> {"="} </option>
						<option value="$gt">{">"}</option>
						<option value="$gte">{">="}</option>
						<option value="$lt">{"<"}</option>
						<option value="$lte">{"<="}</option>
					</Form.Select>
				</Col>
				<Col xs="auto">
					<Button
						variant="primary"
						type="submit"
						onClick={(e) => {
							handleSubmit(e);
							submitSearch();
						}}
					>
						Search
					</Button>
				</Col>
			</Row>
		</Form>
	);
};
export default SearchForm;
