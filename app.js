
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
        
        if(!error && response.statusCode == 200){
          // console.log("status code" + response.statusCode + "errocode:"+ error);  
          $ = cheerio.load(body);
          var links = $('a'); //jquery get all hyperlinks
          $(links).each(function(i, link){
          _links.push($(link).attr('href'));
          });
           $('img[alt]').each(function() {
             _imgSrc.push([$(this).attr('src'), $(this).attr('alt')]); /* get src and alt for images with alt attribute */
             //console.log($(this).attr('src'));
             //console.log($(this).attr('alt'));
           });
  
        
          var Objlink = {
              arrLinks:  _links,
              _imgSrc: _imgSrc,
              url1: url1
          }
            res.render("routes/links",{Objlink: Objlink});
        } else {
          console.log("Please enter valid URL");
        }
  });
})
  
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("URL server started");
});
