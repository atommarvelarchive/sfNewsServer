var cheerio = require('cheerio'),
    request = require('request');

module.exports = function(title, url, desc, src, img, date, comments, meta){
    var trim = 140;

    function stringTrim(str, trim){
        if(!str || 0 === str.length) return "";
       var concat = "...";
       if(str.length > trim-concat.length){
           return str.slice(0,trim-concat.length)+concat;
       }else{
        return str;
       }
    }

    // TODO: add getDesc into getImg and rename to something like 'getMetaData'

    function getImg(callback){
        var self = this;
        // TODO: fix whatever is making some img to not be properly populated
        if(this.img === ""){
            request(self.url, function (error, response, html) {
                if (!error && response.statusCode == 200) {
                    var $ = cheerio.load(html),
                        og = $('head > meta[property="og:image"]'),
                        twitter = $('head > meta[name="twitter:image:src"]');
                    //TODO: make twitter higher priority than og
                    if(og.length > 0){
                        var url = og.first().attr("content");
                        if(!(/http/).test(url)){
                            url = og.eq(1).attr("content");
                        }
                        self.img = url;
                    }else if(twitter.length > 0){
                        var url = twitter.first().attr("content");
                        if(!(/http/).test(url)){
                            url = twitter.eq(1).attr("content");
                        }
                        self.img = url;
                    }else{
                        console.log(self.url + " does not have a social image");
                        if(self.url.indexOf("7x7.com") !== -1){
                            self.img = $("#content").find("img").first().attr("src");
                        }
                    }
                } else{
                    console.log("failed to load for img: "+self.url);
                }
            });
        }
        callback(self);
    }

    this.title = title;
    this.url = url;
    this.desc = stringTrim(desc, trim);
    this.src = src || "";
    this.img = img || "";
    this.getImg = getImg;
    if(comments){
        this.comments = comments;
    }
    if(meta){
        this.meta = meta;
    }
    return this;
}
