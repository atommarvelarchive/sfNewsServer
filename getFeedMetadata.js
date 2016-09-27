var cheerio = require('cheerio'),
    request = require('request'),
    URL = require('url-parse');
    fs = require('fs');
    requestsFinished = 0;
    result = {};

var feeds = [
    "http://feeds.feedburner.com/typepad/alleyinsider/silicon_alley_insider",
    "http://feeds2.feedburner.com/businessinsider",
    "http://www.businessinsider.com/careers.rss",
    "http://feeds.feedburner.com/cfo-insider",
    "http://www.businessinsider.com/education.rss",
    "http://www.businessinsider.com/enterprise.rss",
    "http://feeds.feedburner.com/clusterstock?format=xml",
    "http://feeds.feedburner.com/TheMoneyGame",
    "http://feeds.feedburner.com/businessinsider/politics",
    "http://www.businessinsider.com/category/bi-graphics.rss",
    "http://feeds.feedburner.com/businessinsider/yourmoney",
    "http://www.businessinsider.com/wealthadvisor.rss",
    "http://feeds.feedburner.com/businessinsider/travel",
    "http://feeds.feedburner.com/businessinsider/warroom",
    "http://www.businessinsider.com/warroom/small-business.rss",
    "http://feeds.feedburner.com/businessinsider/science",
    "http://www.businessinsider.com/latest.rss",
    "https://www.raywenderlich.com/feed",
    "http://feeds.feedburner.com/GDBcode",
    "http://feeds.feedburner.com/OfficialAndroidBlog",
    "http://www.androidhive.info/feed/",
    "http://us2.campaign-archive1.com/feed?u=887caf4f48db76fd91e20a06d&id=4eb677ad19",
    "https://androiduiux.com/feed/",
    "http://feeds2.feedburner.com/tympanus",
    "http://500.co/feed/",
    "https://bothsidesofthetable.com/feed",
    "http://feeds.feedburner.com/codinghorror",
    "http://feeds.feedblitz.com/daedtech/www",
    "https://feeds.feedblitz.com/scotch_io",
    "http://feeds.feedburner.com/StylingAndroid",
    "https://commonsware.com/blog/feed.atom",
    "http://jakewharton.com/feed.xml",
    "http://stacktips.com/feed",
    "https://medium.com/feed/@jpardogo",
    "http://gmariotti.blogspot.com/feeds/posts/default?alt=rss",
    "https://www.producthunt.com/feed",
    "https://blog.risingstack.com/rss/",
    "http://stackabuse.com/rss/",
    "https://indieiosfocus.curated.co/issues.rss",
    "http://mobilewebweekly.co/rss/1mipnin1",
    "https://feeds.feedburner.com/realmio",
    "https://reactjs.co/feed/",
    "http://techblog.netflix.com/rss.xml",
    "https://changelog.com/feed/",
    "http://us9.campaign-archive1.com/feed?u=510d6f81b948a39e0d9c32ec3&id=7b3139f09c",
    "http://nodeweekly.com/rss/1mp9kce3",
    "https://www.joyent.com/blog/feed",
    "https://nodesource.com/blog/rss/",
    "http://javascriptweekly.com/rss/1nk15gj7",
    "http://html5weekly.com/rss/1binbh86",
    "http://react.statuscode.com/rss/1i3k3bah",
    "https://www.reddit.com/r/virtualreality.rss",
    "https://ww2.kqed.org/news/feed/",
    "http://www.npr.org/rss/rss.php?id=1001",
    "http://www.npr.org/rss/rss.php?id=1003",
    "http://www.npr.org/rss/rss.php?id=1019",
    "http://www.npr.org/rss/rss.php?id=1015",
    "http://www.npr.org/rss/rss.php?id=327351768",
    "http://www.npr.org/rss/rss.php?id=1013",
    "http://www.npr.org/rss/rss.php?id=1014",
    "http://www.npr.org/rss/rss.php?id=1004",
    "http://www.npr.org/rss/rss.php?id=139941248",
    "http://www.npr.org/rss/rss.php?id=1128",
    "http://www.npr.org/rss/rss.php?id=103943429",
    "https://blog.hackerrank.com/feed/",
    "http://feeds.gothamistllc.com/SFist",
    "http://www.sfgate.com/bayarea/feed/Bay-Area-News-429.php",
    "http://www.sfweekly.com/sanfrancisco/Rss.xml?section=2124627",
    "https://news.ycombinator.com/rss",
    "http://feeds.dzone.com/home",
    "http://www.echojs.com/rss",
    "https://lobste.rs/rss",
    "http://rss.slashdot.org/slashdot/slashdotMain?format=xml",
    "https://soylentnews.org/index.rss",
    "http://www.cocoawithlove.com/feed.xml",
    "http://iosdevweekly.com/issues.rss",
    "http://www.cimgf.com/feed/",
    "http://feeds.feedburner.com/cocoacontrols",
    "https://oleb.net/blog/atom.xml",
    "https://developer.apple.com/swift/blog/news.rss"
];


function getMetaData(url) {
  request(url, function (error, response, xml) {
    var feed = {};
    feed.url = url;
    if (!error && response.statusCode == 200) {
      console.log("got a response for " + url);
      var $ = cheerio.load(xml, {xmlMode: true});
      feed.src = $("channel > link").text();
      if (!feed.src || 0 === feed.src.length) {
        
      }
      feed.name = $("channel > title").text();
      feed.desc = $("channel > description").text();
      feed.domain = new URL(feed.src).hostname;
      if (!feed.domain || 0 === feed.domain.length) {
        feed.domain = new URL(feed.url).hostname;
      }
      result[feed.domain] = feed;
    } else {
      console.log("request failed for " + url);
      result[new URL(feed.url).hostname] = feed;
    }
    requestsFinished++;
  });
}

function saveToFile(data) {
  console.log("saving data...");
  fs.writeFileSync("feeds.json", JSON.stringify(result, null, 4));
}

function main() {
  for (var i = 0; i < feeds.length; i++) {
    getMetaData(feeds[i]);
  }
  setInterval(function () {
    if (requestsFinished === feeds.length) {
      requestsFinished++;
      saveToFile(result);
    }
  }, 1000);
}

main();
