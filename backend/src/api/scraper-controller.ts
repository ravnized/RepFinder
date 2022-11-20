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

    static async converFileToItems(filename: string, req: any, res: any, next: any) {
        let responseTotalDebug = "";
        let responseTotal: any[] = [];
        let indexAddedItems = 0
        const $ = cheerio.load(fs.readFileSync(`./cache/${filename}.txt`));
        $('.album3__main').each((index: number, item: any) => {
            let title = $(item).attr("title");
            //console.log(title);
            var regex = new RegExp("\\d{1,}");
            let array = regex.exec(title)
            if (array == null) {
                return;
            }
            //console.log(`Cost of the item: ${array![0]} yuan`);
            let prezzoRegex = new RegExp("[^￥🔥](?<!\\d)(?<!\\s)\\D+", 'gi');
            let titleFinal = prezzoRegex.exec(title)
            if (titleFinal == null) {
                return;
            }
            let arrayPhoto: any[] = [];
            let albumImgWrap = $(item).find('.album3__squareWrap img').each((index: number, item: any) => {
                let photo = $(item);
                let linkPhoto = photo.attr("data-origin-src");
                linkPhoto = "https:" + linkPhoto;
                let photoTitle = photo.attr("title");
                arrayPhoto[index] = linkPhoto;
                //console.log(linkPhoto);
            })

            let response = {
                itemName: titleFinal![0],
                cost: Number(array![0]),
                images: arrayPhoto,
                storeName: filename,
            }
            responseTotal[indexAddedItems] = response;
            indexAddedItems++;
            responseTotalDebug += `Inserting ${response.itemName}, cost: ${response.cost}, images: ${arrayPhoto.toString()} storeName: ${filename} \n`;
        })
        fs.writeFileSync(`log-${filename}.txt`, responseTotalDebug)

        this.apiInsertItems(req, res, next, responseTotal)

    }



    static async apiGetItem(req: any, res: any, next: any) {
        const itemsPerPage = req.query.itemsPerPage
            ? parseInt(req.query.itemsPerPage, 10)
            : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters: any = {};

        if (req.body.cost) {
            filters.cost = req.body.cost;
        }

        if (req.body.itemName) {
            filters.itemName = req.body.itemName;
        }
        if (req.body.storeName) {
            filters.storeName = req.body.storeName;
        }

        console.error(`request body: ${JSON.stringify(req.body)}`);
        console.error(filters);

        let responseGetItems = await ScraperDao.getItems({
            filters,
            page,
            itemsPerPage,
        });

        let response = {
            items: responseGetItems.itemsList,
            page: page,
            filters: filters,
            entries_per_page: itemsPerPage,
            total_results: responseGetItems.totalItemsLIst,
        };
        res.json(response);
    }

    static async apiInsertItem(req: any, res: any, next: any) {
        let itemName = "",
            cost = 0,
            images: any,
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
        images = query.images;
        storeName = query.storeName;
        try {
            insertItemResponse = await ScraperDao.insertItem({
                itemName: itemName,
                cost: cost,
                images: images,
                storeName: storeName,
            });
        } catch (e) {
            console.error(`Problem in inserting order ${e}`);
        }

        res.json(insertItemResponse);
    }

    static async apiInsertItems(req: any, res: any, next: any, objectRetrived: Array<Object>) {

        let insertItemsResponse: any;
        try {
            insertItemsResponse = await ScraperDao.insertItems(objectRetrived);
        } catch (e) {
            console.error(`Problem in inserting order ${e}`);
        }
        res.json(insertItemsResponse);
    }

}