var BuildingQueue = {};
var Fields={};
var host="http://ts4.travian.hk/";

BuildingQueue.createAttackItem=function(index){
        var select=document.createElement('select');
        var option=document.createElement('option');
        option.appendChild(document.createTextNode('增援'))
        select.appendChild(option);
        option=document.createElement('option');
        option.appendChild(document.createTextNode('攻擊'))
        select.appendChild(option);
        option=document.createElement('option');
        option.appendChild(document.createTextNode('搶奪'))
        select.appendChild(option);
        select.selectedIndex=index;
        return select;

}

BuildingQueue.displaySendQueue = function () {
        var villageId = SideBar.getCurrentVillageId();
        
        var onSendQueuePublished = function (eventName, rows) {
                var raceInt=SideBar.getRace();
                var table = document.createElement('table');
                //var n = XPath.getNode('//*[@id="background"]');
                var n = XPath.getNode('//body');
                var div=document.createElement('div');
                var divcomment=document.createElement('div');
                divcomment.className='comment';
                n.appendChild(div);
                div.id='d3';
                div.className='drag';
                div.setAttribute("style","overflow:auto;height:90px;width:500px");
                openItem('d3');
                

                var button=document.createElement('button');
                button.type='button';
                button.id='saved send';
                button.className='green build';
                button.value='儲存';
                button.appendChild(document.createTextNode('儲存'));
                button.onclick=function(){
                        for(var i=0;i<rows.length;i++){
                                if (rows[i].villageId != villageId)
                                        continue;
                                var t={};
                                var node=XPath.getNode('//button/../table/tr['+(i+2).toString()+']');
                                var id=rows[i].id;
                                var active=XPath.getNode('./td[2]/a/input',node).checked;
                                var type=parseInt(XPath.getNode('./td[15]/a/select',node).selectedIndex);
                                for(var j=0;j<11;j++){
                                        t[j]=parseInt(XPath.getNode('./td['+(j+4).toString()+']/a/input',node).value);
                                }
                                console.log(t);
                                console.log(id);
                                console.log(active);
                                console.log(type);
                                Comm.invoke(null, 'DB.SendQueue.update', id,t,active?1:0,type);
                        }
                        Comm.invoke(null, 'DB.SendQueue.change');
                }
                divcomment.appendChild(button);

                
                divcomment.appendChild(table);
                div.appendChild(divcomment);
                var tr=document.createElement('tr');

                td=document.createElement('td');
                a=document.createElement('a');
                td.appendChild(a);
                tr.appendChild(td);

                var td=document.createElement('td');
                a=document.createElement('a');
                a.appendChild(document.createTextNode('啟動'));
                td.appendChild(a);
                tr.appendChild(td);

                td=document.createElement('td');
                a=document.createElement('a');
                a.appendChild(document.createTextNode("座標"));
                td.appendChild(a);
                tr.appendChild(td);
                for(var i=1+raceInt;i<12+raceInt;i++){
                        var img=document.createElement('img');
                        td=document.createElement('td');
                        a=document.createElement('a');
                        if(i==12+raceInt-1)img.className="unit uhero";
                        else img.className="unit u"+i.toString();//+Util.PadLeft(i.toString(),2);
                        img.src="img/x.gif";
                        a.appendChild(img);
                        td.appendChild(a);
                        tr.appendChild(td);
                }
                td=document.createElement('td');
                a=document.createElement('a');
                a.appendChild(document.createTextNode("攻擊類型"));
                td.appendChild(a);
                tr.appendChild(td);
                table.appendChild(tr);
                for (var i=0; i < rows.length; ++i) {
                        if (rows[i].villageId != villageId)
                                continue;
                        var tr = document.createElement('tr');
                        var td = document.createElement('td');
                        var a = document.createElement('a');
                        var img=document.createElement('img');
                        
                        img.src='img/x.gif';
                        img.className = 'del';
                        a.appendChild(img);
                        a.href='#';
                        a.onclick=(function(id) {
                                return function() {
                                        Comm.invoke(null, 'DB.SendQueue.remove', id);
                                        return false;
                                };
                        })(rows[i].id);
                        td.appendChild(a);
                        tr.appendChild(td);

                        td = document.createElement('td');
                        a = document.createElement('a');
                        var input = document.createElement('input');

                        input.type='checkbox';
                        input.checked=(rows[i].active==1);
                        a.appendChild(input);
                        td.appendChild(a);
                        tr.appendChild(td);
                        td = document.createElement('td');
                        a = document.createElement('a');
                        a.href=host+'position_details.php?x='+rows[i].targetX.toString()+'&y='+rows[i].targetY.toString();
                        a.appendChild(document.createTextNode('('+rows[i].targetX.toString()+'|'+rows[i].targetY.toString()+')'));
                        td.appendChild(a);
                        tr.appendChild(td);
                        table.appendChild(tr);
                        for(var j=1+raceInt;j<12+raceInt;j++){
                                var troopNum=eval('rows[i].t'+(j-raceInt).toString());
                                var td = document.createElement('td');
                                var a = document.createElement('a');
                                var input = document.createElement('input');
                                input.type='text';
                                input.className='text';
                                input.maxLength=5;
                                input.style.width="16px";
                                input.value=troopNum;
                                a.appendChild(input);
                                td.appendChild(a);
                                tr.appendChild(td);
                        }
                        td=document.createElement('td');
                        a=document.createElement('a');
                        var select=BuildingQueue.createAttackItem(rows[i].attackType);
                        a.appendChild(select);
                        td.appendChild(a);
                        tr.appendChild(td);
                        
                }

                Comm.subscribe(function() {
                        n.removeChild(div);
                        BuildingQueue.displaySendQueue();
                }, 'SendQueueChanged');
        };
        
        Comm.subscribe(onSendQueuePublished, 'SendQueuePublished');
        Comm.invoke(null, 'DB.SendQueue.publish');
};



BuildingQueue.displayTrainQueue = function () {
        var villageId = SideBar.getCurrentVillageId();
        
        var onTrainQueuePublished = function (eventName, rows) {
                var table = document.createElement('table');
                //var n = XPath.getNode('//*[@id="background"]');
                var n = XPath.getNode('//body');
                var div=document.createElement('div');
                var divcomment=document.createElement('div');
                divcomment.className='comment';
                n.appendChild(div);
                div.id='d2';
                div.className='drag';
                openItem('d2');
                div.appendChild(divcomment);
                divcomment.appendChild(table);

                //table.style="position: absolute; top: 220px; left: 102px;";
                for (var i=0; i < rows.length; ++i) {
                        if (rows[i].villageId != villageId)
                                continue;

                        var tr = document.createElement('tr');
                        table.appendChild(tr);

                        var td = document.createElement('td');
                        var img = document.createElement('img');
                        //img.src = 'img/x.gif';
                        img.className = 'del';
                        var a = document.createElement('a');
                        a.appendChild(img);
                        a.href = '#';
                        a.onclick = (function(id) {
                                return function() {
                                        Comm.invoke(null, 'DB.TrainQueue.remove', id);
                                        return false;
                                };
                        })(rows[i].id);
                        
                        td.appendChild(a);
                        tr.appendChild(td);
                        
                        td = document.createElement('td');
                        a = document.createElement('a');
                        var troopName = rows[i].troopName;
                        a.appendChild(document.createTextNode(troopName+' 在建築物的ID '+rows[i].slotId+' 數量 '+rows[i].number));
                        a.href = 'build.php?newdid='+rows[i].villageId+'&id='+rows[i].slotId;
                        td.appendChild(a);
                        tr.appendChild(td);
                        
                }
                Comm.subscribe(function() {
                        n.removeChild(div);
                        BuildingQueue.displayTrainQueue();
                }, 'TrainQueueChanged');
        };
        
        Comm.subscribe(onTrainQueuePublished, 'TrainQueuePublished');
        Comm.invoke(null, 'DB.TrainQueue.publish');
};

BuildingQueue.displayBuildingQueue = function () {
        var villageId = SideBar.getCurrentVillageId();
        
        var onBuildingQueuePublished = function (eventName, rows) {
                var table = document.createElement('table');
                //var n = XPath.getNode('//*[@id="background"]');
                var n = XPath.getNode('//body');
                var div=document.createElement('div');
                var divcomment=document.createElement('div');
                divcomment.className='comment';
                n.appendChild(div);
                div.id='d1';
                div.className='drag';
                openItem('d1');
                div.appendChild(divcomment);
                divcomment.appendChild(table);
                //table.style="position: absolute; top: 220px; left: 102px;";
                for (var i=0; i < rows.length; ++i) {
                        if (rows[i].villageId != villageId)
                                continue;

                        var tr = document.createElement('tr');
                        table.appendChild(tr);

                        var td = document.createElement('td');
                        var img = document.createElement('img');
                        //img.src = 'img/x.gif';
                        img.className = 'del';
                        var a = document.createElement('a');
                        a.appendChild(img);
                        a.href = '#';
                        a.onclick = (function(villageId, slotId, level) {
                                return function() {
                                        Comm.invoke(null, 'DB.Queue.remove', villageId, slotId, level);
                                        return false;
                                };
                        })(rows[i].villageId, rows[i].slotId, rows[i].level);
                        
                        td.appendChild(a);
                        tr.appendChild(td);
                        
                        td = document.createElement('td');
                        a = document.createElement('a');
                        //var buildingName = Fields.getName(rows[i].villageId, rows[i].slotId);
                        var buildingName = rows[i].buildName;
                        a.appendChild(document.createTextNode(buildingName+' 在建造的ID '+rows[i].slotId+' 等級 '+rows[i].level));
                        a.href = 'build.php?newdid='+rows[i].villageId+'&id='+rows[i].slotId;
                        td.appendChild(a);
                        tr.appendChild(td);
                        
                }
                Comm.subscribe(function() {
                        n.removeChild(div);
                        BuildingQueue.displayBuildingQueue();
                }, 'BuildingQueueChanged');
        };
        
        Comm.subscribe(onBuildingQueuePublished, 'BuildingQueuePublished');
        Comm.invoke(null, 'DB.Queue.publish');
};



BuildingQueue.displaySendQueue();
BuildingQueue.displayTrainQueue();
BuildingQueue.displayBuildingQueue();

Fields.storeVillageClass = function () {
        var villageId = parseInt(SideBar.getCurrentVillageId());
        var villageClass = XPath.getString('//*[@id="village_map"]/@class');
        localStorage.setItem('VillageClass['+villageId+']', villageClass);
};

Fields.getName = function(villageId, slotId) {
        slotId = parseInt(slotId);
        if (slotId < 1 || 18 < slotId)
                return null;
        var villageClass = localStorage.getItem('VillageClass['+villageId+']');
        if (villageClass == null)
                return null;

        var fieldId = FieldIdFromVillageClass[villageClass][slotId];
        
        return FieldNameFromId[fieldId];
};

Fields.storeVillageClass();







/*
var Resources = {};

Resources.getWood = function () {
        return parseInt(XPath.getString('//*[@id="l4"]/text()').split("/")[0]);
};
var str=Resources.getWood().toString();
 alert(str);
 */
