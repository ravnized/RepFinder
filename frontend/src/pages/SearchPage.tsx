import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import ItemsCard from "../components/ItemsCard";
import SearchForm from "../components/SearchForm";
import ButtonsForm from "../components/ButtonsForm";
function SearchPage() {
	let [items, setItems] = useState([]);
	let [page, setPage] = useState(0);
	let [status, setStatus] = useState("");

	let getValueForm = (items: []) => {
		setItems(items);
	};

	let pageValue = (page: number): void => {
		setPage(page);
	};

	let waitingResponse = (status: string): void => {
		setStatus(status);
	};

	useEffect(() => {
		console.log(items);
		console.log(`page passed ${page}`);
	}, [items, page]);

	return (
		<Container>
			<SearchForm
				itemsRaw={getValueForm}
				page={pageValue}
				pagePassed={page}
				watingResponse={waitingResponse}
			/>
			{items.length > 0 ? (
				<ButtonsForm page={pageValue} statusResponse={status} />
			) : (
				""
			)}
			<ItemsCard responseValue={items} />
			{items.length > 0 ? (
				<ButtonsForm page={pageValue} statusResponse={status} />
			) : (
				""
			)}
		</Container>
	);
}

export default SearchPage;
