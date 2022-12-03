import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import ItemsCard from "../components/ItemsCard";
import SearchForm from "../components/SearchForm";
function SearchPage() {
	let [items, setItems] = useState([]);
	let [responseValue, setResponseValue] = useState({});

	let getValueForms = (valueData: any) => {
		setItems(valueData.items);
	};

	useEffect(() => {
		console.log(items);
	}, [items]);

	return (
		<Container>
			<SearchForm formsValue={getValueForms} />
			<ItemsCard responseValue={items} />
		</Container>
	);
}

export default SearchPage;
