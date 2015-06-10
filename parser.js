var cheerio = require('cheerio'),
    sources = require('./sources.js'),
    Story = require('./story.js');

function parse(domain, data, callback){
    switch(domain){
        case sources.sfusualsuspects.domain:
            usualSuspects(data, callback);
            break;
        case sources.sfist.domain:
            rss(data, function(parsed){
                massageSfist(parsed,callback);
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

function massageSfist(stories, callback){
    var result = [];
    for(var i = 0; i < stories.length; i++){
        var cur = stories[i],
            $ = cheerio.load("<body>"+cur.summary+"</body>"),
            title = cur.title,
            url = cur.guid.link,
            desc = $("body").text().replace(" [ more › ]",""),
            src = sources.sfist.domain,
            img = $("img").first().attr("src").replace("_restrict_width_110","");
        result.push(new Story(title, url, desc, src, img));
    }
    callback(result);
}

function rss(data, callback){
    parser.parseString(data, {}, function(err, articles){
        callback(articles.items);
    }); 
}

exports.parse = parse;
