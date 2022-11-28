import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputSpinner from "react-bootstrap-input-spinner";

const SearchForm = ({ formsValue }: any) => {
	const [valueSpinner, setValueSpinner] = useState(Number);
	const [valueItemName, setValueItemName] = useState("");
	const [valueSelector, setValueSelector] = useState("$eq");
	function handleSubmit(e: any) {
		e.preventDefault();
	}

	useEffect(() => {
		let valueData = {
			valueSpinner: valueSpinner,
			valueItemName: valueItemName,
			valueSelector: valueSelector,
		};
		formsValue(valueData);
	});

	return (
		<Form>
			<Row>
				<Col xs="auto">
					<Form.Group className="mb-3" controlId="formBasicSearch">
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
