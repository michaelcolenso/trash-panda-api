var express = require( "express" );
var path = require( "path" );
var logger = require( "morgan" );
var ApiRouter = require( "./router" );
var me = require( "../me" );
var http = require( "http" );
var errorhandler = require( "errorhandler" );
var config = require( "../config" );
var cors = require( "cors" );
var bodyParser = require( "body-parser" );
var app = express();

app.set( "json spaces", 4 );
app.use( logger( "dev" ) );

// Allow Ajax GET calls
app.use( function( req, res, next ) {
  res.setHeader( "Access-Control-Allow-Origin", "*" );
  res.setHeader( "Access-Control-Allow-Methods", "GET" );

  //Res.setHeader( "Access-Control-Allow-Headers", "X-Requested-With,content-type" );
  next();
} );

app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( cors() );

app.use( "/", ( new ApiRouter( me, config.modules, config.settings ) ).router );
app.use( require( "../protected-routes" ) );
app.use( require( "../user-routes" ) );
app.use( require( "../anonymous-routes" ) );

// Catch 404 and forward to error handler
app.use( function( req, res, next ) {
  var err = new Error( "Not Found" );
  err.status = 404;
  next( err );
} );

// Error handlers

// Development error handler
// will print stacktrace
if ( app.get( "env" ) === "development" ) {
  app.use( function( err, req, res ) {
    res.status( err.status || 500 );
    res.json( {
      message: err.message,
      error: err
    } );
  } );
}

// Production error handler
// no stacktraces leaked to user
app.use( function( err, req, res ) {
  res.status( err.status || 500 );
  res.json( {
    message: err.message,
    error: {}
  } );
} );

module.exports = app;
