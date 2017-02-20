var Background={};
var XHR = {}


XHR.lastDownload = 0;
XHR.timeoutId = null;
XHR.parser = new DOMParser();

XHR.host="http://ts4.travian.hk/";

XHR.getPage = function (suffix, params, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
                 if (xhr.readyState == 4 ) {
                        if(xhr.status=200){
                                //xml = XHR.parser.parseFromString(xhr.responseText, "text/xml");
                                xml = toDOM(xhr.responseText);
                                callback(xhr.status, xml);
                        }
                 }
        }
        xhr.open("GET", XHR.host+suffix, true);
        
        var sendRequest = function() {
                var now = new Date().getTime();
                if (now-XHR.lastDownload > 5000) {
                        xhr.send();
                        XHR.lastDownload = now;
                } else {
                        XHR.timeoutId = setTimeout(sendRequest, 1000);
                }
        }
        
        sendRequest();

}

XHR.sendPost = function (suffix,params,callback){
    var xhr=new XMLHttpRequest();
    xhr.onreadystatechange = function() {
             if (xhr.readyState == 4 ) {
                    if(xhr.status=200){
                            //xml = XHR.parser.parseFromString(xhr.responseText, "text/xml");
                            xml = toDOM(xhr.responseText);
                            callback(xhr.status, xml);
                    }
             }
    }
    xhr.open("POST",XHR.host+suffix,true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    //xhr.setRequestHeader("Content-length", params.length);
    //xhr.setRequestHeader("Connection", "close");
    var sendRequest = function() {
            var now = new Date().getTime();
            if (now-XHR.lastDownload > 5000) {
                    xhr.send(params);
                    XHR.lastDownload = now;
            } else {
                    XHR.timeoutId = setTimeout(sendRequest, 1000);
            }
    }
    
    sendRequest();
}


function toDOM(HTMLstring)
{
        var d = document.createElement('div');
        d.innerHTML = HTMLstring;
        /*
        var docFrag = document.createDocumentFragment();

        while (d.firstChild) {
        docFrag.appendChild(d.firstChild)
        };
        
        return docFrag;
        */
        return d;
}

function VillageManager(villageId) {
        this.villageId = villageId;  
        this.choose=0;     
}

VillageManager.prototype.navigateToVillage = function(onFinished) {
        XHR.getPage('dorf1.php?newdid='+this.villageId, null, onFinished);
}


VillageManager.prototype.runTQ = function(onFinished) { 
    DB.TrainQueue.top(this.villageId,function(row){
        var villageId = row.villageId;
        var slotId = row.slotId;
        var number = row.number;
        var troopId = row.troopId;
        //alert(level);
        console.log("Train slot "+slotId+" in village "+villageId);
        XHR.getPage('build.php?id='+slotId, null, function(status, page) {
                var form=XPath.getNode('//form[@name="snd"]',page);
                var id=XPath.getString('.//input[1]/@value',form);
                var z=XPath.getString('.//input[2]/@value',form);
                var a=XPath.getString('.//input[3]/@value',form);
                var s=XPath.getString('.//input[4]/@value',form);
                var max=0;
                var params="id="+id.toString()+
                    "&z="+z.toString()+
                    "&a="+a.toString()+
                    "&s="+s.toString();
                for(var i=1;i<13;i++){
                    var n = XPath.getNode('//*[@name="'+'t'+i.toString()+'"]', page);
                    if(n==null)continue;
                    if(i!=troopId)params+="&t"+i.toString()+"=0";
                    else {
                        params+="&t"+troopId.toString()+"="+number.toString();
                        max=XPath.getInt('./../a/text()',n);
                    }
                }
                params+="&s1=ok";
                console.log(params);
                
                var button=XPath.getNode('//*[@class="green startTraining"]',page);
                console.log(max);
                //alert(number);
                if (number>max) {
                        onFinished();
                        return;
                }
                XHR.sendPost('build.php',params,function(status, page){
                    DB.TrainQueue.remove(row.id);
                    onFinished();
                })
                //button.click();
        });
    });
}


VillageManager.prototype.runBQ = function(choose,onFinished) { 
        //alert('dfdf');
        if(choose==0){
            DB.Queue.topFarm(this.villageId, function(row){
                var villageId = row.villageId;
                var slotId = row.slotId;
                var level = row.level;
                //alert(level);
                var link=null;
                console.log("Upgrading slot "+slotId+" in village "+villageId);
                XHR.getPage('build.php?id='+slotId, null, function(status, page) {
                        link=null;
                        console.log(page);
                        var n = XPath.getNode('//*[@class="green build"]', page);
                        
                        console.log(n);
                        if (n == null) {
                                onFinished();
                                return;
                        }
                        link = XPath.getString('./@onclick', n);
                        link=link.match(/\'.*\'/).toString();
                        link=link.substring(1,link.length-1);
                        XHR.getPage(link, null, function (status, page) {
                                console.log("upgrade link: "+link);
                                DB.Queue.remove(villageId, slotId, level);
                                Comm.reload();
                                onFinished();
                        });
                });
            });
        }else{
            DB.Queue.topBuild(this.villageId, function(row){
                var villageId = row.villageId;
                var slotId = row.slotId;
                var level = row.level;
                //alert(level);
                var link=null;
                console.log("Upgrading slot "+slotId+" in village "+villageId);
                XHR.getPage('build.php?id='+slotId, null, function(status, page) {
                        link=null;
                        console.log(page);
                        var n = XPath.getNode('//*[@class="green build"]', page);
                        
                        console.log(n);
                        if (n == null) {
                                onFinished();
                                return;
                        }
                        link = XPath.getString('./@onclick', n);
                        link=link.match(/\'.*\'/).toString();
                        link=link.substring(1,link.length-1);
                        XHR.getPage(link, null, function (status, page) {
                                console.log("upgrade link: "+link);
                                DB.Queue.remove(villageId, slotId, level);
                                Comm.reload();
                                onFinished();
                        });
                });
            });
        }
}


VillageManager.prototype.runStrategies = function (choose,onFinished) {
        //alert('procesing village '+this.villageId);
        var runQ = (function(that, onFinished) {
                return function() {
                        that.runTQ(function(){});
                        that.runBQ(choose,onFinished);
                };
        })(this, onFinished);
        
        this.navigateToVillage(function () {
                runQ();
        });
        
}
/*
Background.runTrainQueue=function(row){
    var villageId = row.villageId;
    var slotId = row.slotId;
    var level = row.level;
    //alert(level);
    var link=null;
    console.log("Train slot "+slotId+" in village "+villageId);
    XHR.getPage('build.php?id='+slotId, null, function(status, page) {
            link=null;
            
            var n = XPath.getNode('//*[@class="'+'t'+row.troopId.toString()+'"]', page);
            console.log(n);
            if (n == null) {
                    onFinished();
                    return;
            }
            link = XPath.getString('./@onclick', n);
            link=link.match(/\'.*\'/).toString();
            link=link.substring(1,link.length-1);
            XHR.getPage(link, null, function (status, page) {
                    console.log("upgrade link: "+link);
                    DB.Queue.remove(villageId, slotId, level);
                    Comm.reload();
                    onFinished();
            });
    });
}

Background.runBuildingQueue=function(row){
    var villageId = row.villageId;
    var slotId = row.slotId;
    var level = row.level;
    //alert(level);
    var link=null;
    console.log("Upgrading slot "+slotId+" in village "+villageId);
    XHR.getPage('build.php?id='+slotId, null, function(status, page) {
            link=null;
            console.log(page);
            var n = XPath.getNode('//*[@class="green build"]', page);
            
            console.log(n);
            if (n == null) {
                    onFinished();
                    return;
            }
            link = XPath.getString('./@onclick', n);
            link=link.match(/\'.*\'/).toString();
            link=link.substring(1,link.length-1);
            XHR.getPage(link, null, function (status, page) {
                    console.log("upgrade link: "+link);
                    DB.Queue.remove(villageId, slotId, level);
                    Comm.reload();
                    onFinished();
            });
    });
}
*/

Background.run = function(choose) {
        DB.getAllVillages(function (villagesIds) {
                var i=0;
                var f = function() {
                        if (i < villagesIds.length) {
                                var v = new VillageManager(villagesIds[i++].villageId);
                                v.runStrategies(choose,f);
                        }
                }
                f();
        });
        
        
}

var nowChoose=0;

Background.play = function () {
        Background.run(nowChoose);
        nowChoose=1-nowChoose;
        Background.timeoutId = setTimeout(Background.play, 15000);
}

function tst () {
        alert('test !');
}
function init() {
        DB.init();
        Background.play();

        Comm.register('DB.Queue.enqueue', DB.Queue.enqueue);
        Comm.register('DB.Queue.publish', DB.Queue.publish);
        Comm.register('DB.Queue.remove',  DB.Queue.remove);
        Comm.register('DB.TrainQueue.publish',  DB.TrainQueue.publish);
        Comm.register('DB.TrainQueue.enqueue',  DB.TrainQueue.enqueue);
        Comm.register('DB.TrainQueue.remove',  DB.TrainQueue.remove);
        Comm.register('DB.SendQueue.enqueue',  DB.SendQueue.enqueue);
        Comm.register('DB.SendQueue.publish',  DB.SendQueue.publish);
        Comm.register('DB.SendQueue.remove',  DB.SendQueue.remove);
        Comm.register('DB.SendQueue.update',  DB.SendQueue.update);
        Comm.register('DB.SendQueue.change',  DB.SendQueue.change);
        Comm.register('tst', tst);
}

init();
//tst();
