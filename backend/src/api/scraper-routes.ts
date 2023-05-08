import express from "express";
import ScraperController from "./scraper-controller";

const router = express.Router();
router.route("/").get((req: any, res: any) => {
    ScraperController.apiGetItem(req, res)
});
router.route("/").post(ScraperController.apiInsertItem);
router.route("/convert/").post((req: any, res: any, next: any) => {
    ScraperController.converFileToItems(req.body.filename, req.body.url, req, res, next)
});
router.route("/scraper/").post((req: any, res: any) => {
    let checkPasse = false;
    console.log(req.body.scraper);
    if (req.body.scraper == "" || req.body.scraper == " " || req.body.scraper == undefined) {
        checkPasse = false
        return res.json({
            error: "No url"
        })
    } else {
        checkPasse = true
    }
    if (req.body.filename == "" || req.body.filename == " " || req.body.filename == undefined) {
        checkPasse = false
        return res.json({
            error: "No filename"
        })
    } else {
        checkPasse = true
    }
    if (checkPasse == true) {
        ScraperController.scraperMain(req.body.scraper, req.body.filename, res);
    }

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