var app = angular.module('AppMaps', ['ngMaterial', 'ngMap']);

var token, registrado;
app.controller("TabOneCtrl", function ($scope) {
	$scope.title = "Count Upwards";

});

//	Documentacion api


app.controller('MapCtrl', ['$scope', '$http', '$location', 'NgMap', function ($scope, $http, $location, NgMap) {
    $scope.marker = null;
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

	/*
		Agrega un comenario al marcador correspondiente
	*/
	$scope.addComentario = function(id) {
		$http.post("/comments/"+id, $scope.comment).then(function(response){
            //console.log(response);
           cargaComentariosApp(id);
        });
    };
    
    $scope.mostrarLugar = function(marker) {
        //console.log("Entre a mostrarLugar con");
       // console.log(marker);
        NgMap.getMap().then(function (map) {
            map.setZoom(20);
            map.setCenter(new google.maps.LatLng(marker.lat, marker.lng));
        });
        $scope.marker = marker;
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
        cargaComentariosFB(id);
		cargaComentariosApp(id);
	}
    
    function cargaComentariosFB(id) {
		$scope.fbhref = $location.absUrl()+"/"+id;
        FB.XFBML.parse();
	}
	
	function cargaComentariosApp(id) {
		$http.get('/comments/'+id).then(function(response) {
	   		//console.log("data recibida");
			$scope.comments = response.data;
			$scope.comment = null;
		});
	}  
	
}]);


app.controller('AdminCtrl', ['$scope', '$http', 'NgMap', function ($scope, $http, NgMap) {
    var mapa; 
	$scope.form_g = true;
	$scope.form_app = true;
	
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
		$scope.form_app = true;
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
		$scope.form_g = true;
	}
    /*
      Metodo que se ecarga de agregar un marcador de la bd
    */
	function addMarker(marker) {
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
			mostrarLugar(response.data);
        });
		$scope.form_app = false;
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
		$scope.form_app = true;
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
		$scope.marker_app = null;
		$scope.form_app = true;
	}
	
	$scope.deselectMaker_app = function() {
        $scope.marker_app = null;
		$scope.form_app = true;
    }	
	
	$scope.deselectMaker_g = function() {
        $scope.marker_g = null;
		$scope.form_g = true;
    }
		
	$scope.editGoogleMarker = function(marker) {
		$scope.form_g = false;
		$scope.marker_g = marker;
		$scope.marker_g.lat = marker.geometry.location.lat();
		$scope.marker_g.lng = marker.geometry.location.lng();
		mostrarLugarG(marker);
    };
	

    $scope.click = function(event) {
        buscarMarcadores(event);
    }	
	/*
		Muestra marcador en el panel
	*/
	function mostrarLugar(marker) {
		//console.log("Entre a mostrarLugar con");
        //console.log(marker);
		//console.log(mapa);
		mapa.setZoom(20);
        mapa.setCenter(new google.maps.LatLng(marker.lat, marker.lng));
   
    }
	
	function mostrarLugarG(marker) {
		//console.log("Entre a mostrarLugar con");
        //console.log(marker);
		//console.log(mapa);
		mapa.setZoom(20);
        mapa.setCenter(new google.maps.LatLng(marker.geometry.location.lat(), marker.geometry.location.lng()));
   
    }
    
   /* $scope.mostrarLugarMarker = function(marker){
        //console.log("Entre a mostrarLugar con");
        console.log(marker);
        NgMap.getMap().then(function(map) {
            map.setZoom(20);
            map.setCenter(marker.latLng);
        });
    }*/

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

