var app = angular.module('AppMaps', ['ngMaterial', 'ngMap']);

app.controller("TabOneCtrl", function($scope) {
	$scope.title = "Count Upwards";

});

//	Documentacion api

app.controller('MapCtrl', ['$scope', '$http', function ($scope, $http, NgMap) {
  	var vm = this;
	var map;
	var infowindow;
    $scope.initialize = function() {
		var bahia = {lat: -38.7167, lng: -62.2833};

        map = new google.maps.Map(document.getElementById('map'), {
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

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
            location: bahia,
              radius: 5000,
              type: ['atm']
            }, callback);
    }        
    google.maps.event.addDomListener(window, 'load', $scope.initialize); 
  
	function callback(results, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				createMarker(results[i]);
			}
			$scope.markerlist = results;
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
