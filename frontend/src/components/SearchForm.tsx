import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputSpinner from "react-bootstrap-input-spinner";
import ItemsDataServices from "../services/ItemsServices";
import Spinner from "react-bootstrap/Spinner";

class SearchForm extends React.Component<
	{
		itemsRaw: (items: []) => void;
		page: (page: number) => void;
		pagePassed: number;
		watingResponse: (status: string) => void;
	},
	{
		valueSpinner: number;
		valueItemName: string;
		valueSelector: string;
		items: [];
		page: number;
		stateButtonSearch: string;
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
			stateButtonSearch: "",
		};
	}

	handleSubmit(e: any) {
		e.preventDefault();
	}

	componentDidUpdate(prevProps: any): void {
		if (this.props.pagePassed !== prevProps.pagePassed) {
			this.setState({ page: this.props.pagePassed }, () => this.submitSearch());
		}
	}

	submitSearch(): void {
		this.props.watingResponse("Wait");
		this.setState({ stateButtonSearch: "disabled" });
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
				this.props.watingResponse("");
				this.setState({ stateButtonSearch: "" });
			})
			.catch((e) => {
				console.error(`Errore :${e}`);
			});
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
						{this.state.stateButtonSearch === "" ? (
							<Button
								variant="primary"
								type="submit"
								onClick={(e) => {
									this.handleSubmit(e);
									this.setState({ stateButtonSearch: "disabled" }, () =>
										this.submitSearch(),
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
}
export default SearchForm;
