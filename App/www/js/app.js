var app = angular.module('app', ['onsen']);

app.controller('AppController', function ($scope, $http, $q, $interval, DataBase, Data) {

	var user
  var light
  var sensor
  var ip
  var fence

	$scope.dialogs = {};

 

  $scope.show = function(dlg) {
    if (!$scope.dialogs[dlg]) {
      ons.createDialog(dlg).then(function(dialog) {
        $scope.dialogs[dlg] = dialog;
        dialog.show();
      });
    }
    else {
      $scope.dialogs[dlg].show()
    }
  }
  
  function init(){ 
    light = window.localStorage.getItem("light")   
    sensor = window.localStorage.getItem("sensor")
    ip = window.localStorage.getItem("ip")
    user = window.localStorage.getItem("user") 
    fence = window.localStorage.getItem("fence") 

    if(ip == null){      
      var data = JSON.stringify(DataBase.getIP())
      window.localStorage.setItem("ip", data) 
    }  
     ip = window.localStorage.getItem("ip") 
     Data.setIP(JSON.parse(ip))

    if(light == null){
        var data = JSON.stringify(DataBase.getLight())
        window.localStorage.setItem("light", data)  
    }
    light = window.localStorage.getItem("light") 
    Data.setLight(JSON.parse(light))
           
    if(sensor == null){    
        var data = JSON.stringify(DataBase.getSenSor())
        window.localStorage.setItem("sensor", data)           
    }
    sensor = window.localStorage.getItem("sensor")   
    Data.setSenSor(JSON.parse(sensor)) 

    if(fence == null){    
        var data = JSON.stringify(DataBase.getFence())
        window.localStorage.setItem("fence", data)           
    }
    fence = window.localStorage.getItem("fence")   
    Data.setFence(JSON.parse(fence)) 
    
    if(user == null){      
      //var data = JSON.stringify(DataBase.getUser())
     // window.localStorage.setItem("user", data)   
      $scope.checkLogin() 
    }
    else{
        user = window.localStorage.getItem("user")
        Data.setUser(user)
        console.log("Not null")
        //$scope.checkStatus()
    }       
  }

 

  $scope.checkLogin = function(){
    user = window.localStorage.getItem("user")
    if(user == null){
        $scope.show('pages/tabbar/login.html')
    }   
  } 
  
  init() 

  var test = [1, 2]
  console.log(test)
  test.shift()
  test.push(3)
  console.log(test)
});
