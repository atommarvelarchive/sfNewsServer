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
                console.log(source.url+" loaded");
                saveData(source, parser.parse(source.domain, html));
            }
        });
    }

    function saveData(source, parsed){
        data[source.domain].data = parsed;
    }

    this.refreshAll = refreshAll;
    this.data = data;
    return this;
};
