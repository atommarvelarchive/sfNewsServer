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

    function isHtmlResponse(response) {
        debugger;
        if (!response.headers["content-type"].includes("text/html")) {
            console.log("this item has content-type "+response.headers["content-type"]);
            return false;
        }
        return true;
    }

    function getMetaData(callback){
        var self = this;
        if(!self.url) return;
        // TODO: fix whatever is making some img to not be properly populated
        //console.log("getting Metadata for"+this.url);
        request(self.url, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                var isHtml = isHtmlResponse(response);
                if(isHtml && self.img === ""){
                    getImg.apply(self, [html]);
                }
                if (isHtml && self.desc === ""){
                    getDesc.apply(self, [html]);
                }
            } else{
                //console.log("failed to load for meta data: "+self.url);
            }
        });
        callback(self);
    }

    function getImg(html) {
        //console.log("getting Img for "+this.url);
        var $ = cheerio.load(html),
            og = 'head > meta[property="og:image"]',
            twitter = 'head > meta[name="twitter:image"]',
            twitterSrc = 'head > meta[name="twitter:image:src"]';
        if($(twitter).length > 0){
            var url = $(twitter).first().attr("content");
            if(!(/http/).test(url)){
                url = $(twitter).eq(1).attr("content");
            }
            this.img = url;
        }else if($(twitterSrc).length > 0){
            var url = $(twitterSrc).first().attr("content");
            if(!(/http/).test(url)){
                url = $(twitterSrc).eq(1).attr("content");
            }
            this.img = url;
        }else if($(og).length > 0){
            var url = $(og).first().attr("content");
            if(!(/http/).test(url)){
                url = $(og).eq(1).attr("content");
            }
            this.img = url;
        }else{
            //console.log(this.url + " does not have a social image");
            if(this.url.indexOf("7x7.com") !== -1){
                this.img = $("#content").find("img").first().attr("src");
            }
        }
    }

    function getDesc(html) {
        //console.log("getting Desc for "+this.url);
        var $ = cheerio.load(html),
            og = $('head > meta[property="og:description"]'),
            twitter = $('head > meta[name="twitter:description"]');
        if(twitter.length > 0){
            var desc = twitter.first().attr("content");
            this.desc = stringTrim(desc, trim);
        }else if(og.length > 0){
            var desc = og.first().attr("content");
            this.desc = stringTrim(desc, trim);
        }else{
            //console.log(this.url + " does not have a social description");
        }
    }

    this.title = title;
    this.url = url;
    this.desc = stringTrim(desc, trim);
    this.src = src || "";
    this.img = img || "";
    this.getMetaData = getMetaData;
    if(comments){
        this.comments = comments;
    }
    if(meta){
        this.meta = meta;
    }
    return this;
}
