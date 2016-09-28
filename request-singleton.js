const fetchCap = 5,
      request = require('request'),
      requestQueue = [[],[],[],[],[],[],[],[],[],[],],
      currentRequests = [];
var fetchCount = 0;


class RequestSingleton {
    static addToQueue(url, priority = 3) {
        return new Promise((resolve, reject) => {
            debugger;
            requestQueue[priority].push(new RequestPromise(url, resolve, reject));
            RequestSingleton.runQueue();
        });
    }

    static runQueue() {
        if (currentRequests.length < fetchCap) {
            for (let i = 0; i < requestQueue.length; i++) {
                for (let j = 0; j < requestQueue[i].length; j++) {
                    var req = requestQueue[i][j];
                    requestQueue[i].splice(j, 1);
                    currentRequests.push(req);
                    req.exec();
                    break;
                }
            }
        }
    }
}

class RequestPromise {
    constructor(url, resolve, reject) {
        this.url = url;
        this.resolve = resolve;
        this.reject = reject;
    }

    exec() {
        console.log("req: \t\t"+this.url);
        request(this.url, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                console.log("200 OK \t\t "+this.url);
                this.resolve([response, html]);
            } else {
                console.log("request failed \t\t"+this.url);
                this.reject(error);
            }
            var indexOf = currentRequests.indexOf(this);
            currentRequests.splice(indexOf, 1);
            RequestSingleton.runQueue();
        });
    }
}

module.exports = RequestSingleton;
