import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputSpinner from "react-bootstrap-input-spinner";
import ItemsDataServices from "../services/ItemsServices";
import { isConstructorDeclaration } from "typescript";

class SearchForm extends React.Component<
	{
		itemsRaw: (items: []) => void;
	},
	{
		valueSpinner: number;
		valueItemName: string;
		valueSelector: string;
		items: [];
		page: number;
	}
> {
	constructor(props: any) {
		super(props);
		this.state = {
			valueSpinner: 0,
			valueItemName: "",
			valueSelector: "$eq",
			items: [],
			page: 0,
		};
	}

	handleSubmit(e: any) {
		e.preventDefault();
	}

	componentDidUpdate(): void {
		console.log(this.state.page);
	}

	submitSearch(): Promise<boolean> {
		ItemsDataServices.getItems(
			this.state.valueItemName,
			this.state.valueSpinner,
			this.state.valueSelector,
			this.state.page,
		)
			.then((res) => {
				console.log(res);
				this.setState({ items: res.items });
				this.props.itemsRaw(res.items);
				return Promise.resolve(true);
			})
			.catch((e) => {
				console.error(`Errore :${e}`);
			});
		return Promise.resolve(false);
	}

	render() {
		return (
			<Form>
				<Row>
					<Col xs="auto">
						<Form.Group className="mb-3">
							<Form.Control
								type="text"
								placeholder="Name"
								id="itemName"
								onChange={(value: any) =>
									this.setState({ valueItemName: value.target["value"] })
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
							value={this.state.valueSpinner}
							onChange={(num: any) => this.setState({ valueSpinner: num })}
							variant={"dark"}
							size="sm"
						/>
					</Col>
					<Col xs={3}>
						<Form.Select
							aria-label="Default select example"
							onChange={(value: any) =>
								this.setState({ valueSelector: value.target["value"] })
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
						<Button
							variant="primary"
							type="submit"
							onClick={(e) => {
								this.handleSubmit(e);
								this.submitSearch();
							}}
						>
							Search
						</Button>
					</Col>
					<Col xs="auto">
						{this.state.items !== undefined && this.state.items.length > 0 ? (
							<Button
								variant="primary"
								onClick={(e) => {
									this.setState({ page: this.state.page + 1 });
									this.submitSearch();
								}}
							>
								Next Page
							</Button>
						) : (
							""
						)}
					</Col>
				</Row>
			</Form>
		);
	}
}
export default SearchForm;
