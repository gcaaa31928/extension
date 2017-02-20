var Building = {};

Building.getId = function () {
        return XPath.getInt('//*[@id="build"]/@class');
};

Building.getNextLevel = function () {
        return XPath.getInt('//*[@id="contract"]/div[1]/text()');
};





var FutureUpgrade = {};

FutureUpgrade.addTrainLink=function(){
        //var onTrainQueuePublished=function(eventName,bqrows){
                var p = XPath.getNode('//*[@class="buildActionOverview trainUnits"]');
                if (p == null)
                        return;
                var slotId = Util.getURLQuery(window.location).id;
                var villageId = SideBar.getCurrentVillageId();
                var troopNodes=XPath.getNodes('//*[@class="details"]');
                for(var i=0;i<troopNodes.length;i++){
                        var troopNode = troopNodes[i];

                        var br = document.createElement('br');
                        troopNode.appendChild(br);
                
                        var a = document.createElement('a');
                        a.href = "#";
                        a.id=XPath.getInt('.//input/@name',troopNode);
                        a.name=XPath.getString('.//div[1]//a[2]/text()',troopNode)
                        a.appendChild(document.createTextNode('開始排進佇列'));
                        troopNode.appendChild(a);
                        a.onclick = function () { 
                                var node=XPath.getNode('//*[@id="'+this.id+'"]');
                                var input=XPath.getNode('./../input',node);
                                var troopName=node.name;
                                var troopId=node.id;
                                var number =input.value;
                                console.log(number);
                                //console.log(troopId);
                                Comm.invoke(null, 'DB.TrainQueue.enqueue', villageId,slotId,troopId,number,troopName);
                                return false;
                        };
                }
        //};
        //Comm.subscribe(onTrainQueuePublished, 'TrainQueuePublished');
        //Comm.invoke(null, 'DB.TrainQueue.enqueue');
}

FutureUpgrade.addLink = function () {
        var onBuildingQueuePublished = function (enentName, bqrows) {

                var p = XPath.getNode('//*[@id="contract"]');
                if (p == null)
                        return;
                
                var nextLevel = Building.getNextLevel();
                //alert(nextLevel);
                var slotId = Util.getURLQuery(window.location).id;
                var villageId = SideBar.getCurrentVillageId();
                var buildName=XPath.getString('//*[@id="content"]/h1/text()').trim();


                for (var i=0; i < bqrows.length; ++i) {
                        if (bqrows[i].villageId == villageId &&
                                bqrows[i].slotId == slotId && nextLevel < (bqrows[i].level+1)) {
                                
                                nextLevel = bqrows[i].level+1;
                        }
                }
                
                var br = document.createElement('br');
                p.appendChild(br);
        
                var a = document.createElement('a');
                a.href = "#";
                a.appendChild(document.createTextNode('開始排進佇列 等級'+nextLevel));
                p.appendChild(a);
                
                a.onclick = function () { 
                        Comm.invoke(null, 'DB.Queue.enqueue', villageId, slotId, nextLevel, buildName);
                        return false;
                };
        
        
                Comm.subscribe(function() { 
                        p.removeChild(a);
                        p.removeChild(br);
                        FutureUpgrade.addLink();
                }, 'BuildingQueueChanged');
        
        };

        Comm.subscribe(onBuildingQueuePublished, 'BuildingQueuePublished');
        Comm.invoke(null, 'DB.Queue.publish');
        
        
};

FutureUpgrade.addLink();
FutureUpgrade.addTrainLink();
/*
FutureUpgrade.addSpaceBuildLink = function () {
        var onBuildingQueuePublished = function (enentName, bqrows) {

                var p = XPath.getNodes('//*[@class="buildingWrapper"]');
                if (p == null)
                        return;
                for(var i=0;i<p.length;i++){
                        var node=p[i];
                        var nextLevel = 1;
                        var slotId = Util.getURLQuery(window.location).id;
                        var villageId = SideBar.getCurrentVillageId();
                        var buildName=XPath.getString('./@h2/text()',node).trim();

                        for (var i=0; i < bqrows.length; ++i) {
                                if (bqrows[i].villageId == villageId &&
                                        bqrows[i].slotId == slotId && nextLevel < (bqrows[i].level+1)) {
                                        
                                        nextLevel = bqrows[i].level+1;
                                }
                        }
                }

                



                
                var br = document.createElement('br');
                p.appendChild(br);
        
                var a = document.createElement('a');
                a.href = "#";
                a.appendChild(document.createTextNode('開始排進佇列 等級'+nextLevel));
                p.appendChild(a);
                
                a.onclick = function () { 
                        Comm.invoke(null, 'DB.Queue.enqueue', villageId, slotId, nextLevel, buildName);
                        return false;
                };
        
        
                Comm.subscribe(function() { 
                        p.removeChild(a);
                        p.removeChild(br);
                        FutureUpgrade.addLink();
                }, 'BuildingQueueChanged');
        
        };

        Comm.subscribe(onBuildingQueuePublished, 'BuildingQueuePublished');
        Comm.invoke(null, 'DB.Queue.publish');
        
        
};*/