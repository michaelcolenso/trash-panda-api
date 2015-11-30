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
        request( { url: url, headers: { "User-Agent": this.me, "Auth": this.auth_token }, qs: { count: 100 } }, function( err, response, body ) {

          // Console.log( body );

          if ( err || response.statusCode != 200 ) return handleError( err, res );
          var data = {};
          parseString( body, { explicitArray: false }, function( err, result ) {
             data = JSON.stringify( result );
            cache.put( "pinboard", data, DEFAULT_CACHE_MSEC );
            console.log( data );
            return res.json( data );
          } );

          // Console.log( data );
        } );
      }
    }
  ]
};

module.exports = Pinboard;
