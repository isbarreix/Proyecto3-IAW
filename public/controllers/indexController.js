var app = angular.module('AppMaps', ['ngMaterial', 'ngMap']);

app.controller("TabOneCtrl", function($scope) {
	$scope.title = "Count Upwards";

});

//	Documentacion api

app.controller('MapCtrl', function(NgMap) {
  NgMap.getMap().then(function(map) {
    console.log(map.getCenter());
    console.log('markers', map.markers);
    console.log('shapes', map.shapes);
  });
});

/*

app.controller('MapCtrl', function($scope) {
      
       $scope.initialize = function() {
          var map = new google.maps.Map(document.getElementById('map'), {
             center: {lat: -34.397, lng: 150.644},
             zoom: 8
          });
       }    
       
       google.maps.event.addDomListener(window, 'load', $scope.initialize);   

    });

*/

