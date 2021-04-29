'use strict';
// Module Dependencies
// -------------------
var express     = require('express');
var bodyParser  = require('body-parser');
var errorhandler = require('errorhandler');
var http        = require('http');
var path        = require('path');
var request     = require('request');
var routes      = require('./routes');
var activity    = require('./routes/activity');
var Pushy = require('pushy');
var axios = require('axios');

var app = express();

// Configure Express
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.raw({type: 'application/jwt'}));
//app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.methodOverride());
//app.use(express.favicon());

app.use(express.static(path.join(__dirname, 'public')));

// Express in Development Mode
if ('development' == app.get('env')) {
  app.use(errorhandler());
}

// HubExchange Routes
app.get('/', routes.index );
app.post('/login', routes.login );
app.post('/logout', routes.logout );
app.post('/post_push',function(req,cb){
  console.log("post_push")
})


app.post('/post_pushy',function(req,cb){
  console.log("post_pushy")

  var Pushy = require('pushy');
 
// Plug in your Secret API Key 
// Get it here: https://dashboard.pushy.me/ 
var pushyAPI = new Pushy('d7d75e43ed88d5a8a4b27ed84548c78c687c0cf2e2c865e6790e58dd293c5ae5');
 
// Set push payload data to deliver to device(s) 
var data = {
    message: 'Hello'
};
 
// Insert target device token(s) here 
var to = ['d045904a12ebea17187dcc'];

// Optionally, send to a publish/subscribe topic instead
// to = '/topics/news';
 
// Set optional push notification options (such as iOS notification fields)
var options = {
    notification: {
        badge: 1,
        sound: 'ping.aiff',
        body: 'Hello'
    },
};
 
// Send push notification via the Send Notifications API 
// https://pushy.me/docs/api/send-notifications 
pushyAPI.sendPushNotification(data, to, options, function (err, id) {
    // Log errors to console 
    if (err) {
        return console.log('Fatal Error', err);
    }
    // Log success 
    console.log('Push sent successfully! (ID: ' + id + ')');
});
})

// Custom Hello World Activity Routes
app.post('/journeybuilder/save/', activity.save );
app.post('/journeybuilder/validate/', activity.validate );
app.post('/journeybuilder/publish/', activity.publish );
app.post('/journeybuilder/execute/', activity.execute );

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});