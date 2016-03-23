app.controller('setting', function ($scope, Data, DataBase) { 
    $scope.ip = Data.getIP()
    $scope.userName = Data.getUserName()

    var light
    var sensor
    var ip

    $scope.confirm = function() {
    ons.notification.confirm({
      title: 'ยืนยันคืนค่าระบบ',
      message: 'คุณต้องการคืนค่าเริ่มต้นของระบบหรือไม่',
      buttonLabels: ["ยกเลิก","ตกลง"],
      callback: function(idx) {
        switch(idx) {         
          case 1:
             $scope.reset()
              ons.notification.alert({
              title : 'เสร็จสิ้น',
              buttonLabels: "ตกลง",
              message: 'คืนค่าระบบเรียบร้อย'
            });
            break;
        }
      }
    });
  }

    $scope.logout = function(){
        window.localStorage.removeItem("user") 

        user = window.localStorage.getItem("user")
        Data.setUser(null)
        $scope.userName = ""   
        $scope.tabtest.setActiveTab(0)   
        $scope.checkLogin()       
    }

    $scope.setIP = function(){
      window.localStorage.setItem("ip", JSON.stringify($scope.ip)) 
      Data.setIP($scope.ip)
      console.log(Data.getIP())
    }

    $scope.reset = function(){
        
        var data = JSON.stringify(DataBase.getIP())
        window.localStorage.setItem("ip", data)  
        ip = window.localStorage.getItem("ip") 
        Data.setIP(JSON.parse(ip))
        //$scope.ip  = "555"
       // document.getElementById("demo").innerHTML =  $scope.ip   
        $scope.$apply(function() {
             $scope.ip = DataBase.getIP()
        });    

        var data = JSON.stringify(DataBase.getLight())
        window.localStorage.setItem("light", data)
        light = window.localStorage.getItem("light") 
        Data.setLight(JSON.parse(light))
                     
        var data = JSON.stringify(DataBase.getSenSor())
        window.localStorage.setItem("sensor", data)        
        sensor = window.localStorage.getItem("sensor") 
        Data.setSenSor(JSON.parse(sensor)) 

    } 
   
});
