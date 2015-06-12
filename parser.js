var cheerio = require('cheerio'),
    sources = require('./sources.js'),
    Story = require('./story.js');

function parse(domain, data, callback){
    switch(domain){
        case sources.sfusualsuspects.domain:
            usualSuspects(data, callback);
            break;
        case sources['7x7'].domain:
            rss(data, function(parsed){
                massage7x7(parsed,callback);
            })
            break;
        case sources.sfist.domain:
            rss(data, function(parsed){
                massageSfist(parsed,callback);
            })
            break;
        case sources.sfweekly.domain:
            rss(data, function(parsed){
                massageSfweekly(parsed,callback);
            })
            break;
        case sources.sfgate.domain:
            rss(data, function(parsed){
                massageSfgate(parsed,callback);
            })
            break;
        default:
            rss(data, callback)
    }
}

function usualSuspects(data, callback){
    var $ = cheerio.load(data),
        stories = $(".block"),
        results = [];

    stories.each(function(){
        var title = $(this).find(".link").first().text().trimLeft().trimRight();
        var url = $(this).find(".link").first().attr("href");
        var desc = $(this).find(".extract").first().text().replace(/.*more/g,"").trimRight().trimLeft();
        var src = sources.sfusualsuspects.domain;
        var img = $(this).find(".img-responsive").first().attr("src");
        results.push(new Story(title, url, desc, src, img));
    });
    callback(results);
}

//TODO: add hoodline support
function hoodline(data, callback){
}

function massage7x7(stories, callback){
    var results = [];
    for(var i = 0; i < stories.length; i++){
        var cur = stories[i],
            $ = cheerio.load("<body>"+cur.summary+"</body>"),
            title = cur.title,
            url = cur.url,
            desc = $("body").text().substring(0,137)+"...";
            src = sources.sfist.domain,
            img = $("img").first().attr("src");
            debugger;
        results.push(new Story(title, url, desc, src, img));
    }
    callback(results);
}

function massageSfweekly(stories, callback){
    var results = [];
    for(var i = 0; i < stories.length; i++){
        var cur = stories[i],
            $ = cheerio.load("<body>"+cur.summary+"</body>"),
            title = cur.title,
            url = cur.url,
            desc = $("body").text().replace(" [ Read more ] [ Subscribe to the comments on this story ]",""),
            src = sources.sfist.domain,
            img = $("img").first().attr("src");
        results.push(new Story(title, url, desc, src, img));
    }
    callback(results);
}

//TODO gneral desc char limit

function massageSfist(stories, callback){
    var results = [];
    for(var i = 0; i < stories.length; i++){
        var cur = stories[i],
            $ = cheerio.load("<body>"+cur.summary+"</body>"),
            title = cur.title,
            url = cur.guid.link,
            desc = $("body").text().replace(" [ more › ]",""),
            src = sources.sfist.domain,
            img = $("img").first().attr("src").replace("_restrict_width_110","");
        results.push(new Story(title, url, desc, src, img));
    }
    callback(results);
}

function massageSfgate(stories, callback){
    var results = [];
    for(var i = 0; i < stories.length; i++){
        var cur = stories[i],
            title = cur.title,
            url = cur.guid.link,
            desc = cur.summary,
            src = sources.sfgate.domain,
            img = "";
        results.push(new Story(title, url, desc, src, img));
    }
    callback(results);
}

function rss(data, callback){
    parser.parseString(data, {}, function(err, articles){
        callback(articles.items);
    }); 
}

exports.parse = parse;
