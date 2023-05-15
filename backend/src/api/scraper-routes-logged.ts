import express from "express";
import ScraperController from "./scraper-controller";
import UsersController from "./users-controller";
const router = express.Router();

router.use((req: any, res: any, next: any) => {
    UsersController.getRole(req).then((result: any) => {
        next();
    }).catch((err: any) => {
        res.status(500).json(err);
    }
    );
})


router.route("/converter/").post((req: any, res: any) => {
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
router.route("/callerInsertItems").post((req: any, res: any) => {
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
router.route("/deleteAll").post((req: any, res: any) => {
    ScraperController.deleteAll().then((result: any) => {
        return res.status(200).json(result);
    }).catch((err: any) => {
        return res.status(500).json(err);
    });
});
export default router;