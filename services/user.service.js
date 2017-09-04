var config = require('config.json');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise=global.Promise;
mongoose.connect(config.connectionString, {
    useMongoClient: true,
});

var service = {};
service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
module.exports = service;

var userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
         default: 'Contributeur',
        enum: ['Admin', 'Contributeur','Expert'],
    },
    photo:{
        type:String,
         default: 'http://localhost:4000/users_img/user_default.png',
    },
    //contributions: [{ type: Schema.Types.ObjectId, ref: 'pois' }]
    contributions: { type:[Number],
    default :[2,3,1,8,9,6] },
    desc:{
        type:String,
         default: 'Une note à tous ?',
    },
});
var User = mongoose.model('User', userSchema);

function authenticate(email, password) {
    var deferred = Q.defer();
    User.findOne({
        email: email
    }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (user && bcrypt.compareSync(password, user.password)) {
            // authentication successful
            deferred.resolve({
                token: jwt.sign({
                    id: user._id,
                    role: user.role
                }, config.secret)
            });
        } else {
            // authentication failed
            deferred.resolve();
        }
    });
    return deferred.promise;
}
function getAll() {
    var deferred = Q.defer();
    User.find({},{'password':0},function (err, users) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        // return users (without hashed passwords)
        if (users) {
            deferred.resolve(users);
        } else {
            // user not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();
    User.findById(_id,{'password':0},function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (user) {
            // return user (without hashed password)
            deferred.resolve(user);
        } else {
            // user not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();
    // validation
    User.findOne({
        email: userParam.email,
    }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (user) {
            // email already exists
            deferred.reject('email "' + userParam.email + '" est déjà pris');
        }
         else {
            createUser();
        }
    });
    function createUser() {
        new User({
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            email: userParam.email,
            password: bcrypt.hashSync(userParam.password, 10),
        })
        .save(function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    }
    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();
    // validation
    User.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.email !== userParam.email) {
            // email has changed so check if the new email is already taken
            User.users.findOne({
                    email: userParam.email
                },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // email already exists
                        deferred.reject('email "' + req.body.email + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            email: userParam.email,
        };

        // update password if it was entered
        if (userParam.password) {
            set.password = bcrypt.hashSync(userParam.password, 10);
        }

        User.update({
                _id: mongo.helper.toObjectID(_id)
            }, {
                $set: set
            },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    User.remove({ _id}, function(err) 
             {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });
    return deferred.promise;
}