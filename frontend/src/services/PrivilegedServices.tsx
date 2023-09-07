class ScraperServices {
	static async scraping(
		arrayLinkFilename: string[],
		token: string,
	) {
		let baseUrl = "http://localhost:5000/api/v1/privileged-routes/scraperMulti";
		console.log(token);

		

		let response = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				scraper: arrayLinkFilename,
				token: token,
			}),
		});

		return await response.json();
	}
}

export default ScraperServices;
