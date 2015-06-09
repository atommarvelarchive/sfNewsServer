var cheerio = require('cheerio'),
    sources = require('./sources.js'),
    Story = require('./story.js');

function parse(domain, data){
    switch(domain){
        case sources.sfusualsuspects.domain:
            return usualSuspects(data);
            break;
        default:
            return rss(data)
    }
}

function usualSuspects(data){
    var $ = cheerio.load(data),
        stories = $(".block"),
        results = [];

    stories.each(function(){
        var title = $(this).find(".link").first().text().trimLeft().trimRight();
        var url = $(this).find(".link").first().attr("href");
        var desc = $(this).find(".extract").first().text().replace(/.*more/g,"").trimRight().trimLeft();
        var img = $(this).find(".img-responsive").first().attr("src");
        var src = sources.sfusualsuspects.domain;
        results.push(new Story(title, url, desc, img, src));
    });
    return results;
}

function sfist(data){
    var $ = cheerio.load(data),
        stories = $(".item"),
        results = [];

    stories.each(function(){
        var title = $(this).find(".header").first().text();
        var url = $(this).find(".asset-more-link").first().attr("href");
        var desc = $(this).find("span").first().text();
        var img = $(this).find("img").first().attr("src").replace("_restrict_width_110","");
        var src = sources.sfist.domain;
        results.push(new Story(title, url, desc, img, src));
    });
    return results;
}

function rss(data){
    parser.parseString(data, options, function(err, articles){
        debugger;
        console.log(articles);
    }); 
}

exports.parse = parse;
