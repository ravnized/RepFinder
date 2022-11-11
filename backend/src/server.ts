
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
		const server = app.listen(8080, () => {
			console.log(`server started on port 8080`);
		});
		await ScraperDao.getResponseData("http://chaosmade.x.yupoo.com/albums?page=1", "chaosMade");

	});

app.use(cors());

app.use(bodyParser.json());
app.use(cookieParser());

