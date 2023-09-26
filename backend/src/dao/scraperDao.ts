import { forEach } from "async";

let items: any;
interface filtersArray {
    [key: string]: string | number;
}

export default class ScraperDao {

    static connectionDB: any;
    /**
     * 
     * @param conn connection to the database
     * @returns promise with the result of the connection
     * @description Function for Connection to the database
     */
    static async connDB(conn: any): Promise<{}> {
        this.connectionDB = conn;
        try {
            items = await conn.db("Main").collection("Items")
            await conn.db("Main").collection("Items").createIndex({
                idItem: 1,
            }, { unique: true });
            await conn.db("Main").collection("Items").createIndex({
                itemName: "text",
            });
        } catch (e) {
            return Promise.reject(e)
        }
        return Promise.resolve({
            message: "Connection to DB established"
        })
    }
    /**
     * @description Function for deleting all the items in the database
     * @returns promise with the result of the deletion
     */
    static async deleteAllItems(): Promise<{ message: string } | { error: string }> {
        try {

            await this.connectionDB.db("Main").collection("Items").deleteMany({});
        } catch (e) {
            return Promise.reject({ error: `Error in deleting Items: ${e}` })
        }
        return Promise.resolve({ message: "Items deleted" })
    }
    /**
     * 
     * @param param0 filters for the items, page, itemsPerPage and sortBy
     * @returns Promise with the itemsList, totalItemsList and error
     * @description Function for getting the items from the database
     */
    static async getItems({
        filters = {} as filtersArray,
        page = 0,
        itemsPerPage = 10,
        sortBy = {},
    }): Promise<{
        itemsList: [{
            _id: string,
            itemName: string,
            cost: number,
            idItem: string,
            image: string,
            storeName: string,
            popularity: number,
            link: string,
            blackList: boolean,
        }],
        totalItemsList: number;
    }> {
        let itemName = "",
            cost: any = [],
            storeName = "",
            $text,
            blackList = false;
        let query: any = {
            itemName,
            cost,
            storeName,
            $text,
            blackList,
        }
        for (let querySingle in query) {
            let filterArray: any = filters[querySingle]
            if (filterArray !== undefined) {
                const entries = new Map([
                    [filterArray[1], filterArray[0]]
                ]);
                let object = Object.fromEntries(entries)

                query[querySingle] = object;

            } else {
                delete query[querySingle];
            }
        }
        //console.log(`requested query ${JSON.stringify(query)}`);
        //console.log(JSON.stringify(items))
        let cursor: any;
        console.log(`query: ${JSON.stringify(query)}`)
        try {
            cursor = await items.find(query).sort(sortBy)
        } catch (e: any) {
            return Promise.reject({
                error: `Error in finding items: ${e}`
            })
        }

        //console.log(`cursor: ${JSON.stringify(cursor)}`)

        const displayCursor = cursor
            .limit(itemsPerPage)
            .skip(itemsPerPage * page);


        let itemsList = await displayCursor.toArray()
        let totalItemsList = 0;
        try {
            totalItemsList = await items.countDocuments(query);
        } catch (e: any) {
            return Promise.reject({
                error: `Error in counting items: ${e}`
            })
        }


        return Promise.resolve({
            itemsList,
            totalItemsList,
        });
    }
    /**
     * 
     * @param idItem id of the item
     * @returns Promise with the item
     * @description Function for getting an item by id
     */
    static async getItemByID(
        idItem: string
    ): Promise<{
        _id: string;
        itemName: string;
        cost: number;
        idItem: string;
        image: string;
        link: string;
        storeName: string;
        popularity: number;
    }
    > {

        let query = {
            idItem: "",
        }
        query.idItem = idItem
        let cursor: any;
        let itemsList: any;
        try {
            cursor = await items.find(query)
        } catch (e: any) {
            return Promise.reject({
                error: `Error in finding items: ${e}`
            })
        };
        let displayCursor;
        try {
            displayCursor = await cursor
                .limit(20)
                .skip(20 * 0);
        } catch (e: any) {
            return Promise.reject({
                error: `Error in finding items: ${e}`
            })
        };

        try {
            itemsList = await displayCursor.toArray();
        } catch (e: any) {
            return Promise.reject({
                error: `Error in finding items: ${e}`
            })
        };
        return Promise.resolve(itemsList[0]);

    }


    static async getItemBy_ID(
        idItem: string
    ): Promise<{
        _id: string;
        itemName: string;
        cost: number;
        idItem: string;
        image: string;
        link: string;
        storeName: string;
        popularity: number;
    }
    > {

        let query = {
            _id: "",
        }
        let ObjectID = require('mongodb').ObjectID;
        let objId = new ObjectID(idItem);
        query._id = objId
        let cursor: any;
        let itemsList: any;
        try {
            cursor = await items.find(query)
        } catch (e: any) {
            return Promise.reject({
                error: `Error in finding items: ${e}`
            })
        };
        let displayCursor;
        try {
            displayCursor = await cursor
                .limit(20)
                .skip(20 * 0);
        } catch (e: any) {
            return Promise.reject({
                error: `Error in finding items: ${e}`
            })
        };

        try {
            itemsList = await displayCursor.toArray();
        } catch (e: any) {
            return Promise.reject({
                error: `Error in finding items: ${e}`
            })
        };
        return Promise.resolve(itemsList[0]);

    }

    /**
     * 
     * @param param0 itemName, cost, image, storeName, idItem, link, popularity
     * @returns return Promise with the result of the insertion
     * @description Function for inserting an item in the database
     */
    static async insertItem({
        itemName = "",
        cost = 0,
        image = "",
        storeName = "",
        idItem = "",
        link = "",
        popularity = 0,
    }): Promise<
        {}
    > {

        let cursor: any;

        let item = {
            itemName,
            cost,
            idItem,
            image,
            link,
            storeName,
            popularity,
        };


        cursor = await items.insertOne(item).catch((e: any) => {
            return Promise.reject({
                error: `Unable to insert item, ${e}`,
            });
        });


        return Promise.resolve(cursor);
    }

    /**
     * 
     * @param objectToInsert array of objects to insert in database
     * @returns Promise with the result of the insertion
     * @description Function for inserting multiple items in the database
     */
    static async insertItems(objectToInsert: [{}]): Promise<{} | { error: string }> {
        let cursor: {};

        try {
            cursor = await items.insertMany(objectToInsert);

        } catch (e) {
            return Promise.reject({
                error: `Unable to insert order, ${e}`,
            });
        }
        return Promise.resolve(cursor);
    }


    static async incrementOne(itemId: string): Promise<{}> {
        await this.getItemByID(itemId).catch((e: any) => {
            return Promise.reject({
                error: `Unable to get item, ${e}`,
            });
        }).then(async (res: any) => {
            try {
                await items.updateOne(
                    { "idItem": itemId },
                    { $set: { "popularity": res[0].popularity + 1 } }
                )
            } catch (e) {
                return Promise.reject({
                    error: `Unable to update item, ${e}`,
                });
            }
        })


        return Promise.resolve({
            "message": "success",
        });
        /*
        if (items.popularity === undefined) {
            await items.updateOne(
                { "_id": ObjectId(item[0]._id) },
                {
                    $set: { "popularity": 1 }
                }
            )
        } else {
            await items.updateOne(
                { "_id": ObjectId(item[0]._id) },
                { $set: { "popularity": item[0].popularity + 1 } }
            )
        }
        */
    }

    static async updateCost(itemId: string, cost: number): Promise<{}> {
        await this.getItemByID(itemId).catch((e: any) => {
            return Promise.reject({
                error: `Unable to get item, ${e}`,
            });
        }).then(async (res: any) => {
            if (res.cost === cost) {
                try {
                    await items.updateOne(
                        { "idItem": itemId },
                        { $set: { "cost": cost } }
                    )
                } catch (e) {
                    return Promise.reject({
                        error: `Unable to update item, ${e}`,
                    });
                }
            } else {
                return Promise.reject({
                    error: `Unable to update item`,
                });
            }

        })
        return Promise.resolve({
            "message": "success",
        });
    }

    static async updateItemName(itemId: string, itemName: string): Promise<{}> {
        await this.getItemByID(itemId).catch((e: any) => {
            return Promise.reject({
                error: `Unable to get item, ${e}`,
            });
        }).then(async (res: any) => {
            if (res.itemName === itemName) {
                try {
                    await items.updateOne(
                        { "idItem": itemId },
                        { $set: { "itemName": itemName } }
                    )
                } catch (e) {
                    return Promise.reject({
                        error: `Unable to update item, ${e}`,
                    });
                }
            } else {
                return Promise.reject({
                    error: `Unable to update item`,
                });
            }

        })
        return Promise.resolve({
            "message": "success",
        });
    }

    static async blacklistItem(_id: string): Promise<{}> {
        let ObjectID = require('mongodb').ObjectID;
        let objId = new ObjectID(_id);

        try {
            await items.updateOne({ "_id": objId }, { $set: { "blackList": true } });
        } catch (e) {
            console.log(`deleteOne : ${e}`)
            return Promise.reject({
                error: `Unable to delete item, ${e}`,
            });
        }
        return Promise.resolve({
            "message": "success",
        });
    }

    static async updateItem(_id: string, itemName: string, itemNameChanged: boolean, cost: number, itemCostChanged: boolean): Promise<{}> {

        let ObjectID = require('mongodb').ObjectID;
        let objId = new ObjectID(_id);

        let query: { itemName?: string, cost?: number } = {
            itemName: "",
            cost: 0,
        }

        if (itemNameChanged) {
            query.itemName = itemName;
        } else {
            delete query.itemName;
        }
        if (itemCostChanged) {
            query.cost = cost;
        } else {
            delete query.cost;
        }

        console.log(`query: ${JSON.stringify(query)}`)

        await items.updateOne({ "_id": objId }, { $set: query }).catch((e: any) => {
            console.log(`updateOne : ${e}`)
            return Promise.reject({
                error: `Unable to update item, ${e}`,
            });
        })
        return Promise.resolve({
            "message": "success",
        });
    }


    //get stores names from database and return them
    static async getStoreName(): Promise<{}> {
        let cursor: any;
        let storesNames: any;
        try {
            cursor = await items.aggregate([
                {
                    $group: {
                        _id: "$storeName"
                    }
                }
            ])
        } catch (e: any) {
            return Promise.reject({
                error: `Error in finding items: ${e}`
            })
        };
        let displayCursor;
        try {
            displayCursor = await cursor
                .limit(20)
                .skip(20 * 0);
        } catch (e: any) {
            return Promise.reject({
                error: `Error in finding items: ${e}`
            })
        };

        try {
            storesNames = await displayCursor.toArray();
        } catch (e: any) {
            return Promise.reject({
                error: `Error in finding items: ${e}`
            })
        };
        return Promise.resolve(storesNames);

    }

}