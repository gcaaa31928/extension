var SendingTroop = {};

SendingTroop.addLink=function(){
        var p=XPath.getNodes('//span[@class="coordinates coordinatesWrapper"]')
        if(p==null)return ;
        var villageId=SideBar.getCurrentVillageId();
        for(var i=0;i<p.length;i++){
                //var br=document.createElement('br');
                var a=document.createElement('a');
                a.href="#";
                a.id=i.toString();
                a.appendChild(document.createTextNode('加進羊單'));
                //p[i].appendChild(br);
                p[i].appendChild(a);
                a.onclick=function(){
                        var node=XPath.getNode('//a[@id="'+this.id+'"]');
                        var coordX=XPath.getCoordInt('./../span[@class="coordinateX"]',node);
                        var coordY=XPath.getCoordInt('./../span[@class="coordinateY"]',node);
                        console.log(coordX+" | "+coordY+" 進入羊單囉~");
                        Comm.invoke(null, 'DB.SendQueue.enqueue', coordX,coordY,villageId);
                }
        }
}


SendingTroop.addLink();