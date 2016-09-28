"use strict";
const cheerio = require('cheerio'),
    RequestSingleton = require('./request-singleton'),
    trim = 140;


class Story {
    constructor(title = "", url = "", desc = "", src = "", img = "", date = 0, comments = {}, meta = {}) {
        this.title = title;
        this.url = url;
        this.desc = this.stringTrim(desc, trim);
        this.src = src;
        this.img = img;
        this.date = date;
        this.comments = comments;
        this.meta = meta;
    }

    stringTrim(str, trim){
        if(!str || 0 === str.length) return "";
       var concat = "...";
       if(str.length > trim-concat.length){
           return str.slice(0,trim-concat.length)+concat;
       }else{
        return str;
       }
    }

    isHtmlResponse(response) {
        debugger;
        if (!response.headers["content-type"].includes("text/html")) {
            console.log("this item has content-type "+response.headers["content-type"]);
            return false;
        }
        return true;
    }

    getMetaData(callback){
        if(!this.url) return;
        // TODO:70 fix whatever is making some img to not be properly populated
        //console.log("getting Metadata for"+this.url);

        RequestSingleton.addToQueue(this.url)
        .then((results) => {
            var [response, html] = results;
            var isHtml = this.isHtmlResponse(response);
            if(isHtml && this.img === ""){
                this.getImg.apply(this, [html]);
            }
            if (isHtml && this.desc === ""){
                this.getDesc.apply(this, [html]);
            }
        })
        .catch((error) => {
            //console.log("failed to load for meta data: "+this.url);
        });
        callback(this);
    }

    getImg(html) {
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

    getDesc(html) {
        //console.log("getting Desc for "+this.url);
        var $ = cheerio.load(html),
            og = $('head > meta[property="og:description"]'),
            twitter = $('head > meta[name="twitter:description"]');
        if(twitter.length > 0){
            var desc = twitter.first().attr("content");
            this.desc = this.stringTrim(desc, trim);
        }else if(og.length > 0){
            var desc = og.first().attr("content");
            this.desc = this.stringTrim(desc, trim);
        }else{
            //console.log(this.url + " does not have a social description");
        }
    }
}

module.exports = Story;
