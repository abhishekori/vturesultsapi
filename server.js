/**
 * Created by abhishek on 18/9/16.
 */
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var BodyParser = require('body-parser');
var app = express();
app.use(BodyParser.urlencoded({ extended: false }))
var data;
app.post("/scrape", function (req, res, next) {
    var finalData={};
    request({
        url: 'http://results.vtu.ac.in/vitavi.php',
        method: 'POST',
        form: {
            rid: req.body.usn,
            submit: 'SUBMIT'
        }
    }, function(error, response, html){
        if(error) {
            console.log(error);
        } else {


            var $ = cheerio.load(html);

            $("TD[width='513'] B").first().filter(function () {

                data =$(this);
                finalData['name']=data.text().replace(/\s+/g,' ').trim();

            });

            $("TD[width='513'] TABLE TD:nth-child(2)").first().filter(function () {

                data=$(this);
                finalData['sem']=data.text().replace(/\s+/g,' ').trim();

            });

            $("TD[width='513'] TABLE TD:nth-child(4)").first().filter(function () {

                data=$(this);
                finalData['result']=data.text().replace(/\s+/g,' ').trim().substring(8,                     19);

            });

            var results=[];

            for(var i=0;i<=7;i++)
            {
                results[i]=[];
                for(var j=0;j<=5;j++){
                    $("TD[width='513'] table tr:nth-child("+(i+3)+") td:nth-child("+(j+1)+")").first().filter(function () {

                        data=$(this);
                        var fdata=data.text();
                        fdata =fdata.replace(/\r?\n|\r/g, "");
                        results[i].push(fdata);

                    });
                }
            }


            finalData['results']=results;
        }
        req.finalData=finalData;
        next();

    });
},function(req,res,next){

    console.log("atleast "+req.finalData);
    res.json(req.finalData);

});



app.listen('8081', function () {

    console.log("running on 8081");
})

