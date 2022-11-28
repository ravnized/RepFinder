import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import SearchForm from "../components/SearchForm";
function SearchPage() {
	let [spinnerValue, setSpinnerValue] = useState(Number);
	let [itemNameValue, setItemNameValue] = useState("");
	let [selectorValue, setSelectorValue] = useState("");

	let getValueForms = (valueData: any) => {
		setSpinnerValue(valueData.valueSpinner);
		setItemNameValue(valueData.valueItemName);
		setSelectorValue(valueData.valueSelector);
	};

	useEffect(() => {
		console.log(`spinnerValue: ${spinnerValue}`);
		console.log(`itemName: ${itemNameValue}`);
		console.log(`selectorValue: ${selectorValue}`);
	}, [itemNameValue, selectorValue, spinnerValue]);

	return (
		<Container>
			<SearchForm formsValue={getValueForms} />
		</Container>
	);
}

export default SearchPage;
