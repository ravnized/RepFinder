import express from "express";
import ScraperController from "./scraper-controller";

const router = express.Router();
router.route("/").get(ScraperController.apiGetItem);
router.route("/").post(ScraperController.apiInsertItem);
router.route("/:filename/").post((req: any, res: any, next: any) => {
    ScraperController.converFileToItems(req.params.filename, req, res, next)
});
export default router;