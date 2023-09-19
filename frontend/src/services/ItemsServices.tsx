import HttpItems from "../components/Http-items";

class ItemsDataServices {
	static getAll(page = 0) {
		return HttpItems.get(`?page=${page}`);
	}
	static async getItems(
		itemName: string,
		cost: number,
		operator: string,
		page: number,
		storeName: string,
	) {
		//let baseUrl = "http://127.0.0.1:5001/api/v1/items";
		let baseUrl = "http://localhost:5001/api/v1/items";
		let finalUrl = baseUrl;
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
		console.log(finalUrl);
		let response = await fetch(finalUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		return response.json();
	}
	static async getPopularity() {
		let baseUrl = "http://localhost:5001/api/v1/items/getPopularity";
		let response = await fetch(baseUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response.json();
	}

	static async getStoreNames() {
		let baseUrl = "http://localhost:5001/api/v1/items/getStores";
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
