import FavoritesDao from "../dao/favoritesDao";

export default class FavoritesController {
    static async favoriteSubmit(req: any, user: string) {
        let favorite = {
            user: user,
            itemId: req.body.itemId,
        }
        await FavoritesDao.insertFavorite(favorite.user, favorite.itemId).catch((error: any) => {
            return Promise.reject(error);
        })

        return Promise.resolve({
            message: "Favorite submitted"
        })
    }



    static async deleteFavorite(req: any, user: string) {
        let favorite = {
            user: user,
            itemId: req.body.itemId,
        }
        await FavoritesDao.deleteFavorite(favorite.user, favorite.itemId).catch((error: any) => {
            return Promise.reject(error);
        })

        return Promise.resolve({
            message: "Favorite deleted"
        })
    }

    static async getFavorites(req: any): Promise<{}> {

        let favorites: {
            favoritesList: [{
                user: string,
                itemId: string,
            }], totalFavoritesList: number
        } = {
            favoritesList: [{
                user: "",
                itemId: "",
            }], totalFavoritesList: 0
        }

        const favoritesPerPage = req.query.favoritesPerPage
            ? parseInt(req.favoritesPerPage, 10)
            : 20;
        const page = req.query.page ? parseInt(req.page, 10) : 0;
        let filters: any = {};
        if (req.query.user) {
            filters.user = req.query.user;
        }
        if (req.query.itemId) {
            filters.itemId = req.query.itemId;
        }

        try {
            favorites = await FavoritesDao.getFavorites(
                filters, page, favoritesPerPage);
        } catch (e) {
            return Promise.reject({
                error: `Error in getting favorites: ${e}`
            })
        }
        return Promise.resolve(favorites);
    }

    static async getFavoriteByUser(email: string): Promise<{}> {
        let favorites:
            [{
                user: string,
                itemId: string,
            }] = [{
                user: "",
                itemId: "",
            }]


        

        try {
            favorites = await FavoritesDao.getFavoritesByUser(
                email);
        } catch (e) {
            return Promise.reject({
                error: `Error in getting favorites: ${e}`
            })
        }
        return Promise.resolve(favorites);
    }

}
