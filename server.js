const hostname = '127.0.0.1';
const port = 3000;
const path = require('path');
var express = require("express");
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

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
