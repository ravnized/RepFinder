import express from "express";
import ScraperController from "./scraper-controller";

const router = express.Router();
router.route("/").get(ScraperController.apiGetItem);
router.route("/").post(ScraperController.apiInsertItem);
router.route("/").patch(ScraperController.converFileToItems);
export default router;