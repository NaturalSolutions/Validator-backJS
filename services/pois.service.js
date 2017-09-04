var config = require('config.json');
var Q = require('q');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
mongoose.connect(config.connectionString, {
    useMongoClient: true,
});

var service = {};
service.getAll = getAll;
service.getFilterPois = getFilterPois;
service.getById = getById;
service.getPoisPagination = getPoisPagination;
service.create = create;
service.update = update;
service.delete = _delete;
module.exports = service;

var poisSchema = new Schema({

    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    postal_code: {
        type: Number,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        default: 'description du lieu...'
    },
    add_date: {
        type: Date,
        default: new Date()
    },
     validateStatus: {
        type: Number,
        default: 0
    },
   
   //typesPois : [{ type: Schema.ObjectId, ref: 'typesPois' }],
   // userId : [{ type: Schema.ObjectId, ref: 'User' }],
   
    url_img1: {
        type: String,
        default: 'http://localhost:4000/pois_img/poi_default.png',
    },
    url_img2: {
        type: String,
        default: 'http://localhost:4000/pois_img/poi_default.png',
    },
    url_img3: {
        type: String,
        default: 'http://localhost:4000/pois_img/poi_default.png',
    },
    visit_time_max: {
        type: String,
        default: "non renseigné"
    },
    visit_time_min: {
        type: String,
        default: "non renseigné"
    },
    price: {
        type: String,
        default: "non renseigné"
    },
    phone: {
        type: String,
        default: "non renseigné"
    },
    withchild: Boolean,
});
var Pois = mongoose.model('Pois', poisSchema);

function getAll() {
    var deferred = Q.defer();
    Pois.find({},function (err, pois) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(pois);
    });
    return deferred.promise;
}

function getFilterPois(filter) {
    var deferred = Q.defer();
    Pois.find(filter,function (err, pois) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(pois);
    });
    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();
    Pois.findById(_id,function (err, poi) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (poi) {
            deferred.resolve(poi);
        } else {
            // poi not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getPoisPagination(pagination) {
    
    var pageSeize = parseInt(pagination.seize);
   // var pageNumber = Pois.count() / pageSeize;
   var pageNumber = parseInt(pagination.page); 
    var deferred = Q.defer();
    (Pois.find({}).skip(pageSeize * (pageNumber - 1)).limit(pageSeize)).exec(function (err, pois) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(pois);
    });
    return deferred.promise;
}

function create(poi) {
    var deferred = Q.defer();
    Pois.insert(
        poi,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    return deferred.promise;
}

function update(_id, poiParam) {
    var deferred = Q.defer();
    Pois.update({
            _id: mongo.helper.toObjectID(_id)
        }, {
            $set: poiParam
        },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();
    Pois.remove({_id},function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message)
            deferred.resolve();
        });
    return deferred.promise;
}
