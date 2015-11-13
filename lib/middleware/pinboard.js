var request = require( "request" );
var parseString = require( "xml2js" ).parseString;
var handleError = require( "../util/util" );
var cache = require( "memory-cache" );

var DEFAULT_CACHE_MSEC = 1000 * 60 * 5; // 5 mins

var Pinboard = {
  source: "pinboard",
  routes: [
    {
      method: "GET",
      path: "",
      handler: function( req, res ) {
        var cachedResult = cache.get( "pinboard" );
        if ( cachedResult ) return res.json( cachedResult );

        var url = "https://api.pinboard.in/v1/posts/recent?auth_token=" + this.auth_token;
        request( { url: url, headers: { "User-Agent": this.me, "Auth": this.auth_token } }, function( err, response, body ) {

          // Console.log( body );

          // If ( err || response.statusCode != 200 ) return handleError( err, res );
          var data = {};
          parseString( body, function( err, result ) {
             data = JSON.stringify( result );
          } );

          // Console.log( data );
          cache.put( "pinboard", data, DEFAULT_CACHE_MSEC );
          return res.json( JSON.parse( data ) );
        } );
      }
    }
  ]
};

module.exports = Pinboard;
