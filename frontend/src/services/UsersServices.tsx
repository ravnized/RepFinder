class LoginDataServices {
	static async getToken(email: string, password: string) {
		let baseUrl = "http://localhost:5000/api/v1/users/login";
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
		let baseUrl = "http://localhost:5000/api/v1/users/verifyToken";
		console.log(token);

		let response = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				token: token,
			}),
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
		let baseUrl = "http://localhost:5000/api/v1/users/register";
		console.log(email);

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
