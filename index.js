var data = {};
    express = require('express'),
    sources = require('./sources.js'),
    scraper = require('./scraper.js')(data),
    parser = require('rssparser'),
    app = express();

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

scraper.refresh(sources['7x7']);
