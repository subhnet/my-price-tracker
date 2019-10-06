var express = require("express");
var request = require("request");
var fs = require("fs");
var cheerio = require("cheerio");


var app = express();


app.get("/track", (req, res) => {

    let url = 'https://www.amazon.in/dp/B07GB324YK/'

    request(url, (err, res, html) => {
        if (!err) {
            var $ = cheerio.load(html);
            console.log('Success!!');
            var test = $('#priceblock_ourprice').text();
            if (test != null && typeof test != 'undefined') {
                if (test.trim() != "") {
                    console.log("Product is in stock::")
                    console.log("Price is::", test);
                }
            }

        } else {

            console.log("Error Occured!!", err);
        }
    });

    res.send("ok");
})


app.listen('8080');

console.log('Magic will happen at port 8080');


exports = module.exports = app;