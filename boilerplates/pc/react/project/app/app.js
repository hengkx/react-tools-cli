var express = require('express');
var app = express();
var path = require('path');
var compression = require('compression');  
app.use(compression());  
app.use('/',express.static(__dirname + '/'));

app.get('*', function (req, res) {
  res.sendFile(path.resolve('index.html'));
});

app.listen(9000, function () {
  console.log('Example app listening on port 9000!');
});