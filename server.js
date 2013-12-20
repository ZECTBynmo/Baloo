var express = require('express'),
	config = require("./config"),
    path = require('path'),
    http = require('http'),
    io = require('socket.io'),
    Router = require(__dirname + '/routes/router').Router,
    router = new Router();

var app = express();

app.configure( function() {
	app.set( 'port', process.env.PORT || config.port );
    app.use( express.logger('dev') );  /* 'default', 'short', 'tiny', 'dev' */
    app.use( express.bodyParser() ),
    app.use( express.static(path.join(__dirname, 'public')) );
    app.use( "/uploads", express.static(path.join(__dirname, 'uploads')) );

    app.get( '/adminpanel', router.adminpanel );
    app.post( '/upload',    router.upload );
});

// Create our server
var server = http.createServer(app).listen(app.get('port'), function () {
    console.log( "Express server listening on port " + app.get('port') );
});

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(err);
});