document.addEventListener('DOMContentLoaded', function () {  
    document.querySelector('#save').addEventListener('click', setStorage);  
    getStorage();  
});  
var storage=chrome.storage.local;
function setStorage() {  
	
	var idc=document.getElementById('id');
    var id = idc.value;  
    var passwordc=document.getElementById('password');
    var password = passwordc.value;  
    var file={};
    file['id']=id.toString();
    file['psd']=password.toString();
    storage.set(file,function(){});
    //storage.set(psd:psd.toString(),function(){});
}  

  

  
function getStorage() {  

	var idc=document.getElementById('id');
    var passwordc=document.getElementById('password');
    storage.get(function(item){
    	if(item.id)idc.value=item.id;
    	if(item.psd)passwordc.value=item.psd;
    });

}  