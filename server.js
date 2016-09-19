/**
 * Created by abhishek on 18/9/16.
 */
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

var data;
var htmlData={};

app.get("/scrape",function(req,res){
    request({
        url: 'http://results.vtu.ac.in/vitavi.php', //URL to hit
        qs: {from: 'blog example', time: +new Date()}, //Query string data
        method: 'POST',
        //Lets post the following key/values as form
        form: {
            rid: '1ds13cs007',
            submit: 'SUBMIT'
        }
    }, function(error, response, html){
        if(error) {
            console.log(error);
        } else {

            // res.send(body.table);

            //console.log(html);
            var finalData={};


            var $ = cheerio.load(html);

            $("TD[width='513'] B").first().filter(function () {

                data =$(this);
                finalData['name']=data.text();

            });

            $("TD[width='513'] TABLE TD:nth-child(2)").first().filter(function () {
                data=$(this);
                //console.log(data.text());
                finalData['sem']=data.text();

            });

            $("TD[width='513'] TABLE TD:nth-child(4)").first().filter(function () {
                data=$(this);
               // console.log(data.text());
                finalData['result']=data.text();

            });


            $("TD[width='513'] table tr:nth-child(3) td:nth-child(1)").first().filter(function () {
                data=$(this);
                var fdata=data.text();


                //console.log(fdata);
                finalData['sub1']=[]
                finalData['sub1'][0]=data.text();

            });

            $("TD[width='513'] table tr:nth-child(3) td:nth-child(2)").first().filter(function () {
                data=$(this);
                var fdata=data.text();


                //console.log(fdata);
                finalData['sub1'][1]=data.text();

            });

            $("TD[width='513'] table tr:nth-child(3) td:nth-child(3)").first().filter(function () {
                data=$(this);
                var fdata=data.text();


                //console.log(fdata);
                finalData['sub1'][2]=data.text();

            });

            $("TD[width='513'] table tr:nth-child(3) td:nth-child(4)").first().filter(function () {
                data=$(this);
                var fdata=data.text();


                //console.log(fdata);
                finalData['sub1'][3]=data.text();

            });

            $("TD[width='513'] table tr:nth-child(3) td:nth-child(5)").first().filter(function () {
                data=$(this);
                var fdata=data.text();


                //console.log(fdata);
                finalData['sub1'][4]=data.text();

            });

            $("TD[width='513'] table tr:nth-child(3) td:nth-child(6)").first().filter(function () {
                data=$(this);
                var fdata=data.text();


                //console.log(fdata);
                finalData['sub1'][5]=data.text();

            });
        }

        console.log(finalData);

    });

    res.end();

});





app.listen('8081', function () {

    console.log("running on 8081");
})

