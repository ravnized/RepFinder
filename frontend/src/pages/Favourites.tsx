import { useCookies } from "react-cookie";
import { useCallback, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import ItemsCard from "../components/ItemsCard";
import FavouritesDataServices from "../services/FavouritesServices";
import ButtonsForm from "../components/ButtonsForm";

function Favourites() {
	const [cookies, setCookie] = useCookies(["token"]);
	const [items, setItems] = useState([]);
	const [favouritesItems, setFavouritesItems] = useState({});
	const [page, setPage] = useState(0);
	const [status, setStatus] = useState("");
	const [statusResponse, setStatusResponse] = useState("");

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

	const getFavorites = useCallback(async () => {
		try {
			const response = await FavouritesDataServices.getItems(
				cookies.token,
				page,
			);
			const favourites = await FavouritesDataServices.getAll(cookies.token);
			setItems(response.itemsList);
			setFavouritesItems(favourites.favorites);
			setStatus("");
			setStatusResponse("");
		} catch (error) {
			setItems([]);
			setFavouritesItems({});
			setStatus("");
			setStatusResponse("");
		}
	}, [cookies.token, page]);

	function pageValue(page: number) {
		setPage(page);
	}

	function responseOutIn(statusPass: string) {
		if (statusPass === "") {
			setStatusResponse(statusPass);
		} else {
			console.log("out");
			setStatusResponse(statusPass);
		}
	}

	useEffect(() => {
		if (items.length === 0) {
			getFavorites();
		}
	});

	return (
		<Container>
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
				voidPageString="No items in your favourites"
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

export default Favourites;
