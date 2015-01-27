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
        },
        // Returns 2 HTML data attributes in the format 'data-src="[url]" data-src-retina="[url]"' to be used in conjunction with unveil.js
        retinaImg: function(param1, param2) {
            imageData = 'data-src="' + param1 + '" data-src-retina="' + param2 + '"';
            return(imageData);
        },
        toLowerCase: function(str) {
            return str.toLowerCase();
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
        if(pageView === 'set-prints'){
            // find the index of the print by slug
            for(var i = 0; i < feed.prints.length; i++){
                if(feed.prints[i].slug === bodyClass){
                    bodyClass = i+1;
                    break;
                }
            }
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
    var path = 'etc';
    requestHandler(req, res, 'index', 'Home', 'home', [path]);
});

app.get('/prints', function (req, res) {
    var path = 'prints?{"state":"published","$sort":{"weighting":-1}}';
    requestHandler(req, res, 'list-set-prints', 'Prints', 'prints', [path]);
});

app.get('/prints/:printName', function(req, res){
    var slug = req.params.printName;
    var path = 'prints?{"state":"published","$sort":{"weighting":-1}}';
    requestHandler(req, res, 'set-prints', 'Prints', slug, [path]);
});

app.get('/textiles', function (req, res) {
    var path = 'textiles?{"state":"published","$sort":{"weighting":-1}}';
    requestHandler(req, res, 'collection', 'Textiles', 'textiles', [path]);
});

app.get('/textiles/:textileName/:textileId', function (req, res){
    var slug = req.params.textileName;
    var imageIndex = req.params.textileId;
    var path = 'textiles?state=published&slug=' + slug;
    requestHandler(req, res, 'set', 'Textiles', imageIndex, [path]);
});

app.get('/textiles/:textileName', function (req, res){
    var slug = req.params.textileName;
    var path = 'textiles?state=published&slug=' + slug;
    requestHandler(req, res, 'list-set', 'Textiles', 'textiles', [path]);
});

app.get('/objects', function (req, res) {
    var path = 'objects?{"state":"published","$sort":{"weighting":-1}}';
    requestHandler(req, res, 'collection', 'Objects', 'objects', [path]);
});

app.get('/objects/:objectName/:objectId', function (req, res){
    var slug = req.params.objectName;
    var imageIndex = req.params.objectId;
    var path = 'objects?state=published&slug=' + slug;
    requestHandler(req, res, 'set', 'Objects', imageIndex, [path]);
});

app.get('/objects/:objectName', function (req, res){
    var slug = req.params.objectName;
    var path = 'objects?state=published&slug=' + slug;
    requestHandler(req, res, 'list-set', 'Objects', 'objects', [path]);
});

app.get('/about', function (req, res){
	var cvPath = 'cv';
    var etcPath = 'etc';
    requestHandler(req, res, 'about', 'About', 'about', [cvPath, etcPath])
});

app.get('/friends', function (req, res){
    var friendsPath = 'friends?{"state":"published","$sort":{"weighting":-1}}';
    var etcPath = 'etc';
    requestHandler(req, res, 'friends', 'Friends', 'friends', [friendsPath, etcPath])
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});