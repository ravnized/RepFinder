let favorites: any;
export default class FavoritesDao {
    static connectionDB: any;
    static async connDB(conn: any) {
        this.connectionDB = conn;
        if (favorites) return;
        try {
            favorites = await conn.db("Main").collection("Favorites");
            await conn.db("Main").collection("Favorites").createIndex({
                user: 1,
                itemId: 1
            }, { unique: true });
        } catch (e) {
            return Promise.reject(e)
        }
        return Promise.resolve({
            message: "Connection to users established"
        });
    }

    static async insertFavorite(user: string, itemId: string): Promise<any> {
        let query = {
            user: "",
            itemId: "",
        }
        query.user = user;
        query.itemId = itemId;
        try {
            await favorites.insertOne(query);
        } catch (e) {
            return Promise.reject({
                error: `Error in inserting favorite: ${e}`
            })
        }
        return Promise.resolve({
            message: "Favorite inserted"
        });
    }

    static async deleteFavorite(user: string, itemId: string): Promise<any> {
        let query = {
            user: "",
            itemId: "",
        }
        query.user = user;
        query.itemId = itemId;
        try {
            await favorites.deleteOne(query);
        } catch (e) {
            return Promise.reject({
                error: `Error in deleting favorite: ${e}`
            })
        }
        return Promise.resolve({
            message: "Favorite deleted"
        });
    }

    static async getFavorites(user: string, page: number, favoritesPerPage: number): Promise<any> {
        let query = {
            user: "",
        }
        query.user = user;
        let cursor: any;
        let favoritesList: [{}] = [{
            user: "",
            itemId: "",
        }];
        try {
            cursor = await favorites.find(query).limit(favoritesPerPage).skip(favoritesPerPage * page);
        } catch (e) {
            return Promise.reject({
                error: `Error in getting favorites: ${e}`
            })
        }
        try {
            favoritesList = await cursor.toArray();
        } catch (e) {
            return Promise.reject({
                error: `Error in getting favorites: ${e}`
            })
        }
        return Promise.resolve({
            favorites: favoritesList
        });
    }

    static async getFavoritesByItem(itemId: string, page: number, favoritesPerPage: number): Promise<any> {
        let query = {
            itemId: "",
        }
        query.itemId = itemId;
        let cursor: any;
        let favoritesList: [{}] = [{
            user: "",
            itemId: "",
        }];
        try {
            cursor = await favorites.find(query);
        } catch (e) {
            return Promise.reject({
                error: `Error in getting favorites: ${e}`
            })
        }
        try {
            favoritesList = await cursor.toArray();
        } catch (e) {
            return Promise.reject({
                error: `Error in getting favorites: ${e}`
            })
        }
        return Promise.resolve({
            favorites: favoritesList
        });
    }

    static async getFavoritesByUser(user: string): Promise<any> {
        let query = {
            user: "",
        }
        query.user = user;
        let cursor: any;
        let favoritesList: [{}] = [{
            user: "",
            itemId: "",
        }];
        try {
            cursor = await favorites.find(query);
        } catch (e) {
            return Promise.reject({
                error: `Error in getting favorites: ${e}`
            })
        }
        try {
            favoritesList = await cursor.toArray();
        } catch (e) {
            return Promise.reject({
                error: `Error in getting favorites: ${e}`
            })
        }
        return Promise.resolve({
            favorites: favoritesList
        });
    }





}