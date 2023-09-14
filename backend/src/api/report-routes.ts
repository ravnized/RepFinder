import express from "express";
import ReportController from "./report-controller";
const router = express.Router();

/**
 * @argument /report/insert
 * @description Insert a report
 * Req: {itemName, cost, idItem, needToDelete}
 */
router.route("/insert").post((req: any, res: any) => {
    ReportController.reportSubmit(req).then((response) => {
        return res.status(200).json(response)
    }).catch((error: any) => {
        return res.status(200).json(error)
    })
});

export default router;