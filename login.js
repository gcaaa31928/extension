


var init = function(){
	var node = XPath.getNode("//*[@value='Log-masuk']");
	if(node==null)return;
	var id=XPath.getNode("//*[@id='content']/div[1]/div[1]/form/table/tbody/tr[1]/td[2]/input");
	var psd=XPath.getNode("//*[@id='content']/div[1]/div[1]/form/table/tbody/tr[2]/td[2]/input");
	chrome.storage.local.get(null,function(item){
		id.value=item.id.toString();
	});
	chrome.storage.local.get(null,function(item){
		psd.value=item.psd.toString();
	});

	setTimeout(login,2000);
};
var login=function(){
	var node = XPath.getNode("//*[@value='登入']");
	node.click();
}
setTimeout(init,8000);


//loginCheck();