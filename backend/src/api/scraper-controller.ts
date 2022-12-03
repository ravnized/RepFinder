const fs = require("fs")
const cheerio = require("cheerio")
import ScraperDao from "../dao/scraperDao";
import puppeteer from 'puppeteer';
import axios from "axios";
import * as http from 'http';
import async from "async"
const Agent = require("agentkeepalive");
export default class ScraperController {

    static currentPage = 1;
    static urlMod = "";

    static async scraperMain(url: string, filename: string, res: any) {
        let finalFile = "";

        try {

            const browser = await puppeteer.launch();
            try {
                this.spawnerPage(url, filename, browser, finalFile, res)
            } catch (e) {
                console.log(`error ${e}`)
            }
            // Don't forget to close your browser to release resources
        } catch (e) {
            res.JSON({
                error: e,
                status: "failed"
            })
            console.log(`error: ${e}`);
        }

    }

    static async spawnerPage(url: string, filename: string, browser: any, finalFile: any, res: any) {

        let page;
        let htmlPage;
        try {
            page = await browser.newPage();
            await page.goto(url);
            htmlPage = await page.content();
            await page.close();
            let $ = cheerio.load(htmlPage);
            let pagination__active_next = $('.pagination__active').next();
            let pageMax = $('input[name=page]').attr('max');

            console.log(pagination__active_next.text())
            if (ScraperController.currentPage <= pageMax) {
                $('.showindex__children').each((index: number, item: any) => {

                    finalFile += $(item).html();
                })

                console.log(url)
                if (ScraperController.currentPage <= 9) {
                    ScraperController.urlMod = url.slice(0, url.length - 1)
                } else {
                    ScraperController.urlMod = url.slice(0, url.length - 2)
                }
                ScraperController.currentPage++;
                console.log(ScraperController.urlMod + ScraperController.currentPage)
                this.spawnerPage(ScraperController.urlMod + ScraperController.currentPage, filename, browser, finalFile, res);
            } else {
                fs.writeFile(`./cache/${filename}.txt`, `${finalFile}`, (error: any) => {
                    console.log(error)
                });
                await browser.close();
                ScraperController.currentPage = 1;
                ScraperController.urlMod = "";
                return res.json({
                    filename: filename,
                    success: "true",
                })
            }
        } catch (e) {
            try {
                this.spawnerPage(ScraperController.urlMod + ScraperController.currentPage, filename, browser, finalFile, res);
            } catch (e) {
                res.json({
                    error: e,
                    status: "failed"
                })
            }
            console.log(`Error ${e}`)
        }


    }

    static async converFileToItems(filename: string, url: string, req: any, res: any, next: any) {

        let responseTotalDebug = "";
        let responseTotal: any[] = [];
        let indexAddedItems = 0;
        const $ = cheerio.load(fs.readFileSync(`./cache/${filename}.txt`));
        var regexAlbum = new RegExp(`album.{1,}main`)
        let arrayAlbum = regexAlbum.exec(fs.readFileSync(`./cache/${filename}.txt`));

        $(`.${arrayAlbum![0]}`).each(async (index: number, item: any) => {
            let finished = false;
            let title = $(item).attr("title");

            let link = $(item).attr("href");
            link = url + link;

            var regex = new RegExp("\\d{1,}");
            let array = regex.exec(title)
            if (array == null) {
                return;
            }

            let prezzoRegex = new RegExp("[^￥🔥](?<!\\d)(?<!\\s)\\D+", 'gi');
            let titleFinal = prezzoRegex.exec(title)
            if (titleFinal == null) {
                return;
            }
            let arrayPhoto: any[] = [];
            let regexPhoto = new RegExp(`album.{1,}wrap`)
            let arrayAlbumPhoto = regexPhoto.exec(fs.readFileSync(`./cache/${filename}.txt`))
            let linkPhoto = "";
            let image;


            let photo = $(item).find(`.${arrayAlbumPhoto![0]} img`);
            linkPhoto = photo.attr("data-origin-src");
            if (linkPhoto == undefined || linkPhoto == "" || linkPhoto.slice(0, 4) == "data") {
                linkPhoto = photo.attr("src");

                if (linkPhoto == undefined || linkPhoto == "" || linkPhoto.slice(0, 4) == "data") {
                    linkPhoto = photo.attr("data-src");

                }
            }
            if (linkPhoto.slice(0, 4) !== "data") {
                linkPhoto = "https:" + linkPhoto;

                console.log(linkPhoto)
            }

            let response = {
                itemName: titleFinal![0],
                cost: Number(array![0]),
                images: linkPhoto,
                storeName: filename,
                link: link
            }
            responseTotal[indexAddedItems] = response;
            indexAddedItems++;
            responseTotalDebug += `Inserting ${response.itemName}, cost: ${response.cost}, images: ${response.images} storeName: ${filename} \n`;
        })
        fs.writeFileSync(`log-${filename}.txt`, responseTotalDebug)

        this.apiInsertItems(req, res, next, responseTotal)

    }


    static async getPhoto(item: any, axiosInstance: any) {

    }
    static async apiGetItem(req: any, res: any, next: any) {
        const HttpsAgent = require("agentkeepalive").HttpsAgent;
        const itemsPerPage = req.query.itemsPerPage
            ? parseInt(req.query.itemsPerPage, 10)
            : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;
        interface objectResponse {
            _id: string,
            itemName: string,
            cost: Number,
            images: string,
            storeName: string,
            link: string
        }


        let filters: any = {};

        if (req.query.cost) {
            filters.cost = req.query.cost;
            filters.cost[0] = Number(filters.cost[0])
        }

        if (req.query.itemName) {
            filters.itemName = req.query.itemName;
        }
        if (req.query.storeName) {
            filters.storeName = req.query.storeName;
        }
        if (req.query.$text) {
            filters.$text = req.query.$text;
        }




        console.error(`request body: ${JSON.stringify(req.body)} `);
        console.error(filters);




        let responseGetItems = await ScraperDao.getItems({
            filters,
            page,
            itemsPerPage,
        })

        const keepAliveAgent = new Agent({
            keepAlive: true,
            maxSockets: 128, // or 128 / os.cpus().length if running node across multiple CPUs
            maxFreeSockets: 128, // or 128 / os.cpus().length if running node across multiple CPUs
            timeout: 60000, // active socket keepalive for 60 seconds
            freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
        });
        const httpsKeepAliveAgent = new HttpsAgent({
            keepAlive: true,
            maxSockets: 128, // or 128 / os.cpus().length if running node across multiple CPUs
            maxFreeSockets: 128, // or 128 / os.cpus().length if running node across multiple CPUs
            timeout: 60000, // active socket keepalive for 30 seconds
            freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
        });


        let instance = axios.create({
            httpAgent: keepAliveAgent,
            httpsAgent: httpsKeepAliveAgent,

        })

        let indexLast: number = 0;
        responseGetItems.itemsList.map((item: any, index: any) => {
            if (item.images.slice(0, 4) == "data") {
                item.imageBuffer = item.images;
                responseGetItems.itemsList[index] = item;
                indexLast++;
            } else {
                instance.get(item.images, {
                    responseType: 'arraybuffer',
                    headers: {
                        "Referer": item.link
                    }
                }).then((response: any) => {
                    let buffered = Buffer.from(response.data, 'binary').toString("base64");
                    item.imageBuffer = buffered;
                    responseGetItems.itemsList[index] = item;
                    console.log(indexLast)
                    indexLast++;
                    console.log(item.itemName);




                })
            }





        })

        if (indexLast == itemsPerPage - 1) {
            let response = {
                items: responseGetItems.itemsList,
                page: page,
                filters: filters,
                entries_per_page: itemsPerPage,
                total_results: responseGetItems.totalItemsLIst,
            };
            res.json(response)

        }
    }








    /*
    
   
    */

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
            res.JSON({
                error: e,
                status: "failed"
            })
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
            res.JSON({
                error: e,
                status: "failed"
            })
            console.error(`Problem in inserting order ${e}`);
        }

        res.json(insertItemResponse);
    }

    static async apiInsertItems(req: any, res: any, next: any, objectRetrived: Array<Object>) {

        let insertItemsResponse: any;
        try {
            insertItemsResponse = await ScraperDao.insertItems(objectRetrived);
        } catch (e) {
            res.json({
                error: e,
                status: "failed"
            })
            console.error(`Problem in inserting order ${e}`);
        }
        res.json(insertItemsResponse);
    }

}