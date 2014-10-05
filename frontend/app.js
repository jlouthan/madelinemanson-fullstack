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
        },
        ifEq: function(param1, param2, options) { 
            if ( param1 === param2) {
                return options.fn(this);     
            }            
        },
        ifNeq: function(param1, param2, options) {
            if ( param1 != param2 ) {
                return options.fn(this);
            }
        },
        ifMod: function(param1, param2, param3, options) { 
            if ( param1 % param2 == param3) {
                return options.fn(this);     
            }            
        },
        add: function(param1, param2) {
            return param1 + param2;
        },
        addIfEq: function(param1, param2, param3, options){
            console.log(param1 + '' + param2 + '' + param3);
            if (param1 + param2 == param3) {
                return options.fn(this);
            }
        },
        addIfNeq: function(param1, param2, param3, options){
            if (param1 + param2 != param3) {
                return options.fn(this);
            }
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
    	console.log(feed);
        if(feed.textiles){
            feed.collectionItems = feed.textiles;
            delete feed.textiles;
        }
        else if(feed.textile){
            feed.setItem = feed.textile;
            delete feed.textile;
        }
        if(feed.objects){
            feed.collectionItems = feed.objects;
            delete feed.objects;
        }
        else if(feed.object){
            feed.setItem = feed.object;
            delete feed.object;
        }
        console.log(feed);
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

app.get('/prints', function (req, res) {
	res.render('collection', {title: 'prints'});
});

app.get('/prints/:printName', function(req, res){
	res.render('set');
});

app.get('/textiles', function (req, res) {
    var path = 'textiles?state=published';
    requestHandler(req, res, 'collection', 'Madi Manson - Textiles', 'textiles', [path]);
	// res.render('collection', {title: 'textiles'});
});

app.get('/textiles/:textileName/:textileId', function (req, res){
    var slug = req.params.textileName;
    var imageIndex = req.params.textileId;
    var path = 'textiles?state=published&slug=' + slug;
    requestHandler(req, res, 'set', 'Madi Manson - Textiles', imageIndex, [path]);
});

app.get('/textiles/:textileName', function (req, res){
    var slug = req.params.textileName;
    var path = 'textiles?state=published&slug=' + slug;
    requestHandler(req, res, 'list-set', 'Madi Manson - Textiles', 'textiles', [path]);
});

app.get('/objects', function (req, res) {
    var path = 'objects?state=published';
    requestHandler(req, res, 'collection', 'Madi Manson - Objects', 'objects', [path]);
});

app.get('/objects/:objectName/:objectId', function (req, res){
    var slug = req.params.objectName;
    var imageIndex = req.params.objectId;
    var path = 'objects?state=published&slug=' + slug;
    requestHandler(req, res, 'set', 'Madi Manson - Objects', imageIndex, [path]);
});

app.get('/objects/:objectName', function (req, res){
    var slug = req.params.objectName;
    var path = 'objects?state=published&slug=' + slug;
    requestHandler(req, res, 'list-set', 'Madi Manson - Objects', 'objects', [path]);
});

app.get('/about', function (req, res){
	var path = 'cv';
    requestHandler(req, res, 'about', 'Madi Manson - About', 'about', [path])
});

app.get('/friends', function (req, res){
    var path = 'friends?state=published';
    requestHandler(req, res, 'friends', 'Madi Manson - Friends', 'friends', [path])
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});