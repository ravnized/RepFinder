import env from "react-dotenv";
class LoginDataServices {
	static async getToken(email: string, password: string) {
		let baseUrl = `${env.URL_USERS}/login`;
		console.log(email);

		let response = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: email,
				password: password,
			}),
		});

		return await response.json();
	}
	static async verifyToken(token: string) {
		let baseUrl = `${env.URL_USERS}/verifyToken`;

		let response = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
			},
		});

		return await response.json();
	}
}
class RegisterDataServices {
	static async registerData(
		email: string,
		password: string,
		name: string,
		lastName: string,
	) {
		let baseUrl = `${env.URL_USERS}/register`;

		let response = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: email,
				password: password,
				name: name,
				lastName: lastName,
			}),
		});

		return await response.json();
	}
}

export { LoginDataServices, RegisterDataServices };
