
let items: any;
interface filtersArray {
    [key: string]: string | number;
}
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
        ordersPerPage = 10,
    } = {}): Promise<any> {
        let itemName = "",
            cost = 0,
            image = "",
            storeName = "";

        try {
            let query: any = {
                itemName,
                cost,
                image,
                storeName,
            }

            for (let querySingle in query) {
                query[querySingle] = { $eq: filters[querySingle] };
                if (filters[querySingle] == undefined) {
                    delete query[querySingle];
                }
            }
            console.error(query);

            let cursor: any;
            try {
                cursor = await items.find(query);
            } catch (e) {
                console.error(`Unable to issue find command, ${e}`);
                return { itemsList: 0, totalItemsList: 0 };
            }
            const displayCursor = cursor
                .limit(ordersPerPage)
                .skip(ordersPerPage * page);
            try {
                const itemsList = await displayCursor.toArray();

                const totalItemsList = await items.countDocuments(query);
                return { itemsList, totalItemsList };
            } catch (e) {
                console.log(
                    `Unable to convert cursor to array or problem counting documents, ${e}`,
                );
                return { ordersList: [], totalOrderList: 0 };
            }


        } catch (err) {
            console.error(`Error handling request: ${err}`)
        }

    }
    static async insertItem({
        itemName = "",
        cost = 0,
        image = "",
        storeName = ""
    } = {}): Promise<any> {
        let item: any;
        let cursor: any;

        item = {
            itemName,
            cost,
            image,
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



}