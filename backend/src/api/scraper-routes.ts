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

router.route("/converter/").get((req: any, res: any) => {
    ScraperController.converterFilesToItems().then((result: any) => {
        res.status(200).json(result)
    }).catch((err: any) => {
        res.status(500).json(err)
    });
});
router.route("/scraperMulti/").post((req: any, res: any) => {
    ScraperController.scraperMulti(req.body).then((data: any) => {
        return res.status(200).json({
            data: data
        })
    })
        .catch((err: any) => {
            return res.status(500).json({
                error: err
            });
        });
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
    return req.query.id !== "" || req.query.id !== " " || req.query.id !== undefined ? ScraperController.getItemById(req.query.id) : res.json({
        error: "No id"
    })
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


router.route("/deleteAll").get((req: any, res: any) => {
    ScraperController.deleteAll().then((result: any) => {
        return res.status(200).json(result);
    }).catch((err: any) => {
        return res.status(500).json(err);
    });
});

export default router;