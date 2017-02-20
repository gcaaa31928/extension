
var XPath = {};

XPath.getString = function (query, root) {
        root = root || document;
        return document.evaluate(query ,root, null, XPathResult.STRING_TYPE, null).stringValue;
};

XPath.getCoordInt = function (query, root) {
        root = root || document;
        var str = XPath.getString(query, root);
        if (str == '')
                return 0;
        return parseInt(str.match(/[\-]/).toString()+str.match(/[0-9]+/).toString());
};

XPath.getInt = function (query, root) {
        root = root || document;
        var str = XPath.getString(query, root);
        if (str == '')
                return 0;
        return parseInt(str.match(/[\-]?[0-9]+/).toString());
};

XPath.getNodes = function (query, root) {
        root = root || document;
        var res = new Array();
        var itr = document.evaluate(query ,root, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        var node = itr.iterateNext();
        while (node) {
                res.push(node);
                node = itr.iterateNext();
        }
        return res;
};

XPath.getNode = function (query, root) {
        root = root || document;
        return document.evaluate(query ,root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
};

var Comm={};

Comm.invoke = function(callback, funcName) {
        var params = new Array();
        for (var i=2; i < arguments.length; ++i)
                params.push(arguments[i]);

        chrome.extension.sendRequest({'funcName': funcName, 'params': params},
                function (res) { if (callback) callback(res.returnValue); });
};

Comm.register = function (funcName, func) {
        chrome.extension.onRequest.addListener(
        function(req, sender, sendResponse) {
                if (funcName != req.funcName)
                        return;
                paramsString = '';
                for (var i=0; i < req.params.length; ++i)
                        paramsString += ', req.params['+i+']';
                if (paramsString != '')
                        paramsString = paramsString.substring(2);
                callStr = 'func('+paramsString+')';
                returnValue = eval(callStr);
                sendResponse({'returnValue': returnValue});
        });
};

Comm.reload = function() {
        //alert('publishing '+eventName);
        //chrome.tabs.update({url:"http://ts4.travian.hk/*"});
        /*
        chrome.tabs.query({
                'url' : "http://ts4.travian.hk/*"
        },function(tabs){
                for (var i=0; i < tabs.length; ++i) {
                        chrome.tabs.reload(tabs.id);
                }
        });*/
};

Comm.publish = function(eventName, value) {
        //alert('publishing '+eventName);
        chrome.tabs.getAllInWindow(null, function(tabs) {
                for (var i=0; i < tabs.length; ++i) {
                        chrome.tabs.sendRequest(tabs[i].id, {'eventName': eventName, 'value': value});
                }
        });
};

Comm.subscribe = function (callback, eventName) {
        //alert('subscribing to '+eventName);
        var listener = function(req, sender, sendResponse) {
                if (eventName == req.eventName) {
                        chrome.extension.onRequest.removeListener(listener);
                        callback(eventName, req.value);
                        sendResponse({});
                }
        };
        chrome.extension.onRequest.addListener(listener);
        
};


Comm.test = function() {
        alert('util test');
};

var Util = {};



Util.seconds2TimeString = function (secs) {
        var s = secs % 60;
        var m = parseInt(secs / 60) % 60;
        var h = parseInt(secs / 3600);
        if (s < 10)
                s = "0"+s;
        if (m < 10)
                m = "0"+m;
        return h+":"+m+":"+s;
};
Util.timeString2Seconds = function (ts) {
        var h = parseInt(ts.split(':')[0]);
        var m = parseInt(ts.split(':')[1]);
        var s = parseInt(ts.split(':')[2]);
        return h*3600 + m*60 + s;
};

Util.getURLQuery = function (url) {
        var q = url.toString().split('?');
        if (q.length > 1)
                q = q[1].split("#")[0];
        var pairs = q.split('&');
        var res = new Object();
        for (var i=0; i < pairs.length; ++i) {
                var key = pairs[i].split('=')[0];
                var val = pairs[i].split('=')[1];
                res[key] = val;
        }
        return res;
};

Util.PadLeft=function(str,lengtht){
        if(str.length>=lengtht)return str;
        else return Util.PadLeft("0"+str.length,lengtht);
}

