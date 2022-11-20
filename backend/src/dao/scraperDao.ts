
let items: any;
interface filtersArray {
    [key: string]: string | number;
}
import mongoose from "mongoose";
export default class ScraperDao {


    static async connDB(conn: any) {
        if (items) return;
        try {
            items = await conn.db("Main").collection("Items");
            console.log(`Items collection initialized`);
        } catch (e) {
            console.error(`unable to enstablish a collection handle ${e}`);
        }
    }

    static async getItems({
        filters = {} as filtersArray,
        page = 0,
        itemsPerPage = 10,
    } = {}): Promise<any> {
        let itemName = "",
            cost = 0,
            images: any = [],
            storeName = "";

        try {
            let query: any = {
                itemName,
                cost,
                images,
                storeName,
            }

            for (let querySingle in query) {
                query[querySingle] = { $eq: filters[querySingle] };
                if (filters[querySingle] == undefined) {
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
                return { itemsList: [], totalItemsList: 0 };
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
                return { itemsList: [], totalItemsList: 0 };
            }


        } catch (err) {
            console.error(`Error handling request: ${err}`)
        }

    }
    static async insertItem({
        itemName = "",
        cost = 0,
        images = [],
        storeName = ""
    } = {}): Promise<any> {
        let item: any;
        let cursor: any;

        item = {
            itemName,
            cost,
            images,
            storeName
        };

        try {
            console.log(item);
            cursor = items.insertOne(item);
            return cursor;
        } catch (e) {
            console.log(`Unable to insert order, ${e}`);
            return (item = {});
        }
    }

    static async insertItems(objectFromResponse: any): Promise<any> {
        let cursor: any;
        try {
            cursor = items.insertMany(objectFromResponse);
            return cursor;
        } catch (e) {
            console.log(`Unable to insert order, ${e}`);
            return (objectFromResponse = [{}]);
        }
    }



}