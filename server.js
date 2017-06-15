const hostname = '127.0.0.1';
const port = 3000;
const path = require('path');
var express = require("express");
var mongojs = require('mongojs');
var db = mongojs('comments', ['comments']);
var bodyParser = require("body-parser");
var app = express();
// carpeta node_modules
app.use('/modules', express.static(__dirname + '/node_modules/'));


app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());
/*var mongojs = require('mongojs');
//       1er arg: base de dats, 2do ar:
//var db = mongojs('contactlist', ['contactlist']);
;*/

app.get("/comments", function (req, resp){
    console.log("I received a get");
    
    db.comments.find(function(err,docs){
        console.log(docs);
        resp.json(docs);
    })
});

app.post("/comments", function(req,resp){
    console.log(req.body);
    db.comments.insert(req.body, function(err,doc){
        resp.json(doc);
    })
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


