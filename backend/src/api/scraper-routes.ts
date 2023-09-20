import express from "express";
import ScraperController from "./scraper-controller";

const router = express.Router();
router.route("/").get((req: any, res: any) => {
    ScraperController.getItem(req.query).then((response) => {
        return res.status(200).json(response)
    }).catch((error: any) => {
        return res.status(500).json(error)
    })
});
//router.route("/").post(ScraperController.apiInsertItem);
router.route("/searchByID").get((req: any, res: any, next: any) => {
    return req.query.id !== "" || req.query.id !== " " || req.query.id !== undefined ? ScraperController.getItemById(req.query.id) : res.json({
        error: "No id"
    })
})
router.route("/searchBy_ID").get((req: any, res: any, next: any) => {
    ScraperController.getItemBy_Id(req.query._id).then((data: any) => {
        return res.status(200).json(data);
    }).catch((e: any) => {
        return res.status(500).json(e);
    }
    );
})

router.route("/incrementOne").post((req: any, res: any, next: any) => {
    ScraperController.incrementPopularity(req.query.id).then(() => {
        return res.status(200).json({
            message: "Incremented"
        });
    }).catch((e: any) => {
        return res.status(500).json(e);
    })
})

router.route("/getStores").get((req: any, res: any, next: any) => {
    ScraperController.getStoreName().then((data: any) => {
        return res.status(200).json(data);
    }).catch((e: any) => {
        return res.status(500).json(e);
    })
})

export default router;