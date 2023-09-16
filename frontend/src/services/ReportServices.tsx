class ReportServices {
    static async getAll(token: string) {
        let baseUrl = "http://localhost:5001/api/v1/privileged-reports/";
        let req = await fetch(baseUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "User-agent": "RepFinder-Frontend/1.0.0",
                "token": token
            }
        }).catch((error) => {
            return Promise.reject([error]);
        })

        return await req.json();

    }

    static async reportItem(idItem: string, cost: number, itemName: string, needToBeDeleted: boolean) {
        let baseUrl = "http://localhost:5001/api/v1/reports/insert";
        let req = await fetch(baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-agent": "RepFinder-Frontend/1.0.0",
            },
            body: JSON.stringify({
                idItem: idItem,
                cost: cost,
                itemName: itemName,
                needToDelete: needToBeDeleted
            })
        }).catch((error) => {
            return Promise.reject([error]);
        })

        return await req.json();
    }
}

export default ReportServices;