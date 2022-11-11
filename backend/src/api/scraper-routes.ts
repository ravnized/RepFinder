import express from "express";
import ScraperController from "./scraper-controller";

const router = express.Router();
router.route("/").get(ScraperController.apiGetItem);
router.route("/").post(ScraperController.apiInsertItem);
router.route("/:filename").patch((req: any, res: any) => {
    ScraperController.converFileToItems(req.params.filename)
});
export default router;