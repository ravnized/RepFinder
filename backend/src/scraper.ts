
import fetch from "node-fetch";
const cheerio = require("cheerio")

export default class ScraperDao {

    static async scraperTest() {
        try {
            fetch('https://o832club.x.yupoo.com/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((response) => {
                console.log("got response")
                console.log(response)
                const $ = cheerio.load(response);
                $('.showindex__children').each((index: number, element: any) => {
                    const elementButton = $(element).find('a');
                    const title = elementButton.attr('title');
                    var image = elementButton.find('.album__img').text();
                    //elementButton.find('.album__img').attr('data-origin-src');
                    //console.log(`index ${index}, Title:${title} `)
                    console.log(`image src: ${image}`)
                });


            })
                .catch((error) => {
                    console.error(error)
                });





        } catch (error: any) {
            console.error(error)
        }
    }



}