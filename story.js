var cheerio = require('cheerio'),
    request = require('request');

module.exports = function(title, url, desc, src, img){
    var trim = 140;

    function stringTrim(str, trim){
       var concat = "...";
       if(str.length > trim-concat.length){
           return str.slice(0,trim-concat.length)+concat;
       }else{
        return str;
       }
    }

    function getImg(callback){
        var self = this;
        request(self.url, function (error, response, html) {
            var $ = cheerio.load(html),
                og = $('head > meta[property="og:image"]'),
                twitter = $('head > meta[name="twitter:image:src"]');
            if(og){
                self.img = og.attr("content");
            }else if(twitter){
                self.img = twitter.attr("content");
            }else{
            }
            callback(self);
        });
    }

    this.title = title;
    this.url = url;
    this.desc = stringTrim(desc, trim);
    this.src = src;
    this.img = "";
    this.getImg = getImg;
    return this;
}
