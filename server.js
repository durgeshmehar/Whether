const express = require("express");
const https = require("node:https");
const bodyparser= require("body-parser");
// const request = require("request")
const app = express();

app.use(bodyparser.urlencoded({extended : true}));
app.engine("html",require("ejs").renderFile);
app.get("/",function( req ,res){
    res.sendFile(__dirname+"/index.html");
})
app.post("/",function(req,res){

    const city=(req.body.loc);
    
    const api="c5cf689e9fefae88146a4606b7a1b976";
    const unit="metric";
    const url ="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+api+"&units="+unit;
    
    https.get(url ,function( response){
        console.log(response.statusCode);
        
        let collect='';
        response.on("data",(info)=>{
            collect +=info;
        })
        response.on("data" ,function(){
            const detail = JSON.parse(collect)
            // console.log(detail);
            // console.log("Temperature(Celsius) :"+detail.main.temp);
            // console.log("Description :"+ detail.weather[0].description);
            // res.sendFile(__dirname+"/index.html");
            // res.render((__dirname+"/index.html"),{result:display});            
            res.write("<h1>WHETHER INFORMATION</h1>")
            res.write("<h2>The temperature in "+ detail.name +" is "+ detail.main.temp + " (degree) with having nature of "+ detail.weather[0].description +"</h2>");
            const icon =detail.weather[0].icon ;
            const urlIcon = "https://openweathermap.org/img/wn/"+ icon + "@2x.png"
            res.write("<img src=" +urlIcon + ">");
            res.send();
        })
    })
    .on("error",function(e){
        console.log("Error :"+ e);
    })
})

app.listen(3000 , function(){
    console.log("Succesfully Log in to port 3000.");
})