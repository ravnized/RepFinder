import express from "express";
import ReportController from "./report-controller";
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


/**
 * @argument /report/getAll 
 * @description Get all reports
 * Req: {reportsPerPage, itemId, cost, needTodelete, page}
 */

router.route("/").get((req: any, res: any) => {
    ReportController.getReports(req.query).then((response) => {
        return res.status(200).json(response)
    }).catch((error: any) => {
        return res.status(200).json(error)
    })
});


/**
 * @argument /report/delete
 * @description Delete a report
 * Req: {id Report}
 * 
 */
router.route("/delete").post((req: any, res: any) => {
    ReportController.deleteReport(req).then((response) => {
        return res.status(200).json(response)
    }).catch((error: any) => {
        return res.status(200).json(error)
    })
});
/**
 * @argument /report/deleteAll
 * @description Delete all reports
 * Req: {}
 */
router.route("/deleteAll").post((req: any, res: any) => {
    ReportController.deleteAllReports().then((response) => {
        return res.status(200).json(response)
    }).catch((error: any) => {
        return res.status(200).json(error)
    })
});

export default router;