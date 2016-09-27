module.exports = function(data){
    var parser = require('./parser.js'),
        sources = require('./sources.js'),
        request = require('request');
    fetchCount = 0,
    fetchCap = 1,
    data = sources;

    function refreshAll(){
        for(source in sources){
            refresh(sources[source]);
        }
    }

    function scrape(source){
        fetchCount++;
        console.log("scraping "+source.url);
        request(source.url, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                console.log("got feed for "+ source.url);
                parser.parse(source.domain, html, saveData.bind(this, source));
            } else{
                console.log(source.url + " didn't give a feed");
                console.log(error);
            }

        });
    }

    function saveData(source, parsed){
        data[source.domain].stories = [];
        for(var i = 0; i<parsed.length; i++){
            // TODO: queue this instead of firing all at once
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
