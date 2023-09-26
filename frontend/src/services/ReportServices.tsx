import env from "react-dotenv";
class ReportServices {
	static async getAll(token: string) {
		let baseUrl = `${env.URL_REPORTS_PRIVILEGED}`;
		let req = await fetch(baseUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"User-agent": "RepFinder-Frontend/1.0.0",
				token: token,
			},
		}).catch((error) => {
			return Promise.reject([error]);
		});

		return await req.json();
	}

	static async reportItem(
		_id: string,
		idItem: string,
		cost: number,
		itemName: string,
		needToBeDeleted: boolean,
	) {
		let baseUrl = `${env.URL_REPORTS_PRIVILEGED}insert`;
		let req = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"User-agent": "RepFinder-Frontend/1.0.0",
			},
			body: JSON.stringify({
				_id: _id,
				idItem: idItem,
				cost: cost,
				itemName: itemName,
				needToDelete: needToBeDeleted,
			}),
		}).catch((error) => {
			return Promise.reject([error]);
		});

		return await req.json();
	}
	static async deleteReport(token: string, _id: string) {
		let baseUrl = `${env.URL_REPORTS_PRIVILEGED}delete`;
		let req = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"User-agent": "RepFinder-Frontend/1.0.0",
				token: token,
			},
			body: JSON.stringify({
				id: _id,
			}),
		}).catch((error) => {
			return Promise.reject([error]);
		});
		return await req.json();
	}
}

export default ReportServices;
