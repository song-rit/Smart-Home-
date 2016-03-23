app.service('DataBase', function () {

	this.getIP = function(){
    	return "192.168.1.2"
    } 
  
    this.getUser = function(){
    	return {"userName":"test","passWord":"1234"}
    }  
    this.getLight = function(){
    	return [    {"id":0,"name":"ห้องนอน1","pic":"img/bedroom1.jpg","pin":0,"status":false},
                    {"id":1,"name":"พัดลมห้องนอน1","pic":"img/fan1.jpg","pin":1,"status":false},
                    {"id":2,"name":"ห้องนอน2","pic":"img/bedroom2.jpg","pin":2,"status":false},
                    {"id":3,"name":"พัดลมห้อง2่","pic":"img/fan2.jpg","pin":3,"status":false},
                    {"id":4,"name":"ห้องนั่งเล่น","pic":"img/playroom.jpg","pin":4,"status":false},
                    {"id":5,"name":"ห้องเก็บของ","pic":"img/keeproom.jpg","pin":5,"status":false},
                    {"id":6,"name":"ห้องครัว","pic":"img/kitchen.jpg","pin":6,"status":false}
                ]  
    } 

    this.getSenSor = function(){
    	return 	[   {"id":0,"name":"ประตู","pic":"img/door.jpg","status":"CLOSE"},
                    {"id":1,"name":"หน้าต่าง","pic":"img/window.jpg","status":"CLOSE"}
                    
     			]  
    }  

    this.getFence = function(){
        return     {"id":0,"name":"ประตูรั้วหน้าบ้าน","pic":"img/fence.jpg"}
    }  

})
