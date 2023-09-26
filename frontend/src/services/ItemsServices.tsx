import env from "react-dotenv";

class ItemsDataServices {
	static async getAll(page = 0) {
		let baseUrl = `${env.URL_ITEMS}?page=${page}`;
		let response = await fetch(baseUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response.json();
	}
	static async getItems(
		itemName: string,
		cost: number,
		operator: string,
		page: number,
		storeName: string,
	) {
		//let baseUrl = "http://127.0.0.1:5001/api/v1/items";
		let finalUrl = `${env.URL_ITEMS}`;
		finalUrl += `?page=${page}`;
		if (cost !== 0) {
			finalUrl += `&cost[0]=${cost}&cost[1]=${operator}`;
		}
		if (itemName !== "") {
			finalUrl += `&$text[0]=${itemName}&$text[1]=$search`;
		}
		if (storeName !== "") {
			finalUrl += `&storeName[0]=${storeName}&storeName[1]=$eq`;
		}

		let response = await fetch(finalUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		return response.json();
	}
	static async getPopularity() {
		let baseUrl = `${env.URL_ITEMS}/getPopularity`;
		let response = await fetch(baseUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response.json();
	}

	static async getStoreNames() {
		let baseUrl = `${env.URL_ITEMS}/getStores`;
		let response = await fetch(baseUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response.json();
	}
}

export default ItemsDataServices;
