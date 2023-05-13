const fs = require("fs")
const cheerio = require("cheerio")
import ScraperDao from "../dao/scraperDao";
import puppeteer from 'puppeteer';
import axios from "axios";
const Agent = require("agentkeepalive");
import UserAgent from 'user-agents';
export default class ScraperController {

    /**
     * @param arrayInfo array of objects with url and filename passed from the client
     * @returns a promise with a message
     * @description this is the creator of each scraper, the number of scraper is equal to the number of objects in the array
     */
    static async scraperMulti(arrayInfo: [{ url: string, filename: string }]): Promise<{}> {
        await Promise.all(arrayInfo.map(async (data: { url: string, filename: string }) => {
            return await this.scraperMain(data.url, data.filename).catch((err: any) => {
                return Promise.reject(err)
            })
        })).catch((err: any) => {
            return Promise.reject(err)
        })
        return Promise.resolve({ message: "Scraping completed" })
    }


    /**
     * 
     * @param url string of the url to scrape es: https://chaosmade.x.yupoo.com/albums
     * @param filename string of the filename to create es: chaosmade
     * @returns Promise with a message
     * @description function that manage all the pages of the url passed
     */
    static async scraperMain(url: string, filename: string): Promise<{}> {
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
                        return Promise.reject(err);
                    })
            }))
            count++;

        } while (urls.length)
        await browser.close();
        return Promise.resolve({
            message: `Finito ${filename}`
        })






    }
    /**
     * 
     * @param dirName string of the directory name
     * @param filename number of the filename
     * @param content string of the content to write in the file
     * @returns promise with a message
     * @description function that create a file in the cache folder check if the cache folder exists and stores exists
     */
    static async createFile(dirName: string, filename: number, content: string): Promise<{}> {
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

        } catch (e) {
            return Promise.reject(e)
        }
        return Promise.resolve({
            message: "File created"
        })
    }
    /**
     * 
     * @param url string of the url to scrape
     * @param browser puppeteer browser
     * @returns Promise with a message
     * @description function that scrape the page and return the html of the page
     */
    static async convertPage(url: string, browser: any): Promise<{}> {

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
            return Promise.reject(e)
        }
        console.log(`visited: ${url}`);
        return Promise.resolve({
            message: finalFile,
        })

    }
    /**
     * 
     * @param url string of the url to scrape
     * @param browser puppeteer browser
     * @returns promise with the number of pages
     * @description function that return the number of pages of the url passed
     */
    static async getPageMax(url: string, browser: any): Promise<number> {
        const userAgent = new UserAgent({ deviceCategory: 'mobile' });
        let page;
        let htmlPage;
        let pageMax: number;
        try {

            page = await browser.newPage();
            await page.setUserAgent(userAgent.toString());
            await page.goto(url);
            htmlPage = await page.content();
            await page.close();
            let $ = cheerio.load(htmlPage);
            pageMax = $('input[name=page]').attr('max');

        } catch (e) {
            return Promise.reject(0);

        }
        return Promise.resolve(pageMax);
    }
    /**
     * Core function of the scraper
     * @param directory string of the directory name
     * @returns Promise with an array of items or an error
     * @description function that return an array of items from the directory passed
     */
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
            popularity: number,
        }] = [{
            itemName: "",
            idItem: "",
            cost: 0,
            image: "",
            storeName: "",
            link: "",
            popularity: 0,
        }]

        try {
            let arrayAlbumRegex = new RegExp(`album.{1,}main"`);
            let arrayFile = fs.readdirSync(`./cache/stores/${directory}`);
            let regexPrice = new RegExp("\\d{1,}");
            let regexPhoto = new RegExp(`album.{1,}wrap`);
            let regexAlbumId = new RegExp('\\/albums\\/(\\d+)\\?uid', '')
            arrayFile.forEach((file: string) => {
                let fileRead = fs.readFileSync(`./cache/stores/${directory}/${file}`)
                const $ = cheerio.load(fileRead);
                let arrayAlbum = arrayAlbumRegex.exec(fileRead);
                let arrayAlbumSliced = arrayAlbum![0].slice(0, -1)

                $(`.${arrayAlbumSliced}`).each((index: number, item: any) => {
                    let title = $(item).attr("title");
                    if (title == "more") return;
                    let link = $(item).attr("href");
                    let idAlbum = $(item).attr("data-album-id");

                    if (idAlbum == undefined) {
                        idAlbum = regexAlbumId.exec(link);
                        idAlbum = idAlbum![1];
                    } else {
                        idAlbum = idAlbum.replace(`-`, ``);
                    }

                    link = `https://${directory}.x.yupoo.com${link}`;
                    let arrayCost: RegExpExecArray | string[] | null = regexPrice.exec(title);
                    arrayCost == null ? arrayCost = ["999"] : arrayCost[0] = arrayCost[0];
                    let titleFinal = title
                    let arrayAlbumPhoto = regexPhoto.exec(fileRead);
                    let photo = $(item).find(`.${arrayAlbumPhoto![0]} img`);

                    let linkPhoto = "";

                    Object.keys(photo[0].attribs).map(
                        (name: string) => {
                            if (name == "data" || name == "src" || name == "data-src" || name == "data-origin-src") {
                                if (photo[0].attribs[name].replace(/\s/g, "") !== "" && photo[0].attribs[name].slice(0, 4) !== "data") {
                                    linkPhoto = photo[0].attribs[name];
                                    linkPhoto = "https:" + linkPhoto;
                                }
                            }
                        }
                    )

                    let response = {
                        itemName: titleFinal,
                        cost: Number.parseInt(arrayCost![0]),
                        idItem: idAlbum,
                        image: linkPhoto,
                        storeName: directory,
                        link: link.replace(/\s/g, ""),
                        popularity: 0,
                    }

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

    /**
     * 
     * @returns Promise with a message or an error
     * @description function that convert all the files in the cache/stores directory to json files
     */
    static async converterFilesToItems(): Promise<{}> {
        let arrayDir = fs.readdirSync(`./cache/stores`);
        let arrayData = [{}];



        await Promise.all(arrayDir.map(async (directory: string) => {
            return await this.getResponseFromItem(directory).then((response) => {
                fs.writeFileSync(`./cache/${directory}.json`, JSON.stringify(response));
                arrayData.push(response);
            }).catch((e) => {
                return Promise.reject(e)
            })
        })).catch((e) => {
            console.log(e);
            return Promise.reject(e);
        })

        return Promise.resolve(arrayData);
    }

    /**
     * 
     * @returns Promise with a message or an error
     * @description function that insert all the items in the database
     */
    static async callerInsertItems(): Promise<{}> {
        let arrayDir = fs.readdirSync(`./cache/`);
        let array: [{}] = [{}];
        let response: any;
        await Promise.all(arrayDir.map(async (file: string) => {
            if (file.includes(".json")) {
                let fileRed = fs.readFileSync(`./cache/${file}`);
                array = JSON.parse(fileRed.toString());
                return await this.insertItems(array).then((res: {}) => {
                    response = res;
                }).catch((e: any) => {
                    return Promise.reject(e);
                });

            }
        })).catch((e: any) => {
            return Promise.reject(e);
        })
        return Promise.resolve(response);
    }
    /**
     * 
     * @param filename string of the file to update
     * @returns Promise with a object or an error
     * @description function that update the items in the database with the items in the file passed
     */
    static async updateItems(filename: string): Promise<{ itemInseriti: string[], itemNonInseriti: string[] } | {}> {
        let array: [] = [];
        let file = fs.readFileSync(`./cache/${filename}.json`);
        array = JSON.parse(file.toString());
        let itemsInseriti: string[] = [];
        let itemsNonInseriti: string[] = [];
        await Promise.all(
            array.map(async (item: any) => {
                await this.getItemById(item.idItem).then(async (res) => {
                    if (res._id == "") {
                        await this.insertItem(item).then(() => {
                            itemsInseriti.push(item.idItem);
                        }).catch((e: any) => {
                            return Promise.reject(e)
                        })
                    } else {
                        itemsNonInseriti.push(item.idItem);
                    }
                }).catch((e: any) => {
                    return Promise.reject(e);
                })
            })
        ).catch((e: any) => {
            Promise.reject(e);
        })
        return Promise.resolve({
            itemInseriti: itemsInseriti,
            itemNonInseriti: itemsNonInseriti,
        })
    }


    /**
     * 
     * @param items array of items to insert
     * @returns Promise
     * @description function that act as middleware that get the images of the items
     */
    static async getImage(itemsList: [{
        _id: string,
        itemName: string,
        cost: number,
        idItem: string,
        image: string,
        storeName: string,
        popularity: number
        link: string
    }]): Promise<[{
        _id: string,
        itemName: string,
        cost: number,
        idItem: string,
        image: string,
        storeName: string,
        popularity: number
        link: string
    }]> {

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

        let buffer: string = "";
        let instance = axios.create({
            httpAgent: keepAliveAgent,
            httpsAgent: httpsKeepAliveAgent,

        })
        await Promise.all(itemsList.map(async (item: any) => {
            if (item.image.slice(0, 4) !== "data") {
                return await instance.get(item.image, {
                    responseType: 'arraybuffer',
                    headers: {
                        "Referer": item.link
                    }
                }).then((response: any) => {
                    buffer = Buffer.from(response.data, 'binary').toString("base64");
                    item.image = buffer;
                }).catch((e: any) => {
                    item.image = "No Image";
                })
            }
        })).catch((e: any) => {
            return Promise.reject(e);
        })
        return Promise.resolve(itemsList);
    }


    /**
     * 
     * @param item item to insert
     * @returns promise object
     * @description function that insert an item in the database
     */
    static async insertItem(item: {
        itemName: string,
        idItem: string,
        cost: number,
        image: string,
        storeName: string,
        link: string,
    }): Promise<{}> {
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
            return Promise.reject(e)
        }

        return Promise.resolve(
            insertItemResponse
        );
    }
    /**
     * 
     * @param objectRetrived array of items to insert
     * @returns Promise object
     * @description function that insert an array of items in the database
     */
    static async insertItems(objectRetrived: [{}]): Promise<{}> {
        let insertItemResponse: {};
        insertItemResponse = await ScraperDao.insertItems(objectRetrived).catch((e: any) => {
            return Promise.reject(e)
        })
        return Promise.resolve(insertItemResponse);



    }
    /**
     * 
     * @param itemName name of the item to get
     * @returns Promise object
     * @description function that get an item by id
     */
    static async getItemById(itemId: string): Promise<{
        _id: string,
        itemName: string,
        cost: number,
        idItem: string,
        image: string,
        storeName: string,
        popularity: number

    }> {
        let objectId: {
            _id: string,
            itemName: string,
            cost: number,
            idItem: string,
            image: string,
            storeName: string,
            popularity: number
        } = {
            _id: "",
            itemName: "",
            cost: -1,
            idItem: "",
            image: "",
            storeName: "",
            popularity: 0
        };

        objectId = await ScraperDao.getItemByID(itemId).catch((e: any) => {
            return Promise.reject(e)
        })

        return Promise.resolve(objectId);
    }
    /**
     * 
     * @param itemId id of the item to increment
     * @returns Promise Object
     * @description function that increment the popularity of an item
     */
    static async incrementPopularity(itemId: string): Promise<{}> {
        let response: any;

        response = await ScraperDao.incrementOne(itemId).catch((e: any) => {
            return Promise.reject(e);
        })
        return Promise.resolve(response);

    }

    /**
     * 
     * @param req request
     * @returns Promise of the response
     * @description get the items from the db
     */
    static async getItem(reqQuery: any): Promise<{}> {
        let responseItems: {
            itemsList: [{
                _id: string,
                itemName: string,
                cost: number,
                idItem: string,
                image: string,
                storeName: string,
                popularity: number
                link: string
            }],
            totalItemsList: number;
        } = {
            itemsList: [{
                _id: "",
                itemName: "",
                cost: -1,
                idItem: "",
                image: "",
                storeName: "",
                popularity: 0,
                link: ""
            }],
            totalItemsList: 0
        }
        const itemsPerPage = reqQuery.itemsPerPage
            ? parseInt(reqQuery.itemsPerPage, 10)
            : 20;
        const page = reqQuery.page ? parseInt(reqQuery.page, 10) : 0;

        let filters: any = {};
        let sortBy: {} = {};
        if (reqQuery.cost) {
            filters.cost = Number(reqQuery.cost)
        }

        if (reqQuery.itemName) {
            filters.itemName = reqQuery.itemName;
        }
        if (reqQuery.storeName) {
            filters.storeName = reqQuery.storeName;
        }
        if (reqQuery.$text) {
            filters.$text = reqQuery.$text;
        }

        if (reqQuery.sortBy) {
            sortBy = reqQuery.sortBy;
        }

        responseItems = await ScraperDao.getItems({
            filters,
            page,
            itemsPerPage,
            sortBy
        }).catch((e: any) => {
            return Promise.reject(e)
        })


        responseItems.itemsList = await this.getImage(responseItems.itemsList).catch((e: any) => {
            return Promise.reject(e)
        })
        return Promise.resolve(responseItems);
    }
    /**
     * @description function that delete all the items in the database
     * @returns Promise object
     */
    static async deleteAll(): Promise<{}> {
        await ScraperDao.deleteAllItems().catch((e: any) => {
            return Promise.reject(e)
        })
        return Promise.resolve({
            message: "deleted"
        })
    }

}
