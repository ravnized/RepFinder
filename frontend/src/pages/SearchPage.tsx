import { useState } from "react";
import Container from "react-bootstrap/Container";
import ItemsCard from "../components/ItemsCard";
import SearchForm from "../components/SearchForm";
import ButtonsForm from "../components/ButtonsForm";
import "../css/SearchPage.css";
import ItemsDataServices from "../services/ItemsServices";
import { useCookies } from "react-cookie";
import FavouritesDataServices from "../services/FavouritesServices";
function SearchPage() {
	const [items, setItems] = useState([]);
	const [favouritesItems, setFavouritesItems] = useState({});
	const [page, setPage] = useState(0);
	const [status, setStatus] = useState("");
	const [statusResponse, setStatusResponse] = useState("");
	const [cookies] = useCookies(["token"]);
	const [itemQuery, setItemQuery] = useState({
		itemName: "",
		cost: 0,
		selectorOperation: "",
		page: 0,
		storeName: "",
	});

	function addOrRemoveFavourite(action: boolean, itemId: string) {
		if (action) {
			FavouritesDataServices.addFavourite(cookies.token, itemId)
				.then(() => {
					FavouritesDataServices.getAll(cookies.token).then((res) => {
						setFavouritesItems(res.favorites);
					});
				})
				.catch((e) => {
					console.log(e);
				});
		} else {
			FavouritesDataServices.deleteFavourite(cookies.token, itemId)
				.then(() => {
					FavouritesDataServices.getAll(cookies.token).then((res) => {
						setFavouritesItems(res.favorites);
					});
				})
				.catch((e) => {
					console.log(e);
				});
		}
	}

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
			cookies.token,
		)
			.then((res) => {
				setItems(res.responseItem.itemsList);
				setFavouritesItems(res.favouritesItems.favorites);
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
				setFavouritesItems({});
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
			getForm(
				itemQuery.itemName,
				itemQuery.cost,
				itemQuery.selectorOperation,
				page,
				itemQuery.storeName,
			);
			setStatusResponse(statusPass);
		} else {
			console.log("out");
			setStatusResponse(statusPass);
		}
	}
	function resetPageAndSubmitForm(
		activated: boolean,
		item: {
			itemName: string;
			cost: number;
			selectorOperation: string;
			storeName: string;
		},
	) {
		if (activated) {
			getForm(
				item.itemName,
				item.cost,
				item.selectorOperation,
				0,
				item.storeName,
			);
			setPage(0);
		}
	}

	return (
		<Container>
			<SearchForm
				statusGet={(status: string) => waitingResponse(status)}
				statusResponse={status}
				resetPage={(
					activated: boolean,
					item: {
						itemName: string;
						cost: number;
						selectorOperation: string;
						storeName: string;
					},
				) => resetPageAndSubmitForm(activated, item)}
			/>
			{items !== undefined && items.length > 0 ? (
				<ButtonsForm
					statusResponse={status}
					page={(page) => pageValue(page)}
					pagePassed={page}
				/>
			) : (
				<></>
			)}
			<ItemsCard
				responseValue={items}
				responseFavourites={favouritesItems}
				statusResponse={statusResponse}
				favouriteResponseGet={(action: boolean, itemName: string) =>
					addOrRemoveFavourite(action, itemName)
				}
				statusResponseGet={(response) => responseOutIn(response)}
				voidPageString={"Search Something"}
			/>
			{items !== undefined && items.length > 0 ? (
				<ButtonsForm
					page={(page) => pageValue(page)}
					statusResponse={status}
					pagePassed={page}
				/>
			) : (
				<></>
			)}
		</Container>
	);
}

export default SearchPage;
