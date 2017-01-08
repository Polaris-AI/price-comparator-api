const scraperjs = require('scraperjs');
const express = require('express');
const axios = require('axios');
const app = express();
const bodyParser = require('body-parser');

const apiKey = '6PAb8Vsg1hR7boY9Zjg1nlMjiOiRUd4M';

app.use(bodyParser.json());

// POST method route
app.post('/find', function (req, res) {

    // Request
    let keywords = req.body.query;

    let url = buildUrl(keywords);

    crawl(url).then(function(data){
      res.send(data);
    }).
    catch(function(err) {
      res.send(err);
    });

});

// const preCheck = function(keywords){
//   if(keywords.match(/iphone/i) && keywords.match(/5s/i)){
//     return iphone;
//   } else if(keywords.match(/iphone 6/i) || keywords.match(/6s/i)){
//     return iphone6s;
//   } else if(keywords.match(/sennheiser/i) || keywords.match(/hd 180/i) || keywords.match(/black headphones/i)){
//     return headphones;
//   }  else if(keywords.match(/logitech/i) || keywords.match(/g400s/i)){
//     return logitech;
//   }
//   else {
//     return false;
//   }
// }
//
// const preCheckRec = function(keywords){
//   keywords = keywords.title;
//   if(keywords.match(/iphone/i) && keywords.match(/5s/i)){
//     return iphoneRec;
//   }
//   else if(keywords.match(/iphone 6/i) || keywords.match(/6s/i)){
//     return iphone6sRec;
//   } else if(keywords.match(/sennheiser/i) || keywords.match(/HD 180/i) || keywords.match(/black headphones/i)){
//     return headphonesRec;
//   }  else if(keywords.match(/logitech/i) || keywords.match(/g400s/i)){
//     return logitechRec;
//   }
//   else {
//     return false;
//   }
// }

const crawl = function(url) {

  return new Promise(function(resolve, reject){
    scraperjs.StaticScraper.create(url)
        .scrape(function($) {
            let nextUrl = $(".imagedropshadow > .block a").attr('href');
            return nextUrl;
        })
        .then(function(data) {
            return scrapProduct(data)
        })
        .then(function(data){
            resolve(data);
        })
        .catch((err) => {
            console.error("Something went wrong!", err);
            reject(err);
        });
  });

}

const buildUrl = function(keywords) {
  keywords = keywords.split(' ').join('+');
  return 'http://www.comparometer.in/search/' + keywords;
  console.log('Crawling: ' + url);
}

const scrapProduct = function(url) {

    return new Promise(function(resolve, reject){

        url = 'http:' + url;

        scraperjs.StaticScraper.create(url)
          .scrape(function($) {
              let title = $(".img_deatil_title > .title_deatil").text();

              let specsNodes = $(".pricelist_wrp1 .specTable").map(function() {

                  let specNode = [];

                  let specRows = $(this).find("tr").map(function(){
                      let specsKey = $(this).find(".specsKey").text();
                      let specsValue = $(this).find(".specsValue").text();
                      if (specsKey.length > 1) {
                        specNode.push({
                          key: specsKey,
                          value: specsValue
                        })
                      };
                  });

                  return specNode;
              }).get();

              let allPrices = $(".img_deatil3 > .store_icon").map(function() {

                  let hyperLink = $(this).find('a').attr('href');
                  let hyperLinkIndex = hyperLink.indexOf('http');
                  hyperLink = hyperLink.substring(hyperLinkIndex, hyperLink.length);

                  let str = $(this).find(".rupee_compare").text();
                  str = str.replace(/ /g,'').replace(/\s/g,'').replace(',','');
                  let atIndex = str.indexOf('At');
                  let vendor = str.substring(atIndex + 2, str.length);
                  let vendorDomainIndex = vendor.indexOf('.');
                  vendor = vendor.substring(0, vendorDomainIndex);
                  vendor = vendor.charAt(0).toUpperCase() + vendor.slice(1);
                  let price = str.substring(0, atIndex);

                  return {
                      // str: str,
                      vendor: vendor,
                      price: price,
                      url: hyperLink
                  };
              }).get();

              // Item object
              return {
                  title: title,
                  default: {
                      vendor: allPrices[0].vendor,
                      price: allPrices[0].price,
                      url: allPrices[0].url
                  },
                  allPrices: allPrices,
                  specs: specsNodes
              }
          })
          .then(function(data) {
              resolve(data);
          })
          .catch(function(err){
            reject(err);
          });
    });
}

function getRecommendations(categoryId, startPrice, endPrice) {

  var titles = [];

  return new Promise(function(resolve, reject) {

    axios.get('https://api.indix.com/v2/universal/products?countryCode=IN&' +
      'categoryId=' + categoryId +
      '&startPrice=' + startPrice +
      '&endPrice=' + endPrice +
      '&sortBy=MOST_RECENT&&app_key=' + apiKey).then(function(response) {

      response.data.result.products.forEach(function(product) {
        var title = product.title.replace(/\(*\)*\-*/g, '').replace(/\s\s/g, ' ').split(',')[0];
        if (titles.length < 5) {
          titles.push(title);
        }
      });

      resolve(titles);

    }).catch(function(err) {
      console.log(err);
      reject(err);
    });

  });

}

app.post('/recommendation', function(req, res) {

  // let allPricesLength = req.body.allPrices.length;
  //
  // let startPrice = req.body.allPrices[0].price;
  // let endPrice = req.body.allPrices[allPricesLength - 1].price;
  //
  // var requestBody = {
  //   title: req.body.title,
  //   startPrice: (startPrice * 0.8),
  //   endPrice: (endPrice * 1.2),
  // };

  axios.get('https://api.indix.com/v2/universal/products?countryCode=IN&q=' + req.body.title +'&&app_key=' + apiKey).then(function(response) {

    var categoryId = response.data.result.products[0].categoryId;

    return getRecommendations(categoryId, startPrice, endPrice);

  }).then(function(response) {

    let promises = [];
    let titles = response;

    titles.forEach(function(title){
      let url = buildUrl(title);

      promises.push(crawl(url));
    });

    Promise.all(promises)
    .then(function(data){
      //newResponse.push(data);
      res.send(data);
    })
    .catch(function(err){
      res.send(err);
    });

  }).catch(function(err) {
    console.log(err);
    return res.send(err);
  });

});

app.listen(3001, function () {
  console.log('Listening on port 3001')
});
