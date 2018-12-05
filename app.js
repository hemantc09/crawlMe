var express = require("express");
var app = express();
var cheerio = require('cheerio');
var url = require('url').url;
var $ = require('jquery');
var url1;
var request = require("request");
var bodyparser = require("body-parser");
//for the flash messages
var flash = require('connect-flash');
var _links, _alt, _imgSrc, _marketsBuilder;
var market = null;
var _EmailVersions = null;
var markets = [ "cg" , "ct", "dp" , "hc", "la", "ny", "mc", "os", "sd", "ss", "vp" ];

//console.log("markest[0]:" , markets[0]);


//important to get the data from the user to parse it
app.use(bodyparser.urlencoded({extended: true}));

app.set("view engine","ejs");
//set up the by default directory
app.use(express.static(__dirname + "/public"));

//=-==============
// using for flash messages
// app.use(flash());
// // for the flsah messages 
// app.use(function(req, res, next){
//   res.message = req.flash("error");
//   next();
// });

// app.configure(function() {
  // app.use(express.cookieParser('keyboard cat'));
  // app.use(express.session({ cookie: { maxAge: 60000 }}));
  // app.use(flash());
// });


//==================
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
      _marketsBuilder =  new Array();
      _EmailVersions = new Array();
      
      // url1 = "https://www.google.com"
      request(url1,function(error,response,body){
         // Print the response status code if a response was received
        console.log("statusCode:", response && response.statusCode);
        // console.log("error",error);
        console.log("User entered URL", url1);
        
        if(!error && response.statusCode == 200){
          $ = cheerio.load(body);
          // console.log(body);
          var links = $('a'); //jquery get all hyperlinks
          
          
          
          //select by class name for the nav top;
          _marketsBuilder = getBuilderLinks();
          
          // reviewer=cg&view=preview&
          
          
          for(var i = 0; i < _marketsBuilder.length ; i++) {
            
            //console.log("\n" + i + ">", _marketsBuilder[i] + "\n");
            var m = markets[i];
            
            for(var j = 0 , count = 1; j < _marketsBuilder.length ; j++, count++) {
              var buildEmailVersionUrl = null;
              //assign 0  to 0 first version
               buildEmailVersionUrl = _marketsBuilder[i];
              //replace the URL string with the & to build the version URL 1.
              
              
            //  console.log("m: and j: " + m +","+ i);
              
               buildEmailVersionUrl = buildEmailVersionUrl.replace("reviewer="+ m +"&view=preview&", "&");
               buildEmailVersionUrl = buildEmailVersionUrl.replace("version=1","version="+ count);
               console.log("buildEmailVersionUrl: " + count , buildEmailVersionUrl);
              //console.log("_EmailVersions[i]: ", _EmailVersions[j]);
              //===============
              
              
              
        // request(buildEmailVersionUrl,function(error,response,body){
        //   // Print the response status code if a response was received
        //   console.log("statusCode:", response && response.statusCode);
        //   // console.log("error",error);
        //   console.log("User entered URL", url1);
          
        //   if(!error && response.statusCode == 200){
            $ = cheerio.load(body);
            // console.log(body);
            var links = $('a'); //jquery get all hyperlinks
            
           // getAtagLinks(links);
            //important
            var  Objlink = getImageLinks();
            //important
            res.render("routes/links",{Objlink: Objlink});
            
        //   }else{
        //     //res.redirect("/");
        //     console.log("not a valid emial version url");
            
        // }
        // });
              
              
              
              
              
              
              
              
              
              
              //===============
              
            
        
            }
          }
          //======
          
        //get the atag links important
        //getAtagLinks(links);
        //important
        //var  Objlink = getImageLinks();
        //important
        // res.render("routes/links",{Objlink: Objlink});
        
        
        
        }
        
        else {
          // req.flash("error", "Please enter valid URL. See example below");
          res.redirect("/");
          console.log("Please enter valid URL");
        }
  });
});

function getImageLinks (){
  
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
    return Objlink;
    
}

function getAtagLinks(links) {
  
  // $ = cheerio.load(body);
  //         // console.log(body);
  //     var links = $('a'); //jquery get all hyperlinks
          
          
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
}

function getBuilderLinks () {
    //==========
          //get the top header links only
          
          //by class name user the . 
          
          var nav_top = $('.nav_top');
          
         // console.log("nav_top", nav_top);
          
          //get the individual market builder
          var index = 1 ;
          $(nav_top).each(function(){
            
            var marketBuilderURL = $(this).attr('href');
            
            
            
             if(marketBuilderURL.startsWith('/')){
                 //push secure link
                marketBuilderURL = marketBuilderURL.replace("/", "http://troncdev.com/");
                _marketsBuilder.push(marketBuilderURL)
                 //console.log(index++ +":", marketBuilderURL);
              }else{
                // push http link
                 _marketsBuilder.push(marketBuilderURL);
                 
                // console.log(" not // link ", link);
              }
   
           // console.log('attr',marketBuilderURL);
          });
          return _marketsBuilder;
}
  
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("URL server started");
});
