
import * as dotenv from "dotenv";
import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import ScraperDao from "./dao/scraperDao";
import scraperRoutes from "./api/scraper-routes";
const app = express();
declare var process: {
	env: {
		MONGODB_URI: string;
		PORT: number
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
		app.listen(process.env.PORT || 5000, "0.0.0.0", () => console.log("Server started"));
		await ScraperDao.connDB(connection);
		//let scraper = new ScraperDao();
		//await scraper.getResponseData("https://chaosmade.x.yupoo.com/albums?page=1", "chaosMade");

	});
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "93.41.49.55"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/v1/items", scraperRoutes);
app.use("*", (req, res) => {
	res.status(404).json({ error: "not found" });
});