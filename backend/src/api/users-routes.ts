import express from "express";
import UsersController from "./users-controller";

const router = express.Router();

router.route("/login").post((req: any, res: any) => {
    UsersController.login(req).then((response) => {
        return res.status(200).json(response)
    }).catch((error: any) => {
        return res.status(200).json(error)
    })
});

router.route("/register").post((req: any, res: any) => {
    UsersController.register(req).then((response) => {
        return res.status(200).json(response)
    }).catch((error: any) => {
        return res.status(200).json(error)
    })
});

router.route("/verifyToken").post( (req: any, res: any) => {
    UsersController.verifyToken(req).then((response) => {
        return res.status(200).json(response)
    }).catch((error: any) => {
        return res.status(200).json(error)
    })
});
export default router;