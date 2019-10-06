var express = require("express");
var request = require("request");
var fs = require("fs");
var cheerio = require("cheerio");
require('dotenv').config();
const nodemailer = require('nodemailer');
const cron = require('node-cron')


var app = express();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

let mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: 'subhransumaharana@gmail.com',
    subject: 'Shubh\'s Product Alert',
};


//Checks every minute..
cron.schedule("* * * * *", () => {
    console.log('Checking for product..');
    // let url = 'https://www.amazon.in/dp/'+ req.params.productId;
    let url = 'https://www.amazon.in/dp/B07SRW3MCM/'
    console.log(url);

    request(url, (err, res, html) => {
        if (!err) {
            var $ = cheerio.load(html);
            console.log('Page loaded!');
            var priceDetail = $('#priceblock_ourprice').text();
            if (priceDetail != null && typeof priceDetail != 'undefined' && priceDetail.trim() != "") {
                console.log("Product is in stock::")
                console.log("Price is::", priceDetail);
                transporter.sendMail({ ...mailOptions, text: "This Product is now available at Price::" + priceDetail }, (err, info) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Email Sent Successfully:" + info.response);
                    }
                });
            } else {
                console.log("Product still not available..");
            }

        } else {

            console.log("Error Occured!!", err);
        }
    });
});



app.get("/track/:productId", (req, res) => {
    let url = 'https://www.amazon.in/dp/' + req.params.productId;
    // let url = 'https://www.amazon.in/dp/B07GB324YK/'
    console.log(url);

    request(url, (err, res, html) => {
        if (!err) {
            var $ = cheerio.load(html);
            console.log('Page loaded!');
            var priceDetail = $('#priceblock_ourprice').text();
            if (priceDetail != null && typeof priceDetail != 'undefined') {
                if (priceDetail.trim() != "") {
                    console.log("Product is in stock::")
                    console.log("Price is::", priceDetail);
                    transporter.sendMail({ ...mailOptions, text: "This Product is now available at Price::" + priceDetail }, (err, info) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Email Sent Successfully:" + info.response);
                        }
                    });
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