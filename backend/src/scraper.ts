import axios from "axios";
const fs = require("fs")
const cheerio = require("cheerio")

export default class ScraperDao {
    static finalFile = "";
    static currentPage = 1;
    static async getResponseData(url: string, filename: string) {

        return axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            console.log("got response")

            let $ = cheerio.load(response.data);
            let pagination__active_next = $('.pagination__active').next();
            let pageMax = $('input[name=page]').attr('max');
            let urlMod = ""
            console.log(pagination__active_next.text())
            if (ScraperDao.currentPage < pageMax) {
                ScraperDao.finalFile += $('.showindex__parent').html();
                console.log(url)
                urlMod = url.slice(0, url.length - 1)
                console.log(urlMod)
                delete response.data;
                ScraperDao.currentPage++;
                ScraperDao.getResponseData(urlMod + ScraperDao.currentPage, filename);
            } else {
                console.log(ScraperDao.finalFile)
            }

        }).catch((err) => {
            console.log(err)
            ScraperDao.getResponseData(url, filename)
        })





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