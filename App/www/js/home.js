app.controller('home', function ($scope, $http ,$interval, Data) { 

    var checkHttp = false
    var checkHttp2 = true
    $scope.timmer = 5
    var stop
    $scope.light = Data.getLight()
    $scope.led = {}

    var ip = Data.getIP()
    var idLight

    var changBoolean = {true: "ON", false: "OFF"}

    $scope.httpSend = function(id, status){
        checkHttp = false
        $scope.timmer = 5
        var pin = $scope.light[id].pin
        console.log(id)
        var status = changBoolean[status]
        console.log(status)
        //var www = "http://" + ip + '/' + status + id
        var www = "http://" + ip + '/' + status + id    
        $http.get(www).success(function(data){
          var changDigitToBoolean = {'1': true, '0': false}
  
         
          for(var i  = 0; i < $scope.light.length; i++){
            $scope.light[i].status = changDigitToBoolean[data[i]]

          }         
      })
    }

    $scope.changPhoto = function(id){
       idLight = id
      var options = { 
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY 
      }

      navigator.camera.getPicture(function(imageData){
         //alert(imageData)
         window.resolveLocalFileSystemURI(imageData, gotFileEntry, fail);
      }, onFail, options)

    }   

    function onFail(message) {
       alert('Failed to get the picture: ' + message);
    }
   

    function gotFS(fileSystem) {
        //fileSystem.root.getFile("test.txt", null, gotFileEntry, fail);
        fileSystem.getFile("android-debug.apk", null, gotFileEntry, fail);
    }

    function gotFileEntry(fileEntry) {
        //alert(fileEntry.toURL())
        var url = fileEntry.toURL()
        var parentName = url.substring(url.lastIndexOf('/')+1)
        window.resolveLocalFileSystemURI("file:///sdcard/Android/data/com.jame.hellocordova", function(fileSystem){

          fileSystem.getDirectory("pic", {create:true}, function(directory){

             fileEntry.copyTo(directory, parentName, onSuccess, fail)
          }, fail)         
        }, fail);
       
    }

    function onSuccess(fileEntry){
        //alert("เสร็จสิ้น")
        var url = fileEntry.toURL()
        var path = url.substring(url.lastIndexOf('sdcard')-1)
        $scope.$apply(function(){

          $scope.light[idLight].pic = path 
        })
        
        var data = JSON.stringify($scope.light)
        window.localStorage.setItem("light", data)
        
    }

    function fail(error) {
        alert("Fail" + error.code);
    }

    $scope.save = function(){
      var data = JSON.stringify($scope.light)
      console.log(data)
      window.localStorage.setItem("light", data)
      Data.setLight(data)
    }

    $scope.checkStatus = function(){
       checkHttp = false
       
    var www = "http://" + ip + '/CHECK'     
    $http.get(www).success(function(data){

        var changDigitToBoolean = {'1': true, '0': false}

        for(var i  = 0; i < $scope.light.length; i++){
          $scope.light[i].status = changDigitToBoolean[data[i]]

        }
        checkHttp = true
       
    })
  }
      
  $scope.fight = function() {     

      stop = $interval(function() {
        if ($scope.timmer > 0) {
          $scope.timmer = $scope.timmer - 1;
          console.log(  $scope.timmer)
        } else {              
           $scope.timmer = 5;
     
            console.log("interval Active")
             $scope.checkStatus()
   
        }
      }, 1000);
    };

    $scope.stopFight = function() {

        $interval.cancel(stop);
        stop = undefined;

    };

    $scope.resetFight = function() {
      $scope.timmer = 1000;

    };


  $scope.$on('$destroy', function() {
         $scope.stopFight()
  });
  

  var user = window.localStorage.getItem("user") 
  if(user != null){

     $scope.checkStatus()
     $scope.fight()
  }
});
