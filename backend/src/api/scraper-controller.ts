const fs = require("fs")
const cheerio = require("cheerio")
import ScraperDao from "../dao/scraperDao";
import puppeteer from 'puppeteer';
import axios from "axios";
const Agent = require("agentkeepalive");
import UserAgent from 'user-agents';
import { response } from "express";
export default class ScraperController {

    static currentPage = 1;
    static urlMod = "";

    static async scraperMulti(arrayInfo: [{ url: string, filename: string }], res: any) {
        Promise.all(arrayInfo.map(async (data: { url: string, filename: string }) => {
            return await this.scraperMain(data.url, data.filename)
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
            headless: true
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
            if (!fs.existsSync(`./cache/stores`)) {
                fs.mkdirSync(`./cache/stores`);
            }

            if (!fs.existsSync(`./cache/stores/${dirName}`)) {
                fs.mkdirSync(`./cache/stores/${dirName}`);
            }
            fs.writeFileSync(`./cache/stores/${dirName}/${filename}`, `${content}`);
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
            await page.goto(url, {
                'timeout': 0,
            });
            htmlPage = await page.content();
            await page.close();
            $ = cheerio.load(htmlPage);
            if (htmlPage.includes("404 Not Found")) {
                return Promise.reject({
                    message: `404 Not Found`,
                })
            }
            if (htmlPage == "") {
                return Promise.reject({
                    message: `Empty page`,
                })
            }
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

    static async getResponseFromItem(directory: string): Promise<{
        itemName: string,
        cost: number,
        image: string,
        storeName: string,
        link: string,
    }[] | { error: string }> {
        let responseArray: [{
            itemName: string,
            idItem: string,
            cost: number,
            image: string,
            storeName: string,
            link: string,
        }] = [{
            itemName: "",
            idItem: "",
            cost: 0,
            image: "",
            storeName: "",
            link: "",
        }]

        try {
            let arrayAlbumRegex = new RegExp(`album.{1,}main"`);
            let arrayFile = fs.readdirSync(`./cache/stores/${directory}`);
            let regexPrice = new RegExp("\\d{1,}");
            let regexPhoto = new RegExp(`album.{1,}wrap`);
            let regexAlbumId = new RegExp('\\/albums\\/(\\d+)\\?uid', '');
            arrayFile.forEach((file: string) => {
                let fileRead = fs.readFileSync(`./cache/stores/${directory}/${file}`)
                const $ = cheerio.load(fileRead);
                let arrayAlbum = arrayAlbumRegex.exec(fileRead);
                let arrayAlbumSliced = arrayAlbum![0].slice(0, -1)

                $(`.${arrayAlbumSliced}`).each((index: number, item: any) => {
                    let title = $(item).attr("title");
                    if (title == "more") return;
                    let link = $(item).attr("href");
                    let idAlbum = regexAlbumId.exec(link);
                    link = `https://${directory}.x.yupoo.com${link}`;
                    let arrayCost: RegExpExecArray | string[] | null = regexPrice.exec(title);
                    arrayCost == null ? arrayCost = ["999"] : arrayCost[0] = arrayCost[0];
                    let titleFinal = title
                    let arrayAlbumPhoto = regexPhoto.exec(fileRead);
                    let photo = $(item).find(`.${arrayAlbumPhoto![0]} img`);

                    let linkPhoto = "";

                    Object.keys(photo[0].attribs).map(
                        (name: string) => {

                            if (name == "data" || name == "src" || name == "data-src") {

                                if (photo[0].attribs[name].replace(/\s/g, "") !== "") {
                                    linkPhoto = photo[0].attribs[name];
                                    if (linkPhoto.slice(0, 4) !== "data") linkPhoto = "https:" + linkPhoto;
                                }
                            }
                        }
                    )
                    /*
                    ((name: string) => {
                        if (name.includes("data") || name.includes("src")) {
                            console.log(name);
                        }
                    })
                    */
                    console.log(`item: ${titleFinal} cost: ${arrayCost} link: ${link} photo: ${linkPhoto} file: ${file}`);

                    let response = {
                        itemName: titleFinal,
                        cost: Number.parseInt(arrayCost![0]),
                        idItem: idAlbum![1],
                        image: linkPhoto,
                        storeName: directory,
                        link: link.replace(/\s/g, ""),
                    }
                    console.log(response);
                    responseArray.push(response);
                });

            });

        } catch (e) {
            console.log(e);
            return Promise.reject({
                error: `${e}`,
            })
        }
        responseArray.shift();
        return Promise.resolve(responseArray);
    }


    static async converterFilesToItems(): Promise<{
        message: String
    } | { error: String }> {
        let arrayDir = fs.readdirSync(`./cache/stores`);
        let arrayData = [{}];



        await Promise.all(arrayDir.map(async (directory: string) => {
            return await this.getResponseFromItem(directory).then((response) => {
                fs.writeFileSync(`./cache/${directory}.json`, JSON.stringify(response));
            }).catch((e) => {
                return Promise.reject({
                    error: `${e}`,
                })
            })
        })).catch((e) => {
            console.log(e);
            return Promise.reject({
                error: `${e}`,
            });
        })

        return Promise.resolve({
            message: "Converter completed",
        });
    }


    static async callerInsertItems(): Promise<{}> {
        let arrayDir = fs.readdirSync(`./cache/`);
        let array: [{}] = [{}];
        let response: any;
        await Promise.all(arrayDir.map(async (file: string) => {
            if (file.includes(".json")) {
                let fileRed = fs.readFileSync(`./cache/${file}`);
                array = JSON.parse(fileRed.toString());
                return await this.apiInsertItems(array).then((res: {}) => {
                    response = res;
                }).catch((e: any) => {
                    return Promise.reject(e);
                });

            }
        })).catch((e: any) => {
            return Promise.reject(
                e
            );
        })
        return Promise.resolve(response);
    }

    static async updateItems(filename: string): Promise<{ itemInseriti: string[], itemNonInseriti: string[] } | { error: string }> {
        let array: [] = [];
        let file = fs.readFileSync(`./cache/${filename}.json`);
        array = JSON.parse(file.toString());
        let itemsInseriti: string[] = [];
        let itemsNonInseriti: string[] = [];
        await Promise.all(
            array.map(async (item: any) => {
                await this.apiGetItemById(item.idItem).then(async (res) => {
                    if (res.item == undefined && res.error == "") {
                        await this.apiInsertItem(item).then(() => {
                            itemsInseriti.push(item.idItem);
                        }).catch((e: any) => {
                            return Promise.reject({
                                error: `${e}`,
                            })
                        })
                    } else {
                        itemsNonInseriti.push(item.idItem);
                    }
                }).catch((e: any) => {
                    return Promise.reject({
                        error: `${e}`,
                    })
                })
            })
        ).catch((e: any) => {
            Promise.reject({
                error: `${e}`,
            })
        })
        return Promise.resolve({
            itemInseriti: itemsInseriti,
            itemNonInseriti: itemsNonInseriti,
        })
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



    static async apiInsertItem(item: {
        itemName: string,
        idItem: string,
        cost: number,
        image: string,
        storeName: string,
        link: string,
    }): Promise<{} | { error: string }> {
        let insertItemResponse: any;
        try {
            insertItemResponse = await ScraperDao.insertItem({
                itemName: item.itemName,
                idItem: item.idItem,
                cost: item.cost,
                image: item.image,
                storeName: item.storeName,
                link: item.link,
                popularity: 0,
            });
        } catch (e: any) {
            return Promise.reject({
                error: e
            })
        }

        return Promise.resolve(
            insertItemResponse
        );
    }

    static async apiInsertItems(objectRetrived: [{}]): Promise<{}> {
        let insertItemResponse: {};
        insertItemResponse = await ScraperDao.insertItems(objectRetrived).catch((e: any) => {
            return Promise.reject(e)
        })
        return Promise.resolve(insertItemResponse);



    }

    static async apiGetItemById(itemName: string): Promise<{
        item: {
            _id: string,
            itemName: string,
            cost: number,
            idItem: string,
            images: string,
            storeName: string,
            popularity: number
        },
        error: string
    }> {
        let objectId: {
            _id: string,
            itemName: string,
            cost: number,
            idItem: string,
            images: string,
            storeName: string,
            popularity: number
        } = {
            _id: "",
            itemName: "",
            cost: -1,
            idItem: "",
            images: "",
            storeName: "",
            popularity: 0
        };
        try {
            objectId = await ScraperDao.getItemByID(itemName);
        } catch (e) {
            return Promise.reject({
                item: objectId,
                error: `Problem in inserting order ${e}`
            })
        }
        return Promise.resolve({
            item: objectId,
            error: ""
        });
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

    static async deleteAll() {
        await ScraperDao.deleteAllItems().catch((e: any) => {
            return Promise.reject({
                error: e
            })
        })
        return Promise.resolve({
            message: "deleted"
        })
    }

}
