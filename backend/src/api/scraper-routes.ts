import express from "express";
import ScraperController from "./scraper-controller";
import { any } from "async";

const router = express.Router();
router.route("/").get((req: any, res: any) => {
    ScraperController.apiGetItem(req, res)
});
router.route("/").post(ScraperController.apiInsertItem);
router.route("/convert/").get((req: any, res: any, next: any) => {
    ScraperController.converFileToItems(req.body.filename, req.body.url, req, res, next)
});
router.route("/converter/").get((req: any, res: any) => {
    ScraperController.converterFilesToItems().then((result: any) => {
        res.status(200).json(result)
    }).catch((err: any) => {
        res.status(500).json(err)
    });
});

router.route("/scraperMulti/").post((req: any, res: any) => {
    ScraperController.scraperMulti(req.body, res);
});

router.route("/searchByID").get((req: any, res: any, next: any) => {
    console.log(req.query.id)
    return req.query.id !== "" || req.query.id !== " " || req.query.id !== undefined ? ScraperController.apiGetItemById(res, req.query.id) : res.json({
        error: "No id"
    })
})
router.route("/incrementOne").get((req: any, res: any, next: any) => {
    console.log(req.query.id)
    return req.query.id !== "" || req.query.id !== " " || req.query.id !== undefined ? ScraperController.apiPopularity(res, req.query.id) : res.json({
        error: "No id"
    })
})
router.route("/getPopularity").get((req: any, res: any) => {
    ScraperController.apiGetPopularity(req, res)
})

export default router;