import { forEach } from "async";
import FavoritesDao from "../dao/favoritesDao";
import ScraperDao from "../dao/scraperDao";
import ScraperController from "./scraper-controller";

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

    static async getFavoriteByUserReturnItems(req: any, email: string): Promise<{}> {

        let favoritesList:
            {
                favorites: [{
                    _id: string,
                    user: string,
                    itemId: string,
                }]
            } = {
            favorites: [{
                _id: "",
                user: "",
                itemId: "",
            }]
        }

        let responseItems: {
            itemsList: [{
                _id: string,
                itemName: string,
                cost: number,
                idItem: string,
                image: string,
                storeName: string,
                popularity: number
                link: string
                blackList: boolean
            }],
            totalItemsList: number;
        } = {
            itemsList: [{
                _id: "",
                itemName: "",
                cost: -1,
                idItem: "",
                image: "",
                storeName: "",
                popularity: 0,
                link: "",
                blackList: false
            }],
            totalItemsList: 0
        }
        // let itemsListWithImages: [] = [];



        const itemsPerPage = req.query.itemsPerPage
            ? parseInt(req.query.itemsPerPage, 10)
            : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        await FavoritesDao.getFavoritesByUserPage(email, page, itemsPerPage).then((res: any) => {
            favoritesList = res;
        }).catch((error: any) => {
            return Promise.reject(error.error);
        });

        await Promise.all(favoritesList.favorites.map(async (favorite: any) => {
            return await ScraperDao.getItemByID(favorite.itemId).then((res: any) => {
                responseItems.itemsList.push(res);
            })
                .catch((error: any) => {
                    return Promise.reject(error);
                });
        }

        ))
        responseItems.itemsList.shift();


        await ScraperController.getImage(responseItems.itemsList).then((res: any) => {
            responseItems.itemsList = res;
            responseItems.totalItemsList = res.length;
        }).catch((error: any) => {
            return Promise.reject(error);
        })

        return Promise.resolve(responseItems);

    }

}
