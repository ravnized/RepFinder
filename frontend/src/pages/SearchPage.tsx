import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import ItemsCard from "../components/ItemsCard";
import SearchForm from "../components/SearchForm";
import ButtonsForm from "../components/ButtonsForm";
import "../css/SearchPage.css";
import React from "react";
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
					itemsRaw={(items) => this.getValueForm(items)}
					page={(page) => this.pageValue(page)}
					pagePassed={this.state.page}
					watingResponse={(status) => this.waitingResponse(status)}
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

export default SearchPage;
