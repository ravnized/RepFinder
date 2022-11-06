import * as dotenv from "dotenv";
import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
const app = express();
declare var process: {
	env: {
		MONGODB_URI: string;
	};
};
dotenv.config({ path: __dirname + "/../.env" });
const mongoClient = MongoClient;

mongoClient
	.connect(process.env.MONGODB_URI)
	.catch((err: any) => {
		console.error(err.stack);
	})
	.then(async (connection: any) => {
		
		app.listen(5001, () => console.log("Server started on port 5001"));
	});