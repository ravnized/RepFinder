import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
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
				console.log(res);

				for (let i = 0; i < res.length; i++) {
					let resi: any = res[i];
					console.log(resi._id);
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
/*
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
				this.setState({ items: res.itemsList });
				this.props.itemsRaw(res.itemsList);
				this.props.watingResponse("");
				this.setState({ stateButtonSearch: "" });
			})
			.catch((e) => {
				this.setState({ items: [] });
				this.props.itemsRaw([]);
				this.props.watingResponse("");
				this.setState({ stateButtonSearch: "" });
				console.error(`Errore :${e}`);
			});
	}

	render() {
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
*/
export default SearchForm;
