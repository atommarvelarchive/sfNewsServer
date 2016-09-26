var cheerio = require('cheerio'),
    request = require('request'),
    sources = require('./sources.js'),
    Story = require('./story.js');

//TODO: publish time
//TODO: don't use rss, just use cheerio... rss missing a ton of stuff that would be nice

function parse(domain, data, callback){
    switch(domain){
        case sources.sfusualsuspects.domain:
            parseUsualSuspects(data, callback);
            break;
        case sources.sfist.domain:
            parseSfist(data,callback);
            break;
        case sources.sfweekly.domain:
            parseSfweekly(data,callback);
            break;
        case sources.sfgate.domain:
            parseSfgate(data, callback);
            break;
        case sources["redditTech"].domain:
            massageReddit(JSON.parse(data),callback);
            break;
        case sources["news.ycombinator"].domain:
            parseYcombinator(data, callback);
            break;
        case sources.dzone.domain:
            parseDzone(data, callback);
            break;
        case sources.echojs.domain:
            parseEchojs(data, callback);
            break;
        case sources.lobsters.domain:
            rss(data, function(parsed){
                massageLobsters(parsed, callback);
            })
            break;
        case sources.slashdot.domain:
            rss(data, function(parsed){
                massageSlashdot(parsed, callback);
            })
            break;
        case sources.soylentnews.domain:
            rss(data, function(parsed){
                massageSoylentnews(parsed, callback);
            })
            break;
        default:
            console.log("couldn't match a domain for "+domain);
            var defaultCallback = callback;
            rss(data, defaultCallback);
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

//TODO: add hoodline support
function hoodline(data, callback){
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

function parseSfweekly(xml, callback){
    console.log("parsing SFWeekly");
    defaultParser(xml, callback);
}

function parseSfist(xml, callback){
    console.log("parsing sfist");
    defaultParser(xml, callback);
}

function parseSfgate(xml, callback){
    console.log("parsing sfgate");
    defaultParser(xml, callback);
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

function parseYcombinator(xml,callback){
    console.log("parsing YCombinator");
    defaultParser(xml, callback);
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
        //TODO comments
        results.push(new Story(title, url, desc, src, img));
    }
    callback(results)
}

function parseDzone(xml,callback){
    var results = [];
    console.log("massaging dzone");
    defaultParser(xml, callback);
}

function parseEchojs(xml,callback){
    console.log("massaging echojs");
    defaultParser(xml, callback);
}

function massageLobsters(stories,callback){
    var results = [];
    console.log("massaging lobsters");
    debugger;
    for(var i = 0; i < stories.length; i++){
        var cur = stories[i];
            //$ = cheerio.load(cur),
            title = cur.title,
            url = cur.url,
            desc = cur.summary,
            src = sources.lobsters.domain,
            img = "";
        results.push(new Story(title, url, desc, src, img));
    }
    callback(results)
}

function massageSlashdot(stories,callback){
    var results = [];
    console.log("massaging slashdot");
    debugger;
    //TODO: don't use rss
    for(var i = 0; i < stories.length; i++){
        var cur = stories[i];
            //$ = cheerio.load(cur),
            title = cur.title,
            url = cur.url,
            desc = cur.selftext,
            src = sources.slashdot.domain,
            img = cur;
        results.push(new Story(title, url, desc, src, img));
    }
    callback(results)
}

function massageSoylentnews(stories,callback){
    var results = [];
    console.log("massaging soylentnews");
    debugger;
    //TODO: don't use rss
    for(var i = 0; i < stories.length; i++){
        var cur = stories[i];
            //$ = cheerio.load(cur),
            title = cur.title,
            url = cur.url,
            desc = cur.selftext,
            src = sources.soylentnews.domain,
            img = cur;
        results.push(new Story(title, url, desc, src, img));
    }
    callback(results)
}

function defaultParser(xml, callback) {
    var results = [],
        $ = cheerio.load(xml, {xmlMode: true});
    $("item").each(function(index, elem) {
        var title = $(elem).find("title").text().trim(),
            url = $(elem).find("link").text().trim();
            //desc = summary("body").text().replace(" [ more › ]",""),
            //src = sources.sfist.domain,
            //img = summary("img").first().attr("src").replace("_restrict_width_110","");
        results.push(new Story(title, url));
    });
    callback(results);
}

function rss(data, callback){
    debugger;
    /**
    parser.parseString(data, {}, function(err, articles){
        callback(articles.items);
    });
    */
}


exports.parse = parse;
