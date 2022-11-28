import axios from "axios";

export default axios.create({
	baseURL: "https://backend-repfinder.herokuapp.com/api/v1/items",
	headers: {
		"Content-type": "application/json",
	},
});
