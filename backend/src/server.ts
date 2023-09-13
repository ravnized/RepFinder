
import * as dotenv from "dotenv";
import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import ScraperDao from "./dao/scraperDao";
import scraperRoutes from "./api/scraper-routes";
import usersRoutes from "./api/users-routes";
import UsersDao from "./dao/usersDao";
import scraperPriviligedRoutes from "./api/scraper-routes-logged";
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
		app.listen(5001, "0.0.0.0", () => console.log("Server started"));
		await ScraperDao.connDB(connection);
		await UsersDao.connDB(connection);
	});


app.use(cors({
	origin: '*'
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/v1/items", scraperRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/privileged-routes", scraperPriviligedRoutes);
app.use("*", (req, res) => {
	res.status(404).json({ error: "not found" });
});