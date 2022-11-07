import axios from "axios";
import fs from "fs";
import fetch from "node-fetch";
const cheerio = require("cheerio")

export default class ScraperDao {


    static async getResponseData(url: string) {
        try {
            axios.get(url).then((response) => {
                console.log("got response")
                let $ = cheerio.load(response.data);
                if ($('.pagination__active').next().text() !== "...") {
                    let urlNext = $('.pagination__active').next().attr('href');
                    urlNext = urlNext.slice(1, urlNext.lenght);
                    console.log(url + urlNext)
                    this.getResponseData(url + urlNext);
                }

            })
        } catch (error) {
            console.log(error);
        }

    }


    static async scraperTest(url: string, filename: string) {

        let indexPage: number = 1;





        /*
        if ($('.pagination__active').next().text() !== "...") {
            let url = $('.pagination__active').next().attr('href');
            console.log(url)
        }
        */






        /*

         if (!fs.existsSync(`./cache/${filename}.txt`)) {
            fs.writeFile(`./cache/${filename}.txt`, `${responseData}`, (error) => {
                console.log(error)
            });
        }
                $('.showindex__children').each((index: number, element: any) => {
                    const elementButton = $(element).find('a');
                    const title = elementButton.attr('title');
                    var image = elementButton.find('.album__img').text();
                    //elementButton.find('.album__img').attr('data-origin-src');
                    //console.log(`index ${index}, Title:${title} `)
                    console.log(`image src: ${image}`)
                });

*/








    }



}