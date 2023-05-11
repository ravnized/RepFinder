

let items: any;
interface filtersArray {
    [key: string]: string | number;
}

export default class ScraperDao {

    static connectionDB: any;
    static async connDB(conn: any) {
        this.connectionDB = conn;
        if (items) return;
        try {
            items = await conn.db("Main").collection("Items")
            await conn.db("Main").collection("Items").createIndex({
                idItem: "text"
            }, { unique: true });
            console.log(`Items collection initialized`);
        } catch (e) {
            console.error(`unable to enstablish a collection handle ${e}`);
        }
    }

    static async deleteAllItems(): Promise<{ message: string } | { error: string }> {
        try {

            await this.connectionDB.db("Main").collection("Items").deleteMany({});
        } catch (e) {
            return Promise.reject({ error: `Error in deleting Items: ${e}` })
        }
        return { message: "Items deleted" }
    }

    static async getItems({
        filters = {} as filtersArray,
        page = 0,
        itemsPerPage = 10,
    } = {}): Promise<any> {
        let itemName = "",
            cost: any = [],
            images: any = [],
            storeName = "",
            $text;

        try {
            let query: any = {
                itemName,
                cost,
                images,
                storeName,
                $text,
            }



            for (let querySingle in query) {

                let filterArray: any = filters[querySingle]
                if (filterArray !== undefined) {


                    const entries = new Map([
                        [filterArray[1], filterArray[0]]
                    ]);
                    let object = Object.fromEntries(entries)
                    console.log(`oggetto: ${JSON.stringify(object)}`)
                    query[querySingle] = object;


                } else {
                    delete query[querySingle];
                }



            }
            console.log(`requested query ${JSON.stringify(query)}`);
            //console.log(JSON.stringify(items))
            let cursor: any;
            try {
                cursor = items.find(query);
                console.log(`cursor: ${JSON.stringify(cursor)}`)
            } catch (e) {
                console.error(`Unable to issue find command, ${e}`);
                return { itemsList: {}, totalItemsList: 0 };
            }
            const displayCursor = cursor
                .limit(itemsPerPage)
                .skip(itemsPerPage * page);
            try {

                let itemsList = await displayCursor.toArray();

                let totalItemsList = await items.countDocuments(query);

                let response = { itemsList, totalItemsList }
                return response;
            } catch (e) {
                console.log(
                    `Unable to convert cursor to array or problem counting documents, ${e}`,
                );
                return { itemsList: {}, totalItemsList: 0 };
            }


        } catch (err) {
            console.error(`Error handling request: ${err}`)
        }

    }

    static async getItemByID(
        idItem = "",
    ): Promise<any> {

        let query = {
            idItem: "",
        }
        query.idItem = idItem
        let cursor: any;
        let itemsList: any;
        try {
            cursor = await items.find(query);
        } catch (e) {
            console.log(`Error handling: ${e}`)

        }
        const displayCursor = cursor
            .limit(20)
            .skip(20 * 0);
        try {
            itemsList = await displayCursor.toArray();

        } catch (e) {
            console.log(`Error handling: ${e}`)
        }

        let response = itemsList[0];
        return response;

    }



    static async insertItem({
        itemName = "",
        cost = 0,
        image = "",
        storeName = "",
        idItem = "",
        link = "",
        popularity = 0,
    } = {}): Promise<{
        error: string
    } | JSON
    > {
        let item: any;
        let cursor: any;

        item = {
            itemName,
            cost,
            idItem,
            image,
            link,
            storeName,
            popularity,
        };

        try {
            cursor = await items.insertOne(item);

        } catch (e: any) {
            return Promise.reject({
                error: `Unable to insert order, ${e}`,
            });
        }
        return Promise.resolve(cursor);
    }

    static async insertItems(objectFromResponse: [{}]): Promise<{} | { error: string }> {
        let cursor: {};

        try {
            cursor = await items.insertMany(objectFromResponse);

        } catch (e) {
            return Promise.reject({
                error: `Unable to insert order, ${e}`,
            });
        }
        return Promise.resolve(cursor);
    }


    static async incrementOne(itemName: string) {
        var ObjectId = require('mongodb').ObjectId;
        let item = await this.getItemByID(itemName);

        if (await item[0].popularity === undefined) {
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
    }

    static async getItemByPopularity() {
        try {
            return await items.find().sort({ "popularity": -1 }).limit(5).toArray()
        } catch (e) {
            console.log(`errore: ${e}`);
            return [];
        }

    }


}