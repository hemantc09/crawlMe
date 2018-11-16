
//test : http://la.tribpubads.com/email-indie-focus/the-happy-prince.html
var express = require("express");
var app = express();
var cheerio = require('cheerio');
var url = require('url');
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
  // console.log(req.body)
})

// show the links
app.post('/routes/links', function(req, res) {
  //results route
    // console.log(url);
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
     
    
    // if(getMarket==true)
    // {
    //   market = "la";
    // }
   // console.log("getMarket", getMarket);
    //console.log("Market is", market);
    
      var urlObject = {
          urlString : urlString,
          Links : _links,
          Alt: _alt
      }
      
      url1 = urlObject.urlString;
      
      _links = new Array();
      _alt = new Array();
      _imgSrc = new Array();
      
      // url1 = "https://www.google.com"
      request(url1,function(error,response,body){
        console.log(body.url);
        console.log(url1);
        
        if(!error && response.statusCode == 200){
           console.log("status code" + response.statusCode + "errocode:"+ error);  
          $ = cheerio.load(body);
        // console.log("this is the body returned: " , response);
          var links = $('a'); //jquery get all hyperlinks
          $(links).each(function(i, link){
           // console.log("link:", link);
           
            // //extract all urls
            // var urlsArr = $('a');
            // var urlEle;
            // for (urlEle in urlsArr) {
            //     console.log ( urlsArr[urlEle].href );
            // }

           // console.log("$(this).attr('href').length",$(this).attr('href').length + "i value is:" , i);
            
            if($(this).attr('href').length > 0) { 
              _links.push($(link).attr('href'));  
            }
            
          //console.log($(this).attr('href').length);
          
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
