var express = require("express");
var app = express();
var cheerio = require('cheerio');
var url = require('url').url;
var $ = require('jquery');
var url1;
var request = require("request");
var bodyparser = require("body-parser");
var _links, _alt, _imgSrc;
//important to get the data from the user to parse it
app.use(bodyparser.urlencoded({extended: true}));

app.set("view engine","ejs");
//set up the by default directory
app.use(express.static(__dirname + "/public"));

//root route
app.get("/",function(req, res) {
    res.render("routes/new");
})

//show the form
app.get("/routes/new",function(req,res) { 
  res.render("routes/new");
})

// show the links
app.post('/routes/links', function(req, res) {
  //results route
    var urlString = req.body.urlString;
    var market = null;
   // var getMarket = urlString.includes("market=la");
    if(urlString.includes("market=bs"))
    {
       market = "bs"
    }else if(urlString.includes("market=cg")){
      market = "cg";
    }else if(urlString.includes("market=ct")){
      market = "ct";
    }else if(urlString.includes("market=ct")){
      market = "ct";
    }else if(urlString.includes("market=dp")){
      market = "dp";
    }else if(urlString.includes("market=hc")){
      market = "hc";
    }else if(urlString.includes("market=la")){
      market = "la";
    }else if(urlString.includes("market=mc")){
      market = "mc";
    }else if(urlString.includes("market=ny")){
      market = "ny";
    }else if(urlString.includes("market=os")){
      market = "os";
    }else if(urlString.includes("market=sd")){
      market = "sd";
    }else if(urlString.includes("market=ss")){
      market = "ss";
    }else if(urlString.includes("market=vp")){
      market = "vp";
    }
      var urlObject = {
          urlString : urlString,
          Links : _links,
          Alt: _alt
      }
      //get the User entered URL in url1
      url1 = urlObject.urlString;
      _links = new Array();
      _alt = new Array();
      _imgSrc = new Array();
      
      // url1 = "https://www.google.com"
      request(url1,function(error,response,body){
        console.log("User entered URL", url1);
        if(!error && response.statusCode == 200){
          $ = cheerio.load(body);
          //console.log(body);
          var links = $('a'); //jquery get all hyperlinks
          $(links).each(function(i, link){
            var attr = $(this).attr('href');
            //console.log("attr", attr);
            var len = null;
            if(attr != undefined){
              len = attr.length;
              
            } //else
            {
             // attr = "empty";
            }
          //if len is greater than 0 then push in to array
            if(len > 0){
              
              //get the individual link
              var link = $(link).attr('href');
              if(link.startsWith('//')){
                 //push secure link
                link = link.replace("//", "https://");
                _links.push(link); 
                 //console.log(" // link ", link);
              }else{
                // push http link
                _links.push(link); 
                // console.log(" not // link ", link);
              }
            }
          });
          
          $('img[alt]').each(function() {
             
             _imgSrc.push([$(this).attr('src'), $(this).attr('alt')]); /* get src and alt for images with alt attribute */
           
              //console.log($(this).attr('alt'));
           });
          var Objlink = {
              arrLinks:  _links,
              _imgSrc: _imgSrc,
              url1: url1,
              market : market,
          }
            res.render("routes/links",{Objlink: Objlink});
        } else {
          console.log("Please enter valid URL");
        }
  });
});
  
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("URL server started");
});
