require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
var path = require('path');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static files
app.use("/badges_img", express.static(path.join(__dirname + '/badges_img')));
app.use("/users_img", express.static(path.join(__dirname + '/users_img')));
// use JWT auth to secure the api
//app.use(expressJwt({ secret: config.secret }).unless({ path: ['/users/authenticate','/users/register','/pois/','/pois/:id','/badges'] }));
// routes
app.use('/users', require('./controllers/users.controller'));
app.use('/pois', require('./controllers/pois.controller'));

// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 4000;
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});