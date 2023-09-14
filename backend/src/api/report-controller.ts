import ReportDao from "../dao/reportDao";

export default class ReportController {
    static async reportSubmit(req: any) {
        let report = {
            itemName: req.body.itemName,
            cost: req.body.cost,
            idItem: req.body.idItem,
            needTodelete: req.body.needToDelete
        }


        await ReportDao.insertReport(report).catch((error: any) => {
            return Promise.reject(error);
        })

        return Promise.resolve({
            message: "Report submitted"
        })
    }

    static async getReports(req: any): Promise<{}> {

        let reports: {
            reportList: [{
                _id: string,
                itemName: string,
                cost: number,
                idItem: string,
                needTodelete: boolean,
            }], totalReportList: number
        } = {
            reportList: [{
                _id: "",
                itemName: "",
                cost: 0,
                idItem: "",
                needTodelete: false,
            }], totalReportList: 0
        }

        const reportsPerPage = req.reportsPerPage
            ? parseInt(req.reportsPerPage, 10)
            : 20;
        const page = req.page ? parseInt(req.page, 10) : 0;
        let filters: any = {};
        let sortBy: {} = {};
        if (req.itemName) {
            filters.itemName = req.itemName;
        }
        if (req.cost) {
            filters.cost = Number(req.cost);
        }
        if (req.needTodelete) {
            filters.needTodelete = req.needTodelete;
        }



        await ReportDao.getReports({
            filters,
            page,
            reportsPerPage,
            sortBy,
        }).then((response) => {
            reports = response;
        }).catch((error) => {
            return Promise.reject(error);
        })

        return Promise.resolve(reports

        )


    }

    static async deleteReport(req: any) {
        let id = req.body.id
        await ReportDao.deleteReport(id).catch((error) => {
            return Promise.reject(error);
        })

        return Promise.resolve({
            message: "Report deleted"
        })
    }

    static async deleteAllReports() {
        await ReportDao.deleteAllReports().catch((error) => {
            return Promise.reject(error);
        })

        return Promise.resolve({
            message: "Reports deleted"
        })
    }


}