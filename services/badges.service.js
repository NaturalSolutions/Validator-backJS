var config = require('config.json');
var Q = require('q');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise=global.Promise;
mongoose.connect(config.connectionString, {
    useMongoClient: true,
});

var badgesSchema = new Schema({
    name: String,
    url_logo: String,
    city: String,
    nb_contrib :Number,
    postal_code :Number
});

var Badges = mongoose.model('Badges', badgesSchema);
var service = {};

service.getFilterBadges = getFilterBadges;
module.exports = service;

function getFilterBadges(filter) {
    var deferred = Q.defer();
   Badges.find(filter,function (err, badges) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(badges);
    });
    return deferred.promise;
}


