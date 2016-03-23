app.controller('sensor', function ($scope, $http, Data, $interval) { 

    $scope.sensor = Data.getSenSor()
    $scope.fence = Data.getFence()
    $scope.timmer = 5
    var stop
    var ip = Data.getIP()
    $scope.pickPhoto = function(){
      var options = { 
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY 
      }

      navigator.camera.getPicture(function(imageData){
         alert(imageData)
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
        alert(fileEntry.toURL())
        var url = fileEntry.toURL()
        var parentName = url.substring(url.lastIndexOf('/')+1)
        window.resolveLocalFileSystemURI("file:///sdcard/Android/data/com.jame.hellocordova", function(fileSystem){

          fileSystem.getDirectory("pic", {create:true}, function(directory){

             fileEntry.copyTo(directory, parentName, onSuccess, fail)
          }, fail)         
        }, fail);
       
    }

    function onSuccess(fileEntry){
        alert(fileEntry.toURL())
        var url = fileEntry.toURL()
        var path = url.substring(url.lastIndexOf('sdcard')-1)
        
        $scope.sensor[0].pic = path 
        var data = JSON.stringify($scope.sensor)
        window.localStorage.setItem("sensor", data)
    }

    function fail(error) {
        alert("Fail" + error.code);
    }

      $scope.checkSensor = function(){
      var www = "http://" + ip + '/SENSOR' 
      console.log("checkSensor")    
      $http.get(www).success(function(data){
        console.log(data);
          var changDigitToBoolean = {'1': "OPEN", '0': "CLOSE"} 
         
          for(var i  = 0; i < $scope.sensor.length; i++){
            $scope.sensor[i].status = changDigitToBoolean[data[i]]

          }
         
      })
  }

   $scope.moTorHTTP = function(status){
      var www = "http://" + ip + '/MOTOR/' + status 
       console.log(www)
      $http.get(www).success(function(){   
                 
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
            $scope.checkSensor()

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

     $scope.checkSensor()
     $scope.fight()
  }
   
});
