var SideBar={};
SideBar.getCurrentVillageId = function () {
        var n = XPath.getNode('//li[@class=" active"]/a');
        if (n == null)
                return null;
        return Util.getURLQuery(n.href).newdid;
};

SideBar.getRace=function(){
	var n = XPath.getInt('//div[@class="playerName"]/img/@class');
	if(n==null)
		return null;
	return (n-1)*10;
}