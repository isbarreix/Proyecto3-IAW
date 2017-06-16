var app = angular.module('AppMaps', ['ngMaterial', 'ngMap']);

app.controller("TabOneCtrl", function($scope) {
	$scope.title = "Count Upwards";

});

//	Documentacion api


app.controller('MapCtrl', ['$scope', '$http','$location', 'NgMap', function ($scope, $http, $location, NgMap) {
    
    $scope.fbhref=$location.absUrl();
    
    NgMap.getMap().then(function(map) {
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
            location: map.getCenter(),
              radius: 10000,
              type: ['atm']
            }, callback);
        
        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                //$scope.positions = results;
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


app.controller('AdminCtrl', ['$scope', '$http', 'NgMap', function ($scope, $http, NgMap) {
	NgMap.getMap().then(function(map) {
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch({
			location: map.getCenter(),
			  radius: 5000,
			  type: ['atm']
			}, callback);

		getMarcadores();

		function callback(results, status) {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				$scope.markerGooglelist = results;
			}
		}
  });
	
	function getMarcadores(){
			$http.get('/markerApplist').then(function(response) {
				//	console.log(response.data);
				$scope.markerApplist = response.data;
			 });
	}	
	
	$scope.addMarkerApp = function() {
     	addMarker($scope.marker_app);
    };
	
	$scope.addMarkerG = function() {
		// una vez qe estan en la base se los restringe al tipo maker_app
		var marker = {
			name : $scope.marker_g.name,
			vicinity : $scope.marker_g.vicinity,
			lat : $scope.marker_g.lat,
			lng : $scope.marker_g.lng
		}
		addMarker(marker);
	}
	
	function addMarker(marker){
		$http.post('/markerapplist', marker).then(function(response) {
        	console.log(response);
			getMarcadores();
        });
	}
	
	$scope.editAppMarker = function(id) {
		$http.get('/markerapplist/'+id).then(function(response) {
            //console.log(response.data);
			$scope.marker_app = response.data; 
        });
    };
	
	$scope.deselectMaker_app = function() {
        //$scope.marker_app="";
    }	
	
	$scope.deselectMaker_g = function() {
       // $scope.marker_g="";
    }
		
	$scope.editGoogleMarker = function(marker) {
		$scope.marker_g = marker;
		$scope.marker_g.lat = marker.geometry.location.lat();
		$scope.marker_g.lng = marker.geometry.location.lng();
    };
	
	
	
}]);
/*
	google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(place.name);
			infowindow.open(map, this);
		});
	}

<<<<<<< HEAD
;*/


app.controller("LoginController",['$scope','$http', function($scope,$http) {
    
    $scope.loginAdmin = function(){
        $http.post("/login", $scope.admin).then(function(response){
            console.log(response.data);
        });
    }
}]);

