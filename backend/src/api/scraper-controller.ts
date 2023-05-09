const fs = require("fs")
const cheerio = require("cheerio")
import ScraperDao from "../dao/scraperDao";
import puppeteer from 'puppeteer';
import axios from "axios";
const Agent = require("agentkeepalive");
import UserAgent from 'user-agents';
export default class ScraperController {

    static currentPage = 1;
    static urlMod = "";

    static async scraperMulti(arrayInfo: [{ scraper: string, filename: string }], res: any) {
        Promise.all(arrayInfo.map(async (data: { scraper: string, filename: string }) => {
            return await this.scraperMain(data.scraper, data.filename)
        })).then((data: any) => {
            return res.status(200).json({
                data: data
            })
        })
            .catch((err: any) => {
                return res.status(500).json({
                    error: err
                });
            });
    }



    static async scraperMain(url: string, filename: string): Promise<{ message: string }> {
        let pageMax: number;
        pageMax = 0;
        let count = 0;
        let browser = await puppeteer.launch({
            headless: false
        });

        pageMax = await this.getPageMax(url, browser);
        //generate an array with all the urls to scrape
        let urls: string[] = [];
        //https://chaosmade.x.yupoo.com/albums
        for (let i = 1; i <= pageMax; i++) {
            urls.push(`${url}?page=${i}`);
        }
        let promises = [];


        do {
            promises = urls.splice(0, 20);

            console.log(promises);
            // 20 at a time
            await Promise.all(promises.map(async (url: string, index: number) => {
                await this.convertPage(url, browser)
                    .then(async (data: any) => {
                        console.log(`creating file ${filename} ${index + 1 + (count * 20)}`)
                        await this.createFile(filename, index + 1 + (count * 20), data.message)
                    })
                    .catch((err: any) => {
                        return Promise.reject({
                            message: `${err}`,
                        });
                    })
            }))
            count++;

        } while (urls.length)
        await browser.close();
        return Promise.resolve({
            message: `Finito ${filename}`
        })






    }

    static async createFile(dirName: string, filename: number, content: string): Promise<{ message: string }> {
        try {
            if (!fs.existsSync(`./cache`)) {
                fs.mkdirSync(`./cache`);
            }

            if (!fs.existsSync(`./cache/${dirName}`)) {
                fs.mkdirSync(`./cache/${dirName}`);
            }
            fs.writeFileSync(`./cache/${dirName}/${filename}`, `${content}`);
            return Promise.resolve({
                message: "File created"
            })
        } catch (e) {
            console.log(e);
            return Promise.reject({
                message: `${e}`,
            })
        }
    }

    static async convertPage(url: string, browser: any): Promise<{ message: string }> {

        const userAgent = new UserAgent({ deviceCategory: 'mobile' });
        let page;
        let htmlPage;
        let finalFile = "";
        let $ = cheerio.load("");
        try {
            console.log(`visiting: ${url} with user agent: ${userAgent.toString()}`);
            page = await browser.newPage();
            await page.setUserAgent(userAgent.toString());
            await page.setDefaultNavigationTimeout(0);
            await page.goto(url);
            htmlPage = await page.content();
            await page.close();
            $ = cheerio.load(htmlPage);
            $('.showindex__children').each((index: number, item: any) => {
                finalFile += $(item).html();
            })

        } catch (e) {
            console.log(e);
            return Promise.reject({
                message: `${e}`,
            })
        }
        console.log(`visited: ${url}`);
        return Promise.resolve({
            message: finalFile,
        })

    }

    static async getPageMax(url: string, browser: any) {
        const userAgent = new UserAgent({ deviceCategory: 'mobile' });
        let page;
        let htmlPage;
        try {

            page = await browser.newPage();
            await page.setUserAgent(userAgent.toString());
            await page.goto(url);
            htmlPage = await page.content();
            await page.close();
            let $ = cheerio.load(htmlPage);
            let pageMax = $('input[name=page]').attr('max');
            return pageMax;
        } catch (e) {
            console.log(e);

        }
    }

    static async getResponseFromItem($: any, item: any, directory: string, fileRead: string, file: string): Promise<{
        itemName: String,
        cost: Number,
        image: String,
        storeName: String,
        link: String,
    } | { error: String }> {
        let regexTitle = new RegExp("\\d{1,}");
        let prezzoRegex = new RegExp("[^￥🔥](?<!\\d)(?<!\\s)\\D+", 'gi');
        let regexPhoto = new RegExp(`album.{1,}wrap`);
        //console.log all the params
        let title = $(item).attr("title");
        let link = $(item).attr("href");
        link = `https://${directory}.x.yupoo.com${link}`;
        let arrayCost = regexTitle.exec(title)
        if (arrayCost == null) {
            return Promise.reject({
                error: `link: ${link} file: ${file}`
            });
        }
        let titleFinal = prezzoRegex.exec(title)
        if (titleFinal == null) {
            return Promise.reject({
                error: `item: ${titleFinal} cost: ${arrayCost} link: ${link} file: ${file}`
            });
        }
        let arrayAlbumPhoto = regexPhoto.exec(fileRead);
        let photo = $(item).find(`.${arrayAlbumPhoto![0]} img`);

        let linkPhoto = "";

        console.log(`item: ${titleFinal} cost: ${arrayCost} link: ${link} photo: ${photo}`);

        linkPhoto = photo.attr("data-origin-src");
        if (linkPhoto == undefined || linkPhoto == "" || linkPhoto.slice(0, 4) == "data") {
            linkPhoto = photo.attr("src");

            if (linkPhoto == undefined || linkPhoto == "" || linkPhoto.slice(0, 4) == "data") {
                linkPhoto = photo.attr("data-src");

            }
        }
        if (linkPhoto.slice(0, 4) !== "data") {
            linkPhoto = "https:" + linkPhoto;
        }
        let response = {
            itemName: titleFinal![0],
            cost: Number.parseInt(arrayCost![0]),
            image: linkPhoto,
            storeName: directory,
            link: link,
        }
        return Promise.resolve(response);
    }


    static async converterFilesToItems(): Promise<{
        itemName: String,
        cost: Number,
        image: String,
        storeName: String,
        link: String,
    }[] | { error: String }> {
        let arrayDir = fs.readdirSync(`./cache`);


        let arrayAlbumRegex = new RegExp(`album.{1,}main`);
        let arrayItemRegex = new RegExp(`item.{1,}main`);
        let arrayData = [{
            itemName: "", cost: 0, image: "", storeName: "", link: ""
        }]; try {
            arrayDir.forEach(async (directory: string) => {
                let arrayFile = fs.readdirSync(`./cache/${directory}`);
                arrayFile.forEach(async (file: string) => {
                    let fileRead = fs.readFileSync(`./cache/${directory}/${file}`)
                    const $ = cheerio.load(fileRead);
                    let arrayAlbum = arrayAlbumRegex.exec(fileRead);
                    let arrayItem = arrayItemRegex.exec(fileRead);

                    Promise.all($(`.${arrayAlbum![0]}`).map(async (index: number, item: any) => {

                        await this.getResponseFromItem($, item, directory, fileRead, file).then((response: any) => {
                            arrayData.push(response);
                        }).catch((e: any) => {
                            console.log(e);
                        })
                    }))
                })
            })
        } catch (e) {
            return Promise.reject({
                error: `${e}`,
            });
        }
        return Promise.resolve(arrayData);
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


            let array = RegExp("").exec(title)
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

    static async apiGetImage(responseGetItems: any, itemsPerPage: number, page: number, filters: {}, total_items: number, res: any) {

        const HttpsAgent = require("agentkeepalive").HttpsAgent;
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

        try {
            responseGetItems.map((item: any, index: any) => {

                if (item.images.slice(0, 4) == "data") {
                    item.imageBuffer = item.images;
                    item.images = "";
                    responseGetItems[index] = item;
                    indexLast++;

                    if (indexLast == itemsPerPage) {
                        res.json({
                            code: 200,
                            items: responseGetItems,
                            page: page,
                            filters: filters,
                            entries_per_page: itemsPerPage,
                            total_items: total_items,
                        })
                    }
                } else {
                    instance.get(item.images, {
                        responseType: 'arraybuffer',
                        headers: {
                            "Referer": item.link
                        }
                    }).then((response: any) => {
                        let buffered = Buffer.from(response.data, 'binary').toString("base64");
                        item.imageBuffer = buffered;
                        item.images = "";
                        responseGetItems[index] = item;

                        indexLast++;

                        if (indexLast == itemsPerPage) {
                            res.json({
                                code: 200,
                                items: responseGetItems,
                                page: page,
                                filters: filters,
                                entries_per_page: itemsPerPage,

                            })
                        }
                    })
                }


            })
        } catch (e) {
            res.json({
                error: e,
                status: "failed"
            })

        }

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

    static async apiGetItemById(res: any, itemName: string) {
        console.log(`itemName: ${itemName}`)
        let objectId: any;
        try {
            objectId = await ScraperDao.getItemByID(itemName);
        } catch (e) {
            res.json({
                error: e,
                status: "failed"
            })
            console.error(`Problem in inserting order ${e}`);
        }
        res.json(objectId);
    }

    static async apiPopularity(res: any, itemName: string) {
        let response: any;
        try {
            response = await ScraperDao.incrementOne(itemName);

        } catch (e) {
            res.json({
                error: e,
                status: "failed"
            })
            console.error(`Problem in inserting popularity ${e}`);
        }
        res.json(response)
    }

    static async apiGetPopularity(req: any, res: any) {
        let responseGetItems = await ScraperDao.getItemByPopularity();
        console.log(this)
        return await this.apiGetImage(responseGetItems, 5, 0, {}, 5, res);
    }
    static async apiGetItem(req: any, res: any) {

        const itemsPerPage = req.query.itemsPerPage
            ? parseInt(req.query.itemsPerPage, 10)
            : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

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
        if (responseGetItems.itemsList.length == 0) {
            res.json({
                code: 200,
                items: []
            })
        }
        return await this.apiGetImage(responseGetItems.itemsList, itemsPerPage, page, filters, responseGetItems.totalItemsList, res)
    }

}