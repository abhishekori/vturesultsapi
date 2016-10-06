/**
 * Created by abhishek on 18/9/16.
 */
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var BodyParser = require('body-parser');
var app = express();
app.use(BodyParser.urlencoded({ extended: false }));
app.set('port',(process.env.PORT || 5000));
var data;

app.get("/", function (req, res) {

    res.send("The app is live and running");
});
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
            var TotalMarks=0;

            for(var i=0;i<=7;i++)
            {
                results[i]={};
                for(var j=0;j<=6;j++){
                    $("TD[width='513'] table tr:nth-child("+(i+3)+") td:nth-child("+(j+1)+")").first().filter(function () {

                        data=$(this);
                        var fdata=data.text();
                        fdata =fdata.replace(/\r?\n|\r/g, "");

                        if(j==3){
                           TotalMarks+=parseInt(fdata);
                        }
                        switch (j){
                            case 0:results[i]["subject"]=fdata;
                                break;
                            case 1:results[i]["external"]=fdata;
                                break;
                            case 2:results[i]["internal"]=fdata;
                                break;
                            case 3:results[i]["total"]=fdata;
                                break;
                            case 4:results[i]["result"]=fdata;
                                break;
                        }

                    });
                }
            }
            //console.log(TotalMarks);


            finalData['results']=results;
            finalData['TotalMarks']=TotalMarks;
        }
        req.finalData=finalData;
        next();

    });
},function(req,res,next){

   // console.log("atleast "+req.finalData);

    res.json(req.finalData)
    res.end();

});



app.listen(app.get('port'), function () {

    console.log("running on "+app.get('port'));
})

