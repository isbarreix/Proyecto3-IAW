var app = angular.module('AppMaps', ['ngMaterial', 'ngMap']);

app.controller("TabOneCtrl", function($scope) {
	$scope.title = "Count Upwards";

});

//	Documentacion api

app.controller('MapCtrl', ['$scope', '$http', function ($scope, $http, NgMap) {
  	var vm = this;
  	// Iniciar Mapa 
    /*NgMap.getMap().then(function(map) {
		vm.map = map;
        console.log(map.getCenter());
		console.log('markers', map.markers);
		console.log('shapes', map.shapes);
	});*/
  
	// Marcadores de prueba
	mk1 = {
		name: 'ATM Provincia',
		pos: [40.71, -74.21],
		descrip: 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.'
	};
	mk2 = {
		name: 'ATM Link',
        pos: [40.74, -74.18],
		descrip: 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.'
	};
	mk3 = {
		name: 'ATM Galicia',
		pos: [40.77, -74.15],
		descrip: 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.'
	};

	var markerlist = [mk1, mk2, mk3];
	$scope.markerlist = markerlist;
  
    vm.showData = function() {
      console.log("asdasd");
    };



}]);
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