module.exports = function(data){
    var parser = require('./parser.js'),
        sources = require('./sources.js'),
        request = require('request');
    data = sources;

    function refreshAll(){
        for(source in sources){
            scrape(sources[source]);
        }
    }

    function scrape(source){
        request(source.url, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                parser.parse(source.domain, html, saveData.bind(this, source));
            }
        });
    }

    function saveData(source, parsed){
        data[source.domain].stories = [];
        for(var i = 0; i<parsed.length; i++){
            parsed[i].getImg(function(story){
                data[source.domain].stories.push(story);
            });
        }
        console.log(source.url+" loaded");
    }

    function refresh(source){
        scrape(source);
    }

    this.refreshAll = refreshAll;
    this.refresh = refresh;
    this.data = data;
    return this;
};
