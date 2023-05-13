import express from "express";
import UsersController from "./users-controller";

const router = express.Router();

router.route("/login").post((req: any, res: any) => {
    UsersController.login(req).then((response) => {
        return res.status(200).json(response)
    }).catch((error: any) => {
        return res.status(500).json(error)
    })
});
export default router;