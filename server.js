const hostname = '127.0.0.1';
const port = 3000;
const path = require('path');
var express = require("express");
var mongojs = require('mongojs');
var db = mongojs('comments', ['comments']);
var dbMarkerApp = mongojs('markerlist', ['markerlist']);
var bodyParser = require("body-parser");
var app = express();
// carpeta node_modules
app.use('/modules', express.static(__dirname + '/node_modules/'));


app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());


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


app.get("/markerapplist", function(req, res) {
    dbMarkerApp.markerlist.find(function (err, docs) {
        res.json(docs);
    });
});


app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


