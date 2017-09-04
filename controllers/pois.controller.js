var config = require('config.json');
var express = require('express');
var router = express.Router();
var poisService = require('services/pois.service');
var badgesService = require('services/typesPois.service');
// routes
router.get('/pagination/', getPoisPagination);
router.get('/', getPois);
router.get('/:id', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);
router.post('/addPoi', addPoi);
module.exports = router;

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

function getPois(req, res) {
    var filter=req.query;
   if (isEmptyObject(filter))
    {
        poisService.getAll()
        .then(function (pois) {
            res.send(pois);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
    }
    else
        console.log(filter)
        poisService.getFilterPois(filter)
    .then(function (pois) {
            res.send(pois);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    poisService.getById(req.params.id)
        .then(function (poi) {
            if (poi) {
                res.send(poi);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getPoisPagination(req, res) {
    console.log(req.query);
var pp=req.query;
     if (isEmptyObject(pp))
    {
        poisService.getPoisPagination(page=1)
        .then(function (pois) {
            res.send(pois);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
    }
    else{
         console.log(req.query.page)
         poisService.getPoisPagination(req.query)
        .then(function (pois) {
            if (pois) {
                res.send(pois);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
    } 
}

function update(req, res) {
    poisService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    poisService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addPoi(req, res) {
    console.log("aaaa");
    poisService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}