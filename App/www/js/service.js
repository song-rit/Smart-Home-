app.service('Data', function () {
    var ip
	var user
    var sensor = []
    var light = []
    var fence = {}

    this.setUser = function (user) {
        this.user = user
    }

    this.setFence = function(fence){

        this.fence = fence
    }

    this.setSenSor = function(sensor){
        this.sensor = sensor
    }

    this.setLight = function(light){
        this.light = light
    }

    this.setIP = function(ip){
        this.ip = ip
    }

    this.getUserName = function (){
        return this.user       
    }


    this.getIP = function (){
        return this.ip     
    }

    this.getSenSor = function (){
        return this.sensor     
    }

    this.getLight = function (){
        return this.light      
    }

    this.getFence = function (){
        return this.fence      
    }
})
