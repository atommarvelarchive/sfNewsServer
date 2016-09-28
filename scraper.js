module.exports = function(data){
    var parser = require('./parser'),
        feeds = require('./feeds.json'),
        RequestSingleton = require('./request-singleton');
    fetchCount = 0,
    fetchCap = 5,
    data = feeds;

    function refreshAll(){
        for(feed in feeds){
            scrape(feeds[feed]);
        }
    }

    function scrape(source){
        console.log("queue scraping "+source.url);
        RequestSingleton.addToQueue(source.url)
        .then((results) => {
            var [response, html] = results;
            parser.parse(source.domain, html, saveData.bind(this, source));
        })
        .catch((error) => {
            console.log(error);
        });
    }

    function saveData(source, parsed){
        data[source.domain].stories = [];
        for(var i = 0; i<parsed.length; i++){
            parsed[i].getMetaData(function(story){
                data[source.domain].stories.push(story);
            });
        }
        console.log(source.url+" loaded");
        fetchCount--;
    }

    function refresh(source){
        if(fetchCount < fetchCap){
            scrape(source);
        } else{
            setTimeout(refresh.bind(this,source), 500);
        }
    }

    this.refreshAll = refreshAll;
    this.refresh = refresh;
    this.data = data;
    this.scrape = scrape;
    return this;
};
