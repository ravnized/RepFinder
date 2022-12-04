import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import ItemsCard from "../components/ItemsCard";
import SearchForm from "../components/SearchForm";
import ButtonsForm from "../components/ButtonsForm";
function SearchPage() {
	let [items, setItems] = useState([]);
	let [searchParams, setSearchParams] = useState({});

	let getValueForm = (items: []) => {
		setItems(items);
	};

	useEffect(() => {
		console.log(items);
		console.log(searchParams);
	}, [items, searchParams]);

	return (
		<Container>
			<SearchForm itemsRaw={getValueForm} />
			<ItemsCard responseValue={items} />
		</Container>
	);
}

export default SearchPage;
