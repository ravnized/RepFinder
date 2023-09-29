const fs = require("fs")
const cheerio = require("cheerio")
import ScraperDao from "../dao/scraperDao";
import puppeteer from 'puppeteer';
import axios from "axios";
const Agent = require("agentkeepalive");
import UserAgent from 'user-agents';
import { forEach } from "async";
import { Response } from "express";
const { exec } = require("child_process");
var Docker = require('dockerode');
export default class ScraperController {

    /**
     * @param arrayInfo array of objects with url and filename passed from the client
     * @returns a promise with a message
     * @description this is the creator of each scraper, the number of scraper is equal to the number of objects in the array
     */
    static async scraperMulti(arrayInfo: { scraper: [{ url: string, filename: string }] }, ws: any): Promise<{}> {
        //console.log(arrayInfo);
        let docker = new Docker({ socketPath: '/var/run/docker.sock' });
        await docker.getContainer('puppeteer').start().then(() => {
            console.log("puppeteer container started");
        }).catch((e: any) => {
            console.log(`error in start container ${e}`);
            return Promise.reject(e);
        })
        //wait 10 seconds to start the scraper
        await new Promise(resolve => setTimeout(resolve, 10000));



        await Promise.all(arrayInfo.scraper.map(async (data: { url: string, filename: string }) => {
            return await this.scraperMain(data.url, data.filename, ws).catch((err: any) => {
                return Promise.reject(err)
            })
        })).catch((err: any) => {
            return Promise.reject(err)
        })

        await docker.getContainer('puppeteer').stop().then(() => {
            console.log("puppeteer container stopped");
        }).catch((e: any) => {
            console.log(`error in stop container ${e}`);
            return Promise.reject(e);
        })


        return Promise.resolve({ message: "Scraping completed" })
    }

    /**
         * @description function that get all the files in the cache folder
         * @returns Promise array of string
         */
    static async getFiles(): Promise<[string]> {
        let arrayDir = await fs.readdirSync(`${process.cwd()}/cache`);
        let arrayFinal: [string] = [""];
        forEach(arrayDir, (file: string) => {
            if (file.includes(".json")) {
                arrayFinal.push(file.replace(".json", ""));
            }
        })
        arrayFinal.shift()

        return Promise.resolve(arrayFinal);

    }
    /*
    
        static async removeContainer(docker: any): Promise<{}> {
            let container = docker.getContainer('puppeteer');
            if(container == null) return Promise.resolve({
                message: "Container not found"
            })
            await container.stop().catch((e: any) => {
                console.log(`error in stop container ${e}`);
                return Promise.reject(e);
            })
            await container.remove().catch((e: any) => {
                console.log(`error in remove container ${e}`);
                return Promise.reject(e);
            })
            return Promise.resolve({
                message: "Container removed"
            })
        }
    
    
        static async startContainer(docker: any): Promise<{}> {
    
            const container = await docker.createContainer({
                Image: 'browserless/chrome',
                name: 'puppeteer',
                Tty: true,
                HostConfig: {
                    PortBindings: {
                        '5002/tcp': [
                            {
                                HostPort: '5002',
                            },
                        ],
                    },
                },
                ExposedPorts: {
                    '5002/tcp': {},
                },
                Env: [
                    "PORT=5002", "CONNECTION_TIMEOUT=-1", "DISABLE_AUTO_SET_DOWNLOAD_BEHAVIOR=true", "ALLOW_FILE_PROTOCOL=true"
                ]
            }).catch((e: any) => {
                console.log(`error in create container ${e}`);
                return Promise.reject(e);
            })
    
            await container.start().catch((e: any) => {
                console.log(`error in start container ${e}`);
                return Promise.reject(e);
            })
            return Promise.resolve({
                message: "Container started"
            })
    
    
    
    
        }
    
        */






    /**
     * 
     * @param url string of the url to scrape es: https://chaosmade.x.yupoo.com/albums
     * @param filename string of the filename to create es: chaosmade
     * @returns Promise with a message
     * @description function that manage all the pages of the url passed
     */
    static async scraperMain(url: string, filename: string, ws: any): Promise<{}> {
        let pageMax: number;
        pageMax = 0;
        let count = 0;
        let countForProgess = 0;











        let browser = await puppeteer.connect({ browserWSEndpoint: 'ws:puppeteer:5002' }).catch((e: any) => {
            console.log(`error in browser ${e}`);
        });
        //console.log("browser launched");
        //console.log(url)
        await this.getPageMax(url, browser).catch((e: any) => {
            return Promise.reject(e);
        }).then((res: number) => {
            pageMax = res;
        })
        //generate an array with all the urls to scrape
        let urls: string[] = [];
        //https://chaosmade.x.yupoo.com/albums
        for (let i = 1; i <= pageMax; i++) {
            urls.push(`${url}?page=${i}`);
        }
        let promises = [];


        do {
            promises = urls.splice(0, 20);

            //console.log(promises);
            // 20 at a time
            await Promise.all(promises.map(async (url: string, index: number) => {
                await this.convertPage(url, browser)
                    .then(async (data: any) => {
                        countForProgess++;
                        //console.log(`creating file ${filename} ${index + 1 + (count * 20)}`)
                        await this.createFile(filename, index + 1 + (count * 20), data.message)
                        let percent = Math.round(countForProgess / pageMax * 100);
                        ws.send(JSON.stringify({
                            filename: filename,
                            percent: percent,
                        }))




                    })
                    .catch((err: any) => {
                        return Promise.reject(err);
                    })

            }))
            count++;

        } while (urls.length)




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

            if (!fs.existsSync(`${process.cwd()}/cache`)) {
                fs.mkdirSync(`${process.cwd()}/cache`);
            }
            if (!fs.existsSync(`${process.cwd()}/cache/stores`)) {
                fs.mkdirSync(`${process.cwd()}/cache/stores`);
            }

            if (!fs.existsSync(`${process.cwd()}/cache/stores/${dirName}`)) {
                fs.mkdirSync(`${process.cwd()}/cache/stores/${dirName}`);
            }
            fs.writeFileSync(`${process.cwd()}/cache/stores/${dirName}/${filename}`, `${content}`);

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
            //console.log(`visiting: ${url}`);
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
                //retry
                return await this.convertPage(url, browser).catch((e: any) => {
                    return Promise.reject(e);
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
            //console.log(`visiting: ${url} to get the max page`);
            page = await browser.newPage();
            let user = await userAgent.toString();
            await page.setUserAgent(user);
            await page.goto(url)
            htmlPage = await page.content();
            await page.close();
            let $ = await cheerio.load(htmlPage);
            pageMax = await $('input[name=page]').attr('max');
        } catch (e) {
            // console.log(e);
            return Promise.reject(e);
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
    }[]> {
        let responseArray: [{
            itemName: string,
            idItem: string,
            cost: number,
            image: string,
            storeName: string,
            link: string,
            popularity: number,
            blackList: boolean,
        }] = [{
            itemName: "",
            idItem: "",
            cost: 0,
            image: "",
            storeName: "",
            link: "",
            popularity: 0,
            blackList: false,
        }]

        try {
            let arrayAlbumRegex = new RegExp(`album.{1,}main"`);
            let arrayFile = fs.readdirSync(`./cache/stores/${directory}`);
            let regexPrice = new RegExp("\\d{1,}");
            let regexPhoto = new RegExp(`album.{1,}wrap`);
            let regexAlbumId = new RegExp('\\/albums\\/(\\d+)\\?uid', '')
            arrayFile.forEach((file: string) => {
                let fileRead = fs.readFileSync(`./cache/stores/${directory}/${file}`)
                if (fileRead.toString() === "") return;
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
                        blackList: false,
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
        let arrayDir = fs.readdirSync(`${process.cwd()}/cache/stores`);
        let arrayData: {}[] = [{}];



        await Promise.all(arrayDir.map(async (directory: string) => {
            return await this.getResponseFromItem(directory).then((response) => {

                fs.writeFileSync(`${process.cwd()}/cache/${directory}.json`, JSON.stringify(response));
                arrayData = response;
            }).catch((e) => {
                return Promise.reject(e)
            })
        })).catch((e) => {
            //console.log(e);
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
    static async updateItems(filenameArray: []): Promise<{ itemInseriti: string[], itemNonInseriti: string[] } | {}> {
        let itemsInseriti: string[] = [];
        let itemsNonInseriti: string[] = [];
        //console.log(filenameArray);

        await Promise.all(filenameArray.map(async (filename: string) => {
            console.log(`updating ${filename}`);
            let array: [] = [];
            let file = fs.readFileSync(`${process.cwd()}/cache/${filename}.json`);
            if (file.toString() === "") return Promise.resolve({
                message: "file empty"
            });
            array = await JSON.parse(file.toString());
            await Promise.all(
                array.map(async (item: any) => {

                    await this.getItemById(item.idItem).then(async (res) => {
                        //console.log(`updating item ${item.idItem}`)
                        if (res === undefined) {
                            //console.log(`inserting item ${item.idItem}`)
                            await this.insertItem(item).then(() => {
                                itemsInseriti.push(item.idItem);
                            }).catch((e: any) => {
                                //console.log(`error in insert item ${e}, ${item.idItem}`)
                                return Promise.reject(e)
                            })
                        } else {
                            //console.log(`not inserting item ${item.idItem}`)
                            itemsNonInseriti.push(item.idItem);
                        }
                    }).catch((e: any) => {
                        console.log(`error in getItemsById items ${e.error}`)
                        return Promise.reject(e);
                    })
                })
            ).catch((e: any) => {
                console.log(`error in promise items ${e.error}`)
                Promise.reject(e);
            })
        })).catch((e: any) => {
            console.log(`error in promise filename ${e.error}`)
            return Promise.reject(e);
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
        link: string,
        blackList: boolean
    }]): Promise<[{
        _id: string,
        itemName: string,
        cost: number,
        idItem: string,
        image: string,
        storeName: string,
        popularity: number
        link: string
        blackList: boolean
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
            console.log(`getItemById ${e.error}`)
            return Promise.reject(e)
        })
        return Promise.resolve(objectId);
    }

    static async getItemBy_Id(_id: string): Promise<{
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

        objectId = await ScraperDao.getItemBy_ID(_id).catch((e: any) => {
            console.log(`getItemById ${e.error}`)
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
                blackList: boolean
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
                link: "",
                blackList: false
            }],
            totalItemsList: 0
        }
        const itemsPerPage = reqQuery.itemsPerPage
            ? parseInt(reqQuery.itemsPerPage, 10)
            : 20;
        const page = reqQuery.page ? parseInt(reqQuery.page, 10) : 0;
        console.log(reqQuery);
        let filters: any = {};
        let sortBy: {} = {};

        if (reqQuery.cost) {
            filters.cost = [
                Number(reqQuery.cost[0]),
                reqQuery.cost[1]
            ]


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
        filters.blackList = [
            true, "$ne"
        ]


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

    /**
     * 
     * @param req request
     * @returns Promise object
     * @description function that update the cost of an item
     */

    static async updateCost(req: any): Promise<{}> {
        let response: any;
        let itemName: string = req.body.item;
        let cost: number = req.body.cost;
        response = await ScraperDao.updateCost(itemName, cost).catch((e: any) => {
            return Promise.reject(e)
        })
        return Promise.resolve(response);
    }

    /**
     * 
     * @param req request
     * @returns Promise object
     * @description function that update the name of an item
     */
    static async updateItemName(req: any): Promise<{}> {
        let response: any;
        let itemId: string = req.body.item;
        let name: string = req.body.name;
        response = await ScraperDao.updateItemName(itemId, name).catch((e: any) => {
            return Promise.reject(e)
        })
        return Promise.resolve(response);
    }

    static async updateItem(req: any): Promise<{}> {
        let response: any;
        let _id: string = req._id;
        let itemName: string = req.itemName;
        let cost: number = Number(req.itemCost);
        let itemNameChanged: boolean = false;
        let itemCostChanged: boolean = false;
        await this.getItemBy_Id(_id).then(
            async (res: any) => {
                if (res.itemName !== itemName) {
                    itemNameChanged = true
                }
                if (res.cost !== cost) {
                    itemCostChanged = true
                }
            })

        response = await ScraperDao.updateItem(_id, itemName, itemNameChanged, cost, itemCostChanged).catch((e: any) => {
            return Promise.reject(e)
        })
        return Promise.resolve(response);
    }

    /**
     * 
     * @param req request
     * @returns Promise object
     * @description function that delete an item
     */

    static async blacklistItem(req: any): Promise<{}> {

        let response: any;
        let _id: string = req.item_id;

        let itemId = req.itemId;


        await this.getItemById(itemId).then(
            async (res: any) => {


                if (res._id.toString() !== _id) {
                    return Promise.reject({
                        error: "Item not found"
                    })
                } else {
                    response = await ScraperDao.blacklistItem(_id).catch((e: any) => {
                        console.log(`deleteItem ${e}`);
                        return Promise.reject(e)
                    })
                }
            }
        ).catch((e: any) => {
            console.log(`getItem ${e.error}`);
            return Promise.reject(e)
        })
        return Promise.resolve(response);
    }

    static async getStoreName(): Promise<{}> {
        let response: any;
        response = await ScraperDao.getStoreName().catch((e: any) => {
            return Promise.reject(e)
        })
        return Promise.resolve(response);
    }

    static async clearCache(): Promise<{}> {
        //remove cache folder
        if (fs.existsSync(`${process.cwd()}/cache/stores`)) {
            fs.rm(`${process.cwd()}/cache/stores`, { recursive: true }, (err: any) => {
                if (err) {
                    return Promise.reject(err);
                }
            })
        }
        fs.readdirSync(`${process.cwd()}/cache`).forEach((file: string) => {
            if (file.includes(".json")) {
                fs.rm(`${process.cwd()}/cache/${file}`, {}, (err: any) => {
                    if (err) {
                        return Promise.reject(err);
                    }
                })
            }
        })
        return Promise.resolve({
            message: "Cache cleared"
        })

    }


}
