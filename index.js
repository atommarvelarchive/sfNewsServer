var data = {};
    express = require('express'),
    sources = require('./sources.js'),
    scraper = require('./scraper.js')(data),
    app = express();
    require('events').EventEmitter.prototype._maxListeners = 100;

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(scraper.data, null, 4));
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

//TODO: Schedule scraping
scraper.scrape(sources["iosdevweekly"]);
//scraper.refreshAll();
