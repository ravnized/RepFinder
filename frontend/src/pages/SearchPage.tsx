import { useState } from "react";
import Container from "react-bootstrap/Container";
import ItemsCard from "../components/ItemsCard";
import SearchForm from "../components/SearchForm";
import ButtonsForm from "../components/ButtonsForm";
import "../css/SearchPage.css";
import ItemsDataServices from "../services/ItemsServices";

function SearchPage() {
	const [items, setItems] = useState([]);
	const [page, setPage] = useState(0);
	const [status, setStatus] = useState("");
	const [statusResponse, setStatusResponse] = useState("");
	const [itemQuery, setItemQuery] = useState({
		itemName: "",
		cost: 0,
		selectorOperation: "",
		page: 0,
		storeName: "",
	});

	function pageValue(page: number) {
		setPage(page);
		waitingResponse("disabled");
		responseOutIn("out");
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
				setItemQuery({
					itemName: itemName,
					cost: cost,
					selectorOperation: selectorOperation,
					page: page,
					storeName: storeName,
				});
			})
			.catch((e) => {
				setItems([]);
				waitingResponse("");
				setItemQuery({
					itemName: itemName,
					cost: cost,
					selectorOperation: selectorOperation,
					page: page,
					storeName: storeName,
				});
			});
	}

	function waitingResponse(statusPass: string) {
		if (statusPass === "" || statusPass === "disabled") {
			setStatus(statusPass);
		}
	}

	function responseOutIn(statusPass: string) {
		if (statusPass === "") {
			console.log("ritornato da itemCard");
			getForm(
				itemQuery.itemName,
				itemQuery.cost,
				itemQuery.selectorOperation,
				page,
				itemQuery.storeName,
			);
			setStatusResponse(statusPass);
		} else {
			setStatusResponse(statusPass);
		}
	}
	function resetPage(activated: boolean) {
		if (activated) setPage(0);
	}
	return (
		<Container>
			<SearchForm
				getForm={(
					itemName: string,
					cost: number,
					selectorOperation: string,
					storeName: string,
				) => getForm(itemName, cost, selectorOperation, 0, storeName)}
				statusGet={(status: string) => waitingResponse(status)}
				statusResponse={status}
				resetPage={(activated: boolean) => resetPage(activated)}
			/>
			{items !== undefined && items.length > 0 ? (
				<ButtonsForm
					statusResponse={status}
					page={(page) => pageValue(page)}
					pagePassed={page}
				/>
			) : (
				""
			)}
			<ItemsCard
				responseValue={items}
				statusResponse={statusResponse}
				statusResponseGet={(response) => responseOutIn(response)}
			/>
			{items !== undefined && items.length > 0 ? (
				<ButtonsForm
					page={(page) => pageValue(page)}
					statusResponse={status}
					pagePassed={page}
				/>
			) : (
				""
			)}
		</Container>
	);
}

export default SearchPage;
