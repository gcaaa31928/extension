var DB={};

DB.Queue={};
DB.TrainQueue={};
DB.SendQueue={};
DB.connection=null;




DB.test=function(){
	alert('test');
}

DB.init=function(){
	DB.connection=openDatabase("TravianScript","1.0","TravianScript Database",5*1024*1024);
	DB.Queue.init();
        DB.TrainQueue.init();
        DB.SendQueue.init();
}

DB.SendQueue.init =function(){
        DB.connection.transaction(function(tx) {
                var query = "CREATE TABLE IF NOT EXISTS sendQueues ("+
                        "villageId INTEGER NOT NULL,"+
                        "id INTEGER PRIMARY KEY  AUTOINCREMENT ,"+
                        "t1 INTEGER , "+
                        "t2 INTEGER , "+
                        "t3 INTEGER , "+
                        "t4 INTEGER , "+
                        "t5 INTEGER , "+
                        "t6 INTEGER , "+
                        "t7 INTEGER , "+
                        "t8 INTEGER , "+
                        "t9 INTEGER , "+
                        "t10 INTEGER, "+
                        "t11 INTEGER, "+
                        "targetX INTEGER NOT NULL,"+
                        "targetY INTEGER NOT NULL,"+
                        "active INTEGER NOT NULL,"+
                        "attackType INTEGER)";
                tx.executeSql(query, [], DB.DefaultRsultFunction, DB.DefaultErrorFunction);
        });
}

DB.SendQueue.enqueue = function (targetX,targetY,villageId) {
        DB.connection.transaction(function(tx){
                var res= function(tx,result){
                        if(result.rowsAffected>0){
                                Comm.publish('SendQueueChanged');
                        }
                };
                //alert('tran ok');
                var query = "INSERT INTO sendQueues(villageId,targetX,targetY,active,attackType) VALUES (?, ?, ?, ?, ?)";
                tx.executeSql(query, [villageId,targetX,targetY,1,2], res, DB.DefaultErrorFunction);
        });
        
};

DB.SendQueue.remove = function (id) {
        //alert('removing: '+villageId+", "+slotId+", level "+level);
        DB.connection.transaction(function(tx) {
        
                var res = function (tx, result) { 
                        if (result.rowsAffected > 0) {
                                Comm.publish('SendQueueChanged');
                        }
                }; 
        
                tx.executeSql(
                        "DELETE FROM sendQueues "+
                        "WHERE id=?",
                        [id], res, DB.DefaultErrorFunction);
        });
};

DB.SendQueue.change=function(){
        Comm.publish('SendQueueChanged');
}

DB.SendQueue.publish=function(){
        DB.connection.transaction(function(tx){
                //alert("DB.Queue.publish  ok");
                var query="SELECT * FROM sendQueues";
                var res=function(tx,result){
                        Comm.publish('SendQueuePublished',DB.resultToArray(result));
                };
                tx.executeSql(query,[],res,DB.DefaultErrorFunction);
        });
};

DB.SendQueue.update=function(id,t,active,attackType){
        DB.connection.transaction(function(tx){
                var res= function(tx,result){

                }
                var query="UPDATE sendQueues SET t1=?,t2=?,t3=?,t4=?,t5=?,t6=?,t7=?,t8=?,t9=?,t10=?,t11=?,active=?,attackType=? "+
                        " WHERE id=?";
                tx.executeSql(query,[t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7],t[8],t[9],t[10],active,attackType,id
                        ],res,DB.DefaultErrorFunction);
        });
};


DB.SendQueue.top = function (villageId, callback) {
        DB.connection.transaction(function(tx) {
                var res = function (tx, result) {
                        callback(result.rows.item(0));
                };
                var query = 
                        "SELECT * "+
                        "FROM sendQueues "+
                        "WHERE villageId = ?";

                tx.executeSql(query, [villageId], res, DB.DefaultErrorFunction);
        });
};




DB.TrainQueue.init = function() {
        DB.connection.transaction(function(tx) {
                var query = "CREATE TABLE IF NOT EXISTS trainQueues ("+
                        "id INTEGER PRIMARY KEY  AUTOINCREMENT ,"+
                        "villageId INTEGER NOT NULL, "+
                        "slotId INTEGER NOT NULL, "+
                        "troopId INTEGER NOT NULL, "+
                        "number INTEGER NOT NULL, "+
                        "troopName VARCHAR(50))";
                tx.executeSql(query, [], DB.DefaultRsultFunction, DB.DefaultErrorFunction);
        });
}




DB.TrainQueue.enqueue = function (villageId,slotId,troopId,number,troopName) {
        DB.connection.transaction(function(tx){
                var res= function(tx,result){
                        if(result.rowsAffected>0){
                                Comm.publish('TrainQueueChanged');
                        }
                };
                //alert('tran ok');
                var query = "INSERT INTO trainQueues(villageId,slotId,troopId,number,troopName) VALUES ("+
                        "?, ?, ?, ?, ?)";
                tx.executeSql(query, [villageId, slotId, troopId, number, troopName], res, DB.DefaultErrorFunction);
        });
        
};

DB.TrainQueue.remove = function (id) {
        //alert('removing: '+villageId+", "+slotId+", level "+level);
        DB.connection.transaction(function(tx) {
        
                var res = function (tx, result) { 
                        if (result.rowsAffected > 0) {
                                Comm.publish('TrainQueueChanged');
                        }
                }; 
        
                tx.executeSql(
                        "DELETE FROM trainQueues "+
                        "WHERE id=?",
                        [id], res, DB.DefaultErrorFunction);
        });
};

DB.TrainQueue.publish=function(){
        DB.connection.transaction(function(tx){
                //alert("DB.Queue.publish  ok");
                var query="SELECT * FROM trainQueues";
                var res=function(tx,result){
                        Comm.publish('TrainQueuePublished',DB.resultToArray(result));
                };
                tx.executeSql(query,[],res,DB.DefaultErrorFunction);
        });
};


DB.TrainQueue.top = function (villageId, callback) {
        DB.connection.transaction(function(tx) {
                var res = function (tx, result) {
                        callback(result.rows.item(0));
                };
                var query = 
                        "SELECT * "+
                        "FROM trainQueues "+
                        "WHERE villageId = ?";

                tx.executeSql(query, [villageId], res, DB.DefaultErrorFunction);
        });
};






DB.DefaultErrorFunction=function(tx,error){
	console.log('ERROR');
	console.log(error);
}

DB.Queue.init = function() {
        DB.connection.transaction(function(tx) {
                var query = "CREATE TABLE IF NOT EXISTS buildingQueues ("+
                        "villageId INTEGER, "+
                        "slotId INTEGER NOT NULL, "+
                        "priority INTEGER NOT NULL, "+
                        "level INTEGER NOT NULL, "+
                        "buildName VARCHAR(50), "+
                        "PRIMARY KEY(villageId, slotId, level))";
                tx.executeSql(query, [], DB.DefaultRsultFunction, DB.DefaultErrorFunction);
        });
};




DB.getAllVillages = function (callback) {
        DB.connection.transaction(function(tx) {
                var query = "SELECT DISTINCT villageId FROM buildingQueues "+
                        "UNION SELECT DISTINCT villageId FROM trainQueues"
                        ;
                tx.executeSql(query, [], function (tx, result) {
                        callback(DB.resultToArray(result));
                }, DB.DefaultErrorFunction);
        });
        
};

DB.Queue.enqueue=function(villageId,slotId,level,buildName){

	DB.connection.transaction(function(tx){
		var res= function(tx,result){
			if(result.rowsAffected>0){
                                Comm.publish('BuildingQueueChanged');
			}
		};
                //alert('tran ok');
                var query = "INSERT INTO buildingQueues VALUES ("+
                        "?, ?, (SELECT COALESCE (MAX(priority), 0)+1 FROM buildingQueues where villageId = ?), ?,?)";
                tx.executeSql(query, [villageId, slotId, villageId, level, buildName], res, DB.DefaultErrorFunction);
	});
};

DB.Queue.remove = function (villageId, slotId, level) {
        //alert('removing: '+villageId+", "+slotId+", level "+level);
        DB.connection.transaction(function(tx) {
        
                var res = function (tx, result) { 
                        if (result.rowsAffected > 0) {
                                Comm.publish('BuildingQueueChanged');
                        }
                }; 
        
                tx.executeSql(
                        "DELETE FROM buildingQueues "+
                        "WHERE villageId=? AND slotId=? AND level=?",
                        [villageId, slotId, level], res, DB.DefaultErrorFunction);
        });
};

DB.resultToArray = function (SqlResultSet) {
        var res = new Array();
        for (var i=0; i < SqlResultSet.rows.length; ++i) {
                var item = SqlResultSet.rows.item(i);
                var o = new Object();
                for (key in item) {
                        o[key] = item[key];
                }
                res.push(o);
        }
        return res;
};

DB.Queue.publish=function(){
	DB.connection.transaction(function(tx){
                //alert("DB.Queue.publish  ok");
		var query="SELECT * FROM buildingQueues";
		var res=function(tx,result){
                        Comm.publish('BuildingQueuePublished',DB.resultToArray(result));
                };
                tx.executeSql(query,[],res,DB.DefaultErrorFunction);
	});
};


DB.Queue.topFarm = function (villageId, callback) {
        DB.connection.transaction(function(tx) {
                var res = function (tx, result) {
                        callback(result.rows.item(0));
                };
                var query = 
                        "SELECT * "+
                        "FROM buildingQueues "+
                        "WHERE villageId = ? AND priority = ("+
                                "SELECT MIN(priority) "+
                                "FROM buildingQueues "+
                                "WHERE villageId = ?"+
                                " AND slotId<19"+
                        ")"

                tx.executeSql(query, [villageId, villageId], res, DB.DefaultErrorFunction);
        });
};

DB.Queue.topBuild = function (villageId, callback) {
        DB.connection.transaction(function(tx) {
                var res = function (tx, result) {
                        callback(result.rows.item(0));
                };
                var query = 
                        "SELECT * "+
                        "FROM buildingQueues "+
                        "WHERE villageId = ? AND priority = ("+
                                "SELECT MIN(priority) "+
                                "FROM buildingQueues "+
                                "WHERE villageId = ?"+
                                " AND slotId>=19"+
                        ")"

                tx.executeSql(query, [villageId, villageId], res, DB.DefaultErrorFunction);
        });
};