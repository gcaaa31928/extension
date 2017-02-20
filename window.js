    var dragapproved = false;  
    var dragObj;  
    var zIndex = 3;  
    var offX,offY;  
    document.onmousedown = beginDrag;  
    document.onmouseup = function() {dragapproved = false};  
    document.onmousemove = dragDrop;  
    function dragDrop(evt) {  
        if (dragapproved) {  
            var e = evt || window.event;  
            dragObj.style.left = e.clientX - offX + document.documentElement.scrollLeft + 'px';
            dragObj.style.top = e.clientY - offY + document.documentElement.scrollTop + 'px';
        }  
    }  
    function beginDrag(evt) {  
        dragObj = window.event ? event.srcElement : evt.target;  
        if (dragapproved == false && dragObj.className.indexOf("drag") >= 0) {  
            //dragObj.style.zIndex = zIndex++;  
            offX = window.event ? event.offsetX : evt.layerX;  
            offY = window.event ? event.offsetY : evt.layerY;  
            dragapproved = true;  
        }  
        if (dragapproved == false && dragObj.className.indexOf("comment") >= 0) {  
            dragapproved = false;  
        }  
    }
    function closeItem(obj) {
        document.getElementById(obj).style.display = 'none';
    }
    function openItem(obj) {
        document.getElementById(obj).style.display = 'block';
    }