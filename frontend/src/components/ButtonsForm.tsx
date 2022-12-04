import React, { useEffect, useState } from "react";
import ItemsDataServices from "../services/ItemsServices";
import Button from "react-bootstrap/Button";
const ButtonsForm = ({ searchValue }: any) => {
	let [searchParams, setSearchParams] = useState({
		valueItemName: "",
		valueSpinner: 0,
		valueSelector: "",
		page: 0,
	});

	function handleSubmit(e: any) {
		e.preventDefault();
	}

	function submitSearch(): Promise<boolean> {
		ItemsDataServices.getItems(
			searchParams.valueItemName,
			searchParams.valueSpinner,
			searchParams.valueSelector,
			searchParams.page,
		)
			.then((res) => {
				console.log(res);
				return Promise.resolve(true);
			})
			.catch((e) => {
				console.error(`Errore :${e}`);
			});
		return Promise.resolve(false);
	}

	useEffect(() => {
		setSearchParams(searchValue);
	}, [searchValue]);

	return (
		<div className="buttons-bot">
			<Button variant="primary">Go to the item</Button>
		</div>
	);
};
export default ButtonsForm;
