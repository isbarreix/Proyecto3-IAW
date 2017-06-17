const hostname = '127.0.0.1';
const port = 3000;
const path = require('path');


var express = require("express");
var mongojs = require('mongojs');
var mongoose = require('mongoose');
var md5 = require("md5");

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file


var db = mongojs('comments', ['comments']);
var dbMarkerApp = mongojs('markerlist', ['markerlist']);
var bodyParser = require("body-parser");
var app = express();


var Admin= require("./public/models/admin.js");
var Marker= require("./public/models/marker.js");
var Comment= require("./public/models/comment.js");


// carpeta node_modules
app.use('/modules', express.static(__dirname + '/node_modules/'));


app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());

// =================================================================
// configuration ===================================================
// =================================================================

mongoose.connect(config.database);
app.set('superSecret', config.secret); // secret variable


// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));

// use morgan to log requests to the console
//app.use(morgan('dev'));

app.get('/setup', function(req, res) {

	// create a sample user
	var nick = new Admin({ 
		name: 'admin', 
		password: md5('admin'), 
	});
	nick.save(function(err) {
		if (err) throw err;

		console.log('User saved successfully');
		res.json({ success: true });
	});
});

// =================================================================
// routes ==========================================================
// =================================================================
// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router(); 

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
apiRoutes.post('/login', function(req, res) {
	// find the user
	Admin.findOne({
		name: req.body.username
	}, function(err, admin) {

		if (err) throw err;

		if (!admin) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (admin) {

			// check if password matches
			if (admin.password != md5(req.body.password)) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				// if user is found and password is right
				// create a token
				var token = jwt.sign(admin, app.get('superSecret'), {
					expiresIn: 86400 // expires in 24 hours
				});

				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}		

		}

	});
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {
    //console.log(req.body);
    
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
	
});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
apiRoutes.get('/', function(req, res) {
	res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.post('/markerapplist', function(req, res) {
    //se crea el modelo marker
    //falta validar
    var marker = new Marker({ 
		name: req.body.marker.name,
        vicinity: req.body.marker.vicinity,
        lat: req.body.marker.lat,
        lng: req.body.marker.lng,
        /*description: req.body.marker.description*/
        description: 'TBD'
	});
    
	marker.save( function(err) {
		if (err) throw err;

		//console.log('Marker saved successfully');
		res.json({ success: true });
	});
    
	/*dbMarkerApp.markerlist.insert(req.body.marker, function(err, docs) {
       res.json(docs); 
    });
    */
});


/*
	Edita un marcador en la bd
*/
apiRoutes.put('/markerapplist/:id', function(req, res) {
	var id = req.params.id;
	Marker.findById(id, function (err, marker) {
		
			marker.name = req.body.marker.name;
        	marker.vicinity = req.body.marker.vicinity;
        	marker.lat = req.body.marker.lat;
        	marker.lng = req.body.marker.lng;
        	marker.description = req.body.marker.description;
		
			marker.save(function(err) {
				if (err) throw err;
				res.json({ success: true });
			});
	});

});


/*
	Elimina un marcador de la bd
*/
apiRoutes.delete('/markerapplist/:id', function(req, res) {
	console.log("HOLAQQQQQQQQQQQQ"+id);
	/*var id = req.params.id;
	Marker.findByIdAndRemove(id, function(err, marker) {
		if (err) throw err;

		//console.log('Marker saved successfully');
		res.json({ success: true });
	});
*/
});

apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.use('/api', apiRoutes);


// ---------------------------------------------------------
// non authenticated routes
// ---------------------------------------------------------




app.get("/comments", function (req, resp){
    //console.log("I received a get");
    
    Comment.find(function(err,docs){
        //console.log(docs);
        resp.json(docs);
    })
});

app.post("/comments", function(req,resp){
    //console.log(req.body);
    var comentario = new Comment({
        name: req.body.name,
        comment: req.body.comment
    })
    comentario.save(function(err,doc){
        resp.json(doc);
    })
});

//	get listMaker
app.get("/markerapplist", function(req, res) {
    
    Marker.find(function (err, docs) {
        res.json(docs);
    });
});


//	get Marker
app.get('/markerapplist/:id', function(req, res) {
    var id = req.params.id;
    Marker.findOne({_id: mongojs.ObjectId(id)}, function(err, docs) {
       res.json(docs); 
    });
});


// =================================================================
// start the server ================================================
// =================================================================


app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


