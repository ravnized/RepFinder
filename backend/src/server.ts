
import * as dotenv from "dotenv";

import { MongoClient } from "mongodb";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import ScraperDao from "./dao/scraperDao";
import scraperRoutes from "./api/scraper-routes";
import usersRoutes from "./api/users-routes";
import UsersDao from "./dao/usersDao";
import scraperPriviligedRoutes from "./api/scraper-routes-logged";
import reportRoutesLogged from "./api/report-routes-logged";
import reportRoutes from "./api/report-routes";
import ReportDao from "./dao/reportDao";
import ScraperController from "./api/scraper-controller";
import UsersController from "./api/users-controller";
var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);


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

		app.listen(5001, () => console.info(`Server running on port: ${5001}`));
		await ScraperDao.connDB(connection);
		await UsersDao.connDB(connection);
		await ReportDao.connDB(connection);
	});


app.use(cors({
	origin: '*'
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/v1/items", scraperRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/privileged-routes", scraperPriviligedRoutes);
app.use("/api/v1/privileged-reports", reportRoutesLogged);
app.use("/api/v1/reports", reportRoutes);
app.ws("/scraperMultiWs", (ws: any, req: any) => {
	ws.on("message", (msg: any) => {
		let jsonMsg = JSON.parse(msg);
		UsersController.getRoleWs(jsonMsg).then( () => {
			ScraperController.scraperMulti(jsonMsg, ws).then((data: any) => {
				ws.send(JSON.stringify({
					data: data
				}));
			}).catch((err: any) => {
				ws.send(JSON.stringify({
					error: err
				}));
			}
			);
		})
		
	});
	//ws.send("Hello");
});

app.use("*", (req: any, res: any) => {
	res.status(404).json({ error: "not found" });
});