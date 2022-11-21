import express from "express";
import ScraperController from "./scraper-controller";

const router = express.Router();
router.route("/").get(ScraperController.apiGetItem);
router.route("/").post(ScraperController.apiInsertItem);
router.route("/convert/").post((req: any, res: any, next: any) => {
    ScraperController.converFileToItems(req.body.filename,req.body.url, req, res, next)
});
router.route("/scraper/").post((req: any, res: any, next: any) => {
    ScraperController.scraperMain(req.body.scraper, req.body.filename, res);
});
export default router;