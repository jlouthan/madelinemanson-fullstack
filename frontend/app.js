'use strict';

var express = require('express');
var exphbs  = require('express-handlebars');
var http = require('http');
var path = require('path');
var request = require('request');
var methodOverride = require('method-override');
var multipart = require('connect-multiparty');
var marked = require('marked');

var app = express();

var hbs = exphbs.create({
	defaultLayout: 'main',
	helpers: {
		markdown: function(options) {
            return marked(options.fn(this));
        }
	}
});

app.engine('handlebars', hbs.engine);
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

var hostName = 'http://api.madelinemanson.com/';

var requestHandler = function(req, res, pageView, pageTitle, bodyClass, paths){

    var results = {};
    var completed = 0;
    var completionCallback = function(feed){
    	// console.log(feed);
    	console.log(feed.cv[0].content);
    	feed = feed.cv[0];
        res.render(pageView,{
            title: pageTitle,
            bodyClass: bodyClass,
            jsonFeed: feed
        });
    };
    
    var requestCallback = function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var key = response.request.uri.path.slice(1);
            var index = key.indexOf('?');
            if (index != -1){
                // key = key.slice(0, index-1);
                key = key.indexOf('slug') == -1 ? key.slice(0, index) : key.slice(0, index-1);
            }
            console.log("fetched results for: "+key);
            results[key] = JSON.parse(body);
            completed++;
            if (completed === paths.length){
                completionCallback(results);
            }
        }
    };
    for (var i = paths.length - 1; i >= 0; i--) {
        request(hostName + paths[i], requestCallback);
    }
};

app.get('/', function (req, res) {
	res.render('index');
});

app.get('/home', function (req, res) {
    res.render('home');
});

app.get('/print', function (req, res) {
	res.render('collection', {title: 'print'});
});

app.get('/print/:printName', function(req, res){
	res.render('set');
});

app.get('/textile', function (req, res) {
	res.render('collection', {title: 'textile'});
});

app.get('/textile/:textileName/:textileId', function (req, res){
	res.render('set');
});

app.get('/textile/:textileName', function (req, res){
	res.render('list-set');
});

app.get('/object', function (req, res) {
	res.render('collection', {title: 'object'});
});

app.get('/object/:objectName/:objectId', function (req, res){
	res.render('set');
});

app.get('/object/:objectName', function (req, res){
	res.render('list-set');
});

app.get('/about', function (req, res){
	var path = 'cv';
    requestHandler(req, res, 'about', 'Madi Manson - About', 'about', [path])
	// res.render('about');
});

app.get('/friends', function (req, res){
	res.render('friends');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});