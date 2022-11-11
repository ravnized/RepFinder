import axios from "axios";
const fs = require("fs")
const cheerio = require("cheerio")
import mongoose, { mongo } from "mongoose";
import ScraperDao from "../dao/scraperDao";

var OrderSchema = new mongoose.Schema({
    itemName: mongoose.Schema.Types.String,
    cost: mongoose.Schema.Types.Number,
    image: mongoose.Schema.Types.String,
    storeName: mongoose.Schema.Types.String,
});




export default class ScraperController {
    static finalFile = "";
    static currentPage = 1;
    static urlMod = "";
    getResponseData(url: string, filename: string) {
        axios.interceptors.request.use(request => {
            console.log('Starting Request', JSON.stringify(request, null, 2))
            return request
        })
        return axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
            }
        }).then((response) => {
            console.log("got response")

            let $ = cheerio.load(response.data);
            let pagination__active_next = $('.pagination__active').next();
            let pageMax = $('input[name=page]').attr('max');

            console.log(pagination__active_next.text())
            if (ScraperController.currentPage <= pageMax) {
                ScraperController.finalFile += $('main').html();
                console.log(url)
                if (ScraperController.currentPage <= 9) {
                    ScraperController.urlMod = url.slice(0, url.length - 1)
                } else {
                    ScraperController.urlMod = url.slice(0, url.length - 2)
                }

                console.log(ScraperController.urlMod)
                delete response.data;
                ScraperController.currentPage++;
                this.getResponseData(ScraperController.urlMod + ScraperController.currentPage, filename);
            } else {
                fs.writeFile(`./cache/${filename}.txt`, `${ScraperController.finalFile}`, (error: any) => {
                    console.log(error)
                });
            }

        }).catch((err) => {
            console.log(err)
            this.getResponseData(ScraperController.urlMod + ScraperController.currentPage, filename)
        })

    }

    static async converFileToItems(filename: string) {
        const $ = cheerio.load(fs.readFileSync(filename));

        $('.album3__title').each((index: number, item: any) => {
            console.log(`index: ${index}`);
            console.log(`item: ${item.text()}`);
        })
    }



    static async apiGetItem(req: any, res: any, next: any) {
        const ordersPerPage = req.query.ordersPerPage
            ? parseInt(req.query.ordersPerPage, 10)
            : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters: any = {};

        if (req.query.cost) {
            filters.cost = parseFloat(req.query.cost);
        }

        if (req.query.itemName) {
            filters.itemName = req.query.itemName;
        }
        if (req.query.storeName) {
            filters.storeName = req.query.storeName;
        }

        console.error(req.query);
        console.error(filters);

        const { itemList, totalItemList } = await ScraperDao.getItems({
            filters,
            page,
            ordersPerPage,
        });

        let response = {
            orders: itemList,
            page: page,
            filters: filters,
            entries_per_page: ordersPerPage,
            total_results: totalItemList,
        };
        res.json(response);
    }

    static async apiInsertItem(req: any, res: any, next: any) {
        let itemName = "",
            cost = 0,
            image = "",
            storeName = "";
        let insertItemResponse: any;
        let query: any = null;
        try {
            query = req.body;
        } catch (e) {
            console.error(`Can't retrive request.body ${e}`);
        }

        itemName = query.itemName;
        cost = query.cost;
        image = query.image;
        storeName = query.storeName;
        try {
            insertItemResponse = await ScraperDao.insertItem({
                itemName: itemName,
                cost: cost,
                image: image,
                storeName: storeName,
            });
        } catch (e) {
            console.error(`Problem in inserting order ${e}`);
        }

        res.json(insertItemResponse);
    }



}