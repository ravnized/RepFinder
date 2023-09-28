import express from "express";
import UsersController from "./users-controller";
import FavoritesController from "./favorites-controller";

var router = express.Router();


router.use((req: any, res: any, next: any) => {
    UsersController.getEmail(req).then((result: any) => {
        res.email = result.email;
        next();
    }).catch((err: any) => {
        res.status(500).json(err);
    }
    );
})

router.route("/insert").post((req: any, res: any) => {
    FavoritesController.favoriteSubmit(req, res.email).then((result: any) => {
        res.status(200).json(result)
    }
    ).catch((err: any) => {
        res.status(500).json(err)
    });
});

router.route("/delete").post((req: any, res: any) => {
    FavoritesController.deleteFavorite(req, res.email).then((result: any) => {
        res.status(200).json(result)
    }
    ).catch((err: any) => {
        res.status(500).json(err)
    });
});

router.route("/getByUser").post((req: any, res: any) => {
    FavoritesController.getFavoriteByUser(res.email).then((result: any) => {
        res.status(200).json(result)
    }
    ).catch((err: any) => {
        res.status(500).json(err)
    });
});

router.route("/getItems").post((req: any, res: any) => {
    FavoritesController.getFavoriteByUserReturnItems(req, res.email).then((result: any) => {
        res.status(200).json(result)
    }
    ).catch((err: any) => {
        res.status(500).json(err)
    });
});



export default router;