
import * as dotenv from "dotenv";
import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import ScraperDao from "./scraper";
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
		await ScraperDao.scraperTest();
		app.listen(5001, () => console.log("Server started on port 5001"));
	});

app.use(cors());

app.use(bodyParser.json());
app.use(cookieParser());
