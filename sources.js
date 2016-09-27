sf = {
    'sfusualsuspects': {
        url : "http://www.sfusualsuspects.com/",
        tags : ["SF", "Politics"],
        domain: "sfusualsuspects",
        name: "The Usual Suspects"
    },
    'sfist': {
        url : "http://feeds.gothamistllc.com/SFist",
        tags : ["SF"],
        domain: "sfist",
        name: "sfist"
    },
    'sfgate': {
        url : "http://www.sfgate.com/bayarea/feed/Bay-Area-News-429.php",
        tags : ["SF"],
        domain: "sfgate",
        name: "SFGate"
    },
    'sfweekly': {
        url : "http://www.sfweekly.com/sanfrancisco/Rss.xml?section=2124627",
        tags : ["SF"],
        domain: "sfweekly",
        name: "SF Weekly"
    }
}

technology = {
    'redditTech':{
        url : "http://www.reddit.com/r/algorithms+analytics+androiddev+entrepreneur+webdev+web_design+computerscience+reactjs+javascript+frontend+css/.json?limit=100",
        tags : ["tech"],
        domain: "redditTech",
        name: "Reddit Tech"
    },
    'news.ycombinator': {
        url : "https://news.ycombinator.com/rss",
        tags : ["tech"],
        domain: "news.ycombinator",
        name: "Hacker News"
    },
    'dzone': {
        url : "http://feeds.dzone.com/home",
        tags : ["tech"],
        domain: "dzone",
        name: "DZone"
    },
    'echojs': {
        url : "http://www.echojs.com/rss",
        tags : ["tech", "javascript", "html5", "front-end"],
        domain: "echojs",
        name: "Echo JS"
    },
    'lobsters': {
        url : "https://lobste.rs/rss",
        tags : ["tech"],
        domain: "lobsters",
        name: "Lobsters"
    },
    'slashdot': {
        url : "http://rss.slashdot.org/slashdot/slashdotMain?format=xml",
        tags : ["tech"],
        domain: "slashdot",
        name: "Slashdot"
    },
    'soylentnews': {
        url : "https://soylentnews.org/index.rss",
        tags : ["tech"],
        domain: "soylentnews",
        name: "Soylent News"
    },
    "cocoawithlove": {
        url: "http://www.cocoawithlove.com/feed.xml",
        tags: ["tech", "iOS"],
        domain: "cocoawithlove",
        name: "Cocoa with Love"
    },
    "iosdevweekly": {
        url: "http://iosdevweekly.com/issues.rss",
        tags: ["tech", "iOS"],
        domain: "iosdevweekly",
        name: "iOS Dev Weekly"
    }
};
var sources = {};

for(var source in sf){
    sources[source] = sf[source];
}
for(var source in technology){
    sources[source] = technology[source];
}

module.exports = sources;


later = {
    'hoodline': {
        url : "http://feeds.hoodline.com/",
        tags : ["SF"],
        domain: "hoodline",
        name: "Hoodline"
    },
    '7x7': {
        url : "[this rss is outdated]http://feeds.feedburner.com/7x7/bjKm?format=xml",
        tags : ["SF"],
        domain: "7x7",
        name: "7x7"
    },
    'datatau': {
        url : "http://www.datatau.com/rss",
        tags : ["tech", "data"],
        domain: "datatau",
        name: "DataTau"
    }
};
