var request = require( "request" );
var twilio = require( "twilio" );
var handleError = require( "../util/util" );
var cache = require( "memory-cache" );
var config = require( "../../config" );

var DEFAULT_CACHE_MSEC = 1000 * 60 * 5; // 5 mins

var client = twilio( config.modules.twilio.data.secrets.accountSid, config.modules.twilio.data.secrets.authToken );

var Twilio = {
  source: "twilio",
  routes: [
    {
      method: "POST",
      path: "/",
      handler: function( req, res ) {

        // This should be the publicly accessible URL for your application
        var url = "http://396c69ad.ngrok.com/outbound";

        // Place an outbound call to the user, using the TwiML instructions
        // from the /outbound route
        client.messages.create( {
          to: "+12066597530",
          from: this.secrets.twilioNumber,
          body: "y hey"
        }, function( err, message ) {

          if ( err ) {
            res.status( 500 ).send( err );
          } else {
            res.send( {
              message: "awesome. got it."
            } );
          }
        } );
      }
    },

    {
      method: "POST",
      path: "/outbound",
      handler: function( req, res ) {
        res.type( "text/xml" );
        res.render( "outbound" );
      }
    }
  ]
};

module.exports = Twilio;
