import HttpItems from "../components/Http-items";

class ItemsDataServices {
	static getAll(page = 0) {
		return HttpItems.get(`?page=${page}`);
	}
	static async getItems(
		itemName: string,
		cost: number,
		operator: string,
		page = 0,
	) {
		let baseUrl = "http://localhost:5000/api/v1/items";
		let finalUrl = baseUrl;
		finalUrl += `?page=${page}`;
		if (cost !== 0) {
			finalUrl += `&cost[0]=${cost}&cost[1]=${operator}`;
		}
		if (itemName !== "") {
			finalUrl += `&$text[0]=${itemName}&$text[1]=$search`;
		}
		let response = await fetch(finalUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		return response.json();
	}
	
}

export default ItemsDataServices;
