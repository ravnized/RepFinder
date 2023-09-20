import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import ItemsCard from "../components/ItemsCard";
import SearchForm from "../components/SearchForm";
import ButtonsForm from "../components/ButtonsForm";
import "../css/SearchPage.css";
import React from "react";
import ItemsDataServices from "../services/ItemsServices";

function SearchPage() {
	const [items, setItems] = useState([]);
	const [page, setPage] = useState(0);
	const [status, setStatus] = useState("");

	function pageValue(page: number) {
		setPage(page);
	}

	function getForm(
		itemName: string,
		cost: number,
		selectorOperation: string,
		page: number,
		storeName: string,
	) {
		ItemsDataServices.getItems(
			itemName,
			cost,
			selectorOperation,
			page,
			storeName,
		)
			.then((res) => {
				setItems(res.itemsList);
				waitingResponse("");
			})
			.catch((e) => {
				setItems([]);
				waitingResponse("");
			});
	}

	function waitingResponse(statusPass: string) {
		if (statusPass === "" || statusPass === "disabled") {
			setStatus(statusPass);
		}
	}

	return (
		<Container>
			<SearchForm
				getForm={(
					itemName: string,
					cost: number,
					selectorOperation: string,
					storeName: string,
				) => getForm(itemName, cost, selectorOperation, page, storeName)}
				statusGet={(status: string) => waitingResponse(status)}
				statusResponse={status}
			/>
			{items !== undefined && items.length > 0 ? (
				<ButtonsForm page={(page) => pageValue(page)} statusResponse={status} />
			) : (
				""
			)}
			<ItemsCard
				responseValue={items}
				statusResponse={(status: string) => waitingResponse(status)}
			/>
			{items !== undefined && items.length > 0 ? (
				<ButtonsForm page={(page) => pageValue(page)} statusResponse={status} />
			) : (
				""
			)}
		</Container>
	);
}
/*
class SearchPage extends React.Component<
	{},
	{
		items: [];
		page: number;
		status: string;
	}
> {
	constructor(props: any) {
		super(props);
		this.state = {
			items: [],
			page: 0,
			status: "",
		};
	}
	getValueForm(items: []) {
		this.setState({ items: items });
	}

	pageValue(page: number) {
		this.setState({ page: page });
	}

	waitingResponse(status: string) {
		this.setState({ status: status });
	}

	

	render(): React.ReactNode {
		return (
			<Container>
				<SearchForm
					itemsRaw={(items: []) => this.getValueForm(items)}
					page={(page : number) => this.pageValue(page)}
					pagePassed={this.state.page}
					watingResponse={(status: string) => this.waitingResponse(status)}
				/>
				{ this.state.items !== undefined && this.state.items.length > 0 ? (
					<ButtonsForm
						page={(page) => this.pageValue(page)}
						statusResponse={this.state.status}
					/>
				) : (
					""
				)}
				<ItemsCard responseValue={this.state.items} />
				{this.state.items !== undefined && this.state.items.length > 0 ? (
					<ButtonsForm
						page={(page) => this.pageValue(page)}
						statusResponse={this.state.status}
					/>
				) : (
					""
				)}
			</Container>
		);
	}
}
*/

export default SearchPage;
