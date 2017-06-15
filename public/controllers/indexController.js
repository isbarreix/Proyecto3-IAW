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
		var pyrmont = {lat: -33.867, lng: 151.195};

        map = new google.maps.Map(document.getElementById('map'), {
            center: pyrmont,
            zoom: 15
        });

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
            location: pyrmont,
              radius: 500,
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

 

}]);
