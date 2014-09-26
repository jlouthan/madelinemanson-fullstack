'use strict';

var express = require('express');
var exphbs  = require('express-handlebars');
var http = require('http');
var path = require('path');
var request = require('request');
var methodOverride = require('method-override');
var multipart = require('connect-multiparty');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3005);
app.set('views', path.join(__dirname, 'views'));

app.use(express.logger('dev'));
app.use(express.json());
// app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(multipart());
app.use(methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
	res.render('index');
});

app.get('/home', function (req, res) {
    res.render('home');
});

app.get('/print', function (req, res) {
	res.render('set');
});

app.get('/textile', function (req, res) {
	res.render('collection');
});

app.get('/textile/:textileId', function (req, res){
	res.render('set');
});

app.get('/object', function (req, res) {
	res.render('collection');
});

app.get('/object/:objectId', function (req, res){
	res.render('set');
});

app.get('/about', function (req, res){
	res.render('about');
});

app.get('/friends', function (req, res){
	res.render('friends');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});