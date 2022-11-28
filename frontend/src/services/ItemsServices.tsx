import HttpItems from "../components/Http-items";

class ItemsDataServices {
	static getAll(page = 0) {
		return HttpItems.get(`?page=${page}`);
	}
}

export default ItemsDataServices;
