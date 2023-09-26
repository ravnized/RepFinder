class ScraperServices {
	static async scraping(
		arrayLinkFilename: { filename: string; url: string }[],
		token: string,
	) {
		let baseUrl = "http://localhost:5001/api/v1/privileged-routes/scraperMulti";

		let req = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
				"User-agent": "RepFinder-Frontend/1.0.0",
			},
			body: JSON.stringify({
				scraper: arrayLinkFilename,
			}),
		}).catch((error) => {
			return error;
		});
		return await req.json();
	}

	static async convertAll(token: string): Promise<[]> {
		let baseUrl = "http://localhost:5001/api/v1/privileged-routes/converter";

		let req = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
				"User-agent": "RepFinder-Frontend/1.0.0",
			},
		}).catch((error) => {
			return Promise.reject([error]);
		});

		return Promise.resolve(await req.json());
	}
	static async getFiles(token: string): Promise<[]> {
		let baseUrl = "http://localhost:5001/api/v1/privileged-routes/getFiles";

		let req = await fetch(baseUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				token: token,
				"User-agent": "RepFinder-Frontend/1.0.0",
			},
		}).catch((error) => {
			return Promise.reject([error]);
		});

		return Promise.resolve(await req.json());
	}
	static async updateDatabase(token: string, filename: string[]): Promise<[]> {
		let baseUrl = "http://localhost:5001/api/v1/privileged-routes/updateItems";

		let req = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
				"User-agent": "RepFinder-Frontend/1.0.0",
			},
			body: JSON.stringify({
				filename: filename,
			}),
		}).catch((error) => {
			return Promise.reject([error]);
		});

		return Promise.resolve(await req.json());
	}
	static async deleteAll(token: string): Promise<[]> {
		let baseUrl = "http://localhost:5001/api/v1/privileged-routes/deleteAll";
		let req = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
				"User-agent": "RepFinder-Frontend/1.0.0",
			},
		}).catch((error) => {
			return Promise.reject([error]);
		});
		return Promise.resolve(await req.json());
	}

	static async blacklistItem(
		token: string,
		_id: string,
		itemId: string,
	): Promise<[]> {
		let baseUrl =
			"http://localhost:5001/api/v1/privileged-routes/blacklistItem";
		let req = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
				"User-agent": "RepFinder-Frontend/1.0.0",
			},
			body: JSON.stringify({
				item_id: _id,
				itemId: itemId,
			}),
		}).catch((error) => {
			return Promise.reject([error]);
		});
		return Promise.resolve(await req.json());
	}

	static async updateItem(
		token: string,
		_id: string,
		itemName: string,
		itemNameChanged: boolean,
		itemCost: number,
		itemCostChanged: boolean,
	): Promise<[]> {
		let baseUrl = "http://localhost:5001/api/v1/privileged-routes/update";
		let req = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
				"User-agent": "RepFinder-Frontend/1.0.0",
			},
			body: JSON.stringify({
				_id: _id,
				itemName: itemName,
				itemNameChanged: itemNameChanged,
				itemCost: itemCost,
				itemCostChanged: itemCostChanged,
			}),
		}).catch((error) => {
			return Promise.reject([error]);
		});
		return Promise.resolve(await req.json());
	}
	static async clearCache(token: string): Promise<[]> {
		let baseUrl = "http://localhost:5001/api/v1/privileged-routes/clearCache";
		let req = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
				"User-agent": "RepFinder-Frontend/1.0.0",
			},
		}).catch((error) => {
			return Promise.reject([error]);
		});
		return Promise.resolve(await req.json());
	}
}

export default ScraperServices;
