app.controller('login', function ($scope, $http, $q, $interval, DataBase, Data) { 

  var user
  var ip
  $scope.light

  $scope.checkStatus = function(){
    var www = "http://" + ip + '/CHECK' 
    $scope.light = Data.getLight()     
    $http.get(www).success(function(data){
        var changDigitToBoolean = {'1': true, '0': false}

        for(var i  = 0; i < $scope.light.length; i++){
          $scope.light[i].status = changDigitToBoolean[data[i]]

        }         
    })
	 }

   $scope.login = function(dlg, username, password){  
    console.log("login")
      if(username == "test" && password == "test"){
        dlg.hide()   
        $scope.tabtest.loadPage("pages/tabbar/home.html")     
      } else{
          ip = Data.getIP()
          var www = "http://" + ip + '/LOGIN/USER:' + username + '/PASS:' + password
          $http.get(www).success(function(data){
              if(data == 1){   
                  window.localStorage.setItem("user", username) 
                  Data.setUser(username)     
                  dlg.hide()   
                  $scope.tabtest.loadPage("pages/tabbar/home.html")                           
              }
            })  
      }      
    }
});
