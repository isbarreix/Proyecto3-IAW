var app = angular.module('AppMaps', ['ngMaterial', 'ngMap']);

app.controller("TabOneCtrl", function($scope) {
	$scope.title = "Count Upwards";

});

//	Documentacion api

app.controller('MapCtrl', ['$scope', '$http','NgMap', function ($scope, $http, NgMap) {
    NgMap.getMap().then(function(map) {
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
            location: map.getCenter(),
              radius: 5000,
              type: ['atm']
            }, callback);
        
        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    //createMarker(results[i]);
                    console.log(results[i]);
                }
                $scope.positions = results;
                $scope.markerlist = results;
            }
        }
      });

    var refresh = function(){ $http.get("/comments").then(function(response){
       console.log("data recibida");
        $scope.comments =response.data;
       $scope.comment = null;
    });                             
             }
   refresh();
    
    $scope.addComentario = function(){
        console.log("hola");
        console.log($scope.comment);
        $http.post("/comments", $scope.comment).then(function(response){
            console.log(response.data);
            refresh();
        });
    };

}]);


app.controller('AdminCtrl', ['$scope', '$http', function ($scope, $http) {
var vm = this;
	var map;
	var infowindow;
    $scope.initialize = function() {
		var bahia = {lat: -38.7167, lng: -62.2833};

        map = new google.maps.Map(document.getElementById('mapAdmin'), {
            center: bahia,
            zoom: 15
        });
        
        google.maps.event.addListener(map, "click", function (event) {
                var latitude = event.latLng.lat();
                var longitude = event.latLng.lng();
                console.log( latitude + ', ' + longitude );
                var locacionActual = {lat: latitude, lng: longitude};
            
                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch({
                    location: locacionActual,
                      radius: 5000,
                      type: ['atm']
                    }, callback);
                
            }); //end addListener

        getMarcadores();
		
        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
            location: bahia,
              radius: 5000,
              type: ['atm']
            }, callback);
        
  
    }        
    google.maps.event.addDomListener(window, 'load', $scope.initialize); 
  
	function getMarcadores(){
		$http.get('/markerApplist').then(function(response) {
			//	console.log(response.data);
			$scope.markerApplist = response.data;
		 });
	}
	
	function callback(results, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				createMarker(results[i]);
			}
			$scope.markerGooglelist = results;
		}
	}

	function createMarker(place) {
		var placeLoc = place.geometry.location;
		var marker = new google.maps.Marker({
			map: map,
			position: place.geometry.location
		});

	google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(place.name);
			infowindow.open(map, this);
		});
	}

}]);
