var config = require('config.json');
var Q = require('q');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise=global.Promise;
mongoose.connect(config.connectionString, {
    useMongoClient: true,
});

var service = {};
service.getTypePoi = getTypePoi;
module.exports = service;

var typesPoisSchema = new Schema({
    name: String,
    url_logo: String,
});
var TypesPois = mongoose.model('TypesPois', typesPoisSchema);

function getTypePoi(type) {
    var deferred = Q.defer();
   TypesPois.find(type,function (err, typePoi) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(typePoi);
    });
    return deferred.promise;
}


