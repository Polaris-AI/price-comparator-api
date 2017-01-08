## Price Comparator API
#### Compare product prices across various e-commerce platform and get their prices and relevant recommendations based on it's price and their specifications

Sample Request `sampleRequest.json`
```
{
  "query": "iphone 6"
}
```

Sample Response `sampleResponse.json`

```
{
  "name": "Apple iPhone 6 Plus (Gold, 16 GB)",
  "default": {
    "vendor": "Shopclues",
    "price": "40499",
    "url": "http://www.shopclues.com/apple-iphone-6-plus-16gb-3.html"
  },
  "allPrices": [
    {
      "vendor": "Shopclues",
      "price": "40499",
      "url": "http://www.shopclues.com/apple-iphone-6-plus-16gb-3.html"
    },
    {
      "vendor": "Infibeam",
      "price": "42499",
      "url": "http://www.infibeam.com/Mobiles/apple-iphone-6-plus/P-mobi-60840361012-cat-z.html"
    },
    {
      "vendor": "Flipkart",
      "price": "44999",
      "url": "http://dl.flipkart.com/dl/apple-iphone-6-plus/p/itme7zgymhjqjccq?pid=MOBEYGPZZV9GQWZZ&affid=vineetcom"
    },
    {
      "vendor": "Amazon",
      "price": "45000",
      "url": "http://www.amazon.in/gp/product/B00O4WU7GM/ref=asc_df_B00O4WU7GM34167404/?tag=ihre_partner_id&creative=165953&creativeASIN=B00O4WU7GM&linkCode=df0"
    },
    {
      "vendor": "Snapdeal",
      "price": "54000",
      "url": "http://www.snapdeal.com/product/apple-iphone-6-plus-16/76903694"
    }
  ]
}
```

Sample Recommendations Response

For full object view `sampleRecommendationResponse.json`
```
[
  "title": "LG G3 Flagship 16GB Metallic Black",
  "title": "Sony Xperia Z5 Premium (Chrome, 32 GB)",
  "title": "Sony Xperia Z5 Dual (Gold, 32 GB)",
  "title": "Sony Xperia Z5 Premium (Chrome, 32 GB)",
  "title": "Sony Xperia Z5 Dual (Graphite Black, 32 GB)",
]
```
