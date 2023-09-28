import env from "react-dotenv";

class FavouritesDataServices {
	static async getAll(token: string) {
		let baseUrl = `${env.URL_FAVOURITES}/getByUser`;
		let response = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
			},
		});
		return response.json();
	}

	static async addFavourite(token: string, itemId: string) {
		let baseUrl = `${env.URL_FAVOURITES}/insert`;
		let response = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
			},
			body: JSON.stringify({
				itemId: itemId,
			}),
		});

		return response.json();
	}

	static async deleteFavourite(token: string, itemId: string) {
		let baseUrl = `${env.URL_FAVOURITES}/delete`;
		let response = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
			},
			body: JSON.stringify({
				itemId: itemId,
			}),
		});

		return response.json();
	}

	static async getItems(token: string, page = 0, itemsPerPage = 10) {
		let baseUrl = `${env.URL_FAVOURITES}/getItems?page=${page}&itemsPerPage=${itemsPerPage}`;

		let response = await fetch(baseUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				token: token,
			},
		});

		return response.json();
	}
}

export default FavouritesDataServices;
