var cheerio = require('cheerio'),
    request = require('request'),
    sources = require('./sources.js'),
    Story = require('./story.js');

function parse(domain, data, callback){
    switch(domain){
        case sources.sfusualsuspects.domain:
            parseUsualSuspects(data, callback);
            break;
        case sources["redditTech"].domain:
            massageReddit(JSON.parse(data),callback);
            break;
        default:
            console.log("default parsing for: "+domain);
            var defaultCallback = callback;
            defaultParser(data, defaultCallback);
    }
}

function parseUsualSuspects(data, callback){
    console.log("usual suspects..");
    var $ = cheerio.load(data),
        stories = $(".block"),
        results = [];

    stories.each(function(){
        var title = $(this).find(".link").first().text().trimLeft().trimRight();
        var url = $(this).find(".link").first().attr("href");
        var desc = $(this).find(".extract").first().text().replace(/.*more/g,"").trimRight().trimLeft();
        var src = sources.sfusualsuspects.domain;
        var img = $(this).find(".img-responsive").first().attr("src");
        var story = new Story(title, url, desc, src, img)
        results.push(story);
    });
    callback(results);
}

function massage7x7(stories, callback){
    var results = [];
    console.log("massaging 7x7");
    for(var i = 0; i < stories.length; i++){
        var cur = stories[i],
            $ = cheerio.load(cur.summary),
            title = cur.title,
            url = cur.url,
            desc = $("body").text().substring(0,137)+"...";
            src = sources.sfist.domain,
            img = $("img").first().attr("src");
        results.push(new Story(title, url, desc, src, img));
    }
    callback(results);
}

function massageReddit(stories, callback){
    var results = [];
    console.log("massaging reddit");
    for(var i = 0; i < stories.data.children.length; i++){
        var cur = stories.data.children[i].data;
            title = cur.title,
            url = cur.url,
            desc = cur.selftext,
            src = "reddit.com/r/"+cur.subreddit,
            img = cur.thumbnail,
            date = cur.created,
            comments = "http://reddit.com"+cur.permalink;
        if(img === "self" || img === "default"){
            img = "https://www.redditstatic.com/icon.png";
        } else {
            img = "";
        }
        results.push(new Story(title, url, desc, src, img, date, comments));
    }
    callback(results);
}

function massageDatatau(stories,callback){
    var results = [];
    console.log("massaging datatau");
    debugger;
    for(var i = 0; i < stories.length; i++){
        var cur = stories[i];
            //$ = cheerio.load(cur),
            title = cur.title,
            url = cur.url,
            desc = "",
            src = sources.datatau.domain,
            img = "";
        results.push(new Story(title, url, desc, src, img));
    }
    callback(results)
}

function defaultParser(xml, callback) {
    var results = [],
        $ = cheerio.load(xml, {xmlMode: true});
    getItemOrEntry($).each(function(index, elem) {
        var title = $(elem).find("title").text().trim(),
            url = $(elem).find("link").text().trim();
        if(!url || 0 === url.length) {
            url = $(elem).find("link").attr("href");
        }
            // TODO:50 review all feeds
            // TODO:20 add description
            // TODO:30 add publish time
            //desc = summary("body").text().replace(" [ more › ]",""),
            //src = sources.sfist.domain,
            //img = summary("img").first().attr("src").replace("_restrict_width_110","");
        results.push(new Story(title, url));
    });
    callback(results);
}

function getItemOrEntry($) {
    var item = $("item");
    if (item.length > 0) {
        return item;
    } else {
        return $("entry");
    }
}

exports.parse = parse;
