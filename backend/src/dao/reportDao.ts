interface filtersArray {
    [key: string]: string | number;
}
let reports: any;
export default class ReportDao {


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
            reports = await conn.db("Main").collection("Reports")
            await conn.db("Main").collection("Reports").createIndex({
                idItem: "text"
            });

        } catch (e) {
            return Promise.reject(e)
        }
        return Promise.resolve({
            message: "Connection to DB established"
        })
    }

    /**
     * 
     * @param objectToInsert array of objects to insert in database
     * @returns Promise with the result of the insertion
     * @description Function for inserting one report in the database
     */
    static async insertReport({
        itemName = "",
        cost = 0,
        idItem = "",
        needTodelete = false,
    }): Promise<
        {}
    > {

        let cursor: any;

        let report = {
            itemName,
            cost,
            idItem,
            needTodelete
        };


        cursor = await reports.insertOne(report).catch((e: any) => {
            return Promise.reject({
                error: `Unable to insert item, ${e}`,
            });
        });


        return Promise.resolve(cursor);
    }

    static async getReports({
        filters = {} as filtersArray,
        page = 0,
        reportsPerPage = 10,
        sortBy = {},
    }): Promise<{
        reportList: [{
            _id: string,
            itemName: string,
            cost: number,
            idItem: string,
            needTodelete: boolean,
        }],
        totalReportList: number;
    }> {
        let itemName = "",
            cost: any = [],
            storeName = "",
            $text;
        let query: any = {
            itemName,
            cost,
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
                query[querySingle] = object;
            } else {
                delete query[querySingle];
            }
        }
        let cursor: any;
        try {
            cursor = await reports.find(query).sort(sortBy)
        } catch (e: any) {
            return Promise.reject({
                error: `Error in finding items: ${e}`
            })
        }
        const displayCursor = cursor
            .limit(reportsPerPage)
            .skip(reportsPerPage * page);


        let reportList = await displayCursor.toArray()
        let totalReportList = 0;
        try {
            totalReportList = await reports.countDocuments(query);
        } catch (e: any) {
            return Promise.reject({
                error: `Error in counting items: ${e}`
            })
        }


        return Promise.resolve({
            reportList,
            totalReportList,
        });
    }

    static async deleteReport(
        id: string,
    ): Promise<
        {}> {
        let ObjectID = require('mongodb').ObjectID;
        let objId = new ObjectID(id);
        
        let cursor: any;
        let query: any = {
            "_id": objId
        }
        
        try {
            cursor = await reports.deleteOne(query)
        } catch (e: any) {
            return Promise.reject({
                error: `Error in deleting report: ${e}`
            })
        }
        return Promise.resolve(cursor);
    }

    static async deleteAllReports(): Promise<
        {}> {
        let cursor: any;
        try {
            cursor = await reports.deleteMany({})
        } catch (e: any) {
            return Promise.reject({
                error: `Error in deleting reports: ${e}`
            })
        }
        return Promise.resolve(cursor);
    }


}