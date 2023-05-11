import express from "express";
import ScraperController from "./scraper-controller";
import { any } from "async";

const router = express.Router();
router.route("/").get((req: any, res: any) => {
    ScraperController.apiGetItem(req, res)
});
router.route("/").post(ScraperController.apiInsertItem);

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
router.route("/callerInsertItems").get((req: any, res: any) => {
    ScraperController.callerInsertItems().then((result: any) => {
        return res.status(200).json(result)
    }).catch((err: any) => {
        return res.status(500).json(err)
    });
})
router.route("/updateItems").post((req: any, res: any) => {
    ScraperController.updateItems(req.body.filename).then((result: any) => {
        return res.status(200).json(result);
    }).catch((err: any) => {
        return res.status(500).json(err);
    });
})



router.route("/searchByID").get((req: any, res: any, next: any) => {
    console.log(req.query.id)
    return req.query.id !== "" || req.query.id !== " " || req.query.id !== undefined ? ScraperController.apiGetItemById(req.query.id) : res.json({
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

router.route("/deleteAll").get( (req: any, res: any) => {
    ScraperController.deleteAll().then((result: any) => {
        return res.status(200).json(result);
    }).catch((err: any) => {
        return res.status(500).json(err);
    });
});

export default router;