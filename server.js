const hostname = '127.0.0.1';
const port = 3000;
const path = require('path');
var express = require("express");
var mongojs = require('mongojs');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file


var db = mongojs('comments', ['comments']);
var dbMarkerApp = mongojs('markerlist', ['markerlist']);
var bodyParser = require("body-parser");
var app = express();
// carpeta node_modules
app.use('/modules', express.static(__dirname + '/node_modules/'));


app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());

// =================================================================
// configuration ===================================================
// =================================================================
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));

// use morgan to log requests to the console
//app.use(morgan('dev'));

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
apiRoutes.post('/authenticate', function(req, res) {

	// find the user
	Admin.findOne({
		name: req.body.name
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

			// check if password matches
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				// if user is found and password is right
				// create a token
				var token = jwt.sign(user, app.get('superSecret'), {
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

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

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

apiRoutes.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.use('/api', apiRoutes);


// ---------------------------------------------------------
// non authenticated routes
// ---------------------------------------------------------




app.get("/comments", function (req, resp){
    console.log("I received a get");
    
    db.comments.find(function(err,docs){
        //console.log(docs);
        resp.json(docs);
    })
});

app.post("/comments", function(req,resp){
    console.log(req.body);
    db.comments.insert(req.body, function(err,doc){
        resp.json(doc);
    })
});

//	get listMaker
app.get("/markerapplist", function(req, res) {
    dbMarkerApp.markerlist.find(function (err, docs) {
        res.json(docs);
    });
});


//	get Marker
app.get('/markerapplist/:id', function(req, res) {
    var id = req.params.id;
    dbMarkerApp.markerlist.findOne({_id: mongojs.ObjectId(id)}, function(err, docs) {
       res.json(docs); 
    });
});

//	post Maker

app.post('/markerapplist', function(req, res) { 
    dbMarkerApp.markerlist.insert(req.body, function(err, docs) {
       res.json(docs); 
    });
});


// =================================================================
// start the server ================================================
// =================================================================


app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


