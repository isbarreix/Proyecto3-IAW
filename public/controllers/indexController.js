var app = angular.module('AppMaps', ['ngMaterial', 'ngMap']);

var token, registrado;
app.controller("TabOneCtrl", function ($scope) {
	$scope.title = "Count Upwards";

});

//	Documentacion api


app.controller('MapCtrl', ['$scope', '$http', '$location', 'NgMap', function ($scope, $http, $location, NgMap) {
    
	$scope.fbhref = $location.absUrl();
    var mapa;
	
    NgMap.getMap().then(function (map) {
		mapa = map;
	});
	
    function getMarcadores() {
			$http.get('/markerApplist').then(function (response) {
				//	console.log(response.data);
				$scope.markerApplist = response.data;
			 });
	}
    
    getMarcadores();

    var refresh = function () { 
		$http.get("/comments").then(function (response) {
       //console.log("data recibida");
        	$scope.comments = response.data;
       		$scope.comment = null;
		});
	};
	
   refresh();
    
    $scope.addComentario = function() {
        //console.log($scope.comment);
        $http.post("/comments", $scope.comment).then(function(response){
            //console.log(response.data);
            refresh();
        });
    };
    
    $scope.mostrarLugar = function(marker) {
        //console.log("Entre a mostrarLugar con");
       // console.log(marker);
        NgMap.getMap().then(function (map) {
            map.setZoom(20);
            map.setCenter(new google.maps.LatLng(marker.lat, marker.lng));
        });
        
        cargarComentarios(marker._id);
    }
    
    $scope.mostrarLugarMarker = function(marker){
        //console.log("Entre a mostrarLugar con");
        //console.log(marker);
        NgMap.getMap().then(function(map) {
            map.setZoom(20);
            map.setCenter(marker.latLng);
        });
    }
    
    function cargarComentarios(id){
        $scope.fbhref = $location.absUrl()+"/"+id;
	}

}]);


app.controller('AdminCtrl', ['$scope', '$http', 'NgMap', function ($scope, $http, NgMap) {
    var mapa; 
  	$scope.registrado = function() {
      return registrado;
    }
    
    $scope.loginAdmin = function() {
        $http.post("/api/login", $scope.admin).then(function(response){
            //console.log(response.data.token);
            token = response.data.token;
            registrado = true;
        });
    }
    
    function buscarMarcadores(event){
        
        NgMap.getMap().then(function(map) {
		var service = new google.maps.places.PlacesService(map);
        if(event){
            map.setCenter(event.latLng);
        }
		service.nearbySearch({
			location: map.getCenter(),
			  radius: 5000,
			  type: ['atm']
			}, callback);

		function callback(results, status) {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
                //console.log(results);
				$scope.markerGooglelist = results;
			}
		}
        mapa = map;
        });
    }
	
    buscarMarcadores();
    getMarcadores();
    
	function getMarcadores(){
			$http.get('/markerApplist').then(function(response) {
				//	console.log(response.data);
				$scope.markerApplist = response.data;
			 });
	}	
	
	$scope.addMarkerApp = function() {
     	addMarker($scope.marker_app);
		$scope.marker_app = null;
		console.log($scope.markerAppForm);
		$scope.markerAppForm.$dirty = false;
		console.log($scope.markerAppForm);
    };
	
	$scope.addMarkerG = function() {
		// una vez qe estan en la base se los restringe al tipo maker_app
		var marker = {
			name : $scope.marker_g.name,
			vicinity : $scope.marker_g.vicinity,
			lat : $scope.marker_g.lat,
			lng : $scope.marker_g.lng,
            /*rate: $scope.marker_g.rating,*/
            description: $scope.marker_g.description
		}
		addMarker(marker);
		$scope.marker_g = null;
	}
    /*
      Metodo que se ecarga de agregar un marcador de la bd
    */
	function addMarker(marker){
        var request = { marker: marker, token: token  };
       // console.log(request);
		$http.post('/api/markerapplist', request).then(function(response) {
        	//console.log(response);
			getMarcadores();
        });
	}
	/*
      Metodo que se ecarga de traer un marcador de la bd
    */
	$scope.editAppMarker = function(id) {
		$http.get('/markerapplist/'+id).then(function(response) {
            //console.log(response.data);
			$scope.marker_app = response.data; 
        });
    };
    
    /*
      Metodo que se ecarga de editar un marcador de la bd
    */
    $scope.updateMarker = function(id) {
      //	console.log($scope.marker_app._id)
      	var request = { marker: $scope.marker_app, token: token  };
		$http.put('/api/markerapplist/'+id, request).then(function(response) {
        	//console.log(response);
			getMarcadores();
        });
		$scope.marker_app = null;
    }
	
	/*
      Metodo que se ecarga de elimina un marcador de la bd
    */
	$scope.removeMarker = function(id) {
		var request = { marker: $scope.marker_app, token: token  };
		$http.post('/api/markerapplist/'+id, request).then(function(response) {
        	//console.log(response);
			getMarcadores();
        });
	}
	
	$scope.deselectMaker_app = function() {
        $scope.marker_app = null;
    }	
	
	$scope.deselectMaker_g = function() {
        $scope.marker_g = null;
    }
		
	$scope.editGoogleMarker = function(marker) {
		$scope.marker_g = marker;
		$scope.marker_g.lat = marker.geometry.location.lat();
		$scope.marker_g.lng = marker.geometry.location.lng();
    };
	

    
    $scope.click = function(event) {
        buscarMarcadores(event);
    }	

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
        $http.post("/api/login", $scope.admin).then(function(response){
            //console.log(response.data.token);
            token = response.data.token;
            registrado = true;
        });
    }
}]);

