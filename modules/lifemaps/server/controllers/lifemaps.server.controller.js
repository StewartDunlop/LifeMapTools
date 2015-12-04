'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Lifemap = mongoose.model('Lifemap'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a lifemap
 */
exports.create = function (req, res) {
    var lifemap = new Lifemap(req.body);
    lifemap.user = req.user;

    lifemap.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(lifemap);
        }
    });
};

/**
 * Show the current lifemap
 */
exports.read = function (req, res) {
    res.json(req.lifemap);
};

/**
 * Update a lifemap
 */
exports.update = function (req, res) {
    var lifemap = req.lifemap;

    lifemap.information = req.body.information;
    lifemap.modified =
        lifemap.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(lifemap);
        }
    });
};

/**
 * Delete an lifemap
 */
exports.delete = function (req, res) {
    var lifemap = req.lifemap;

    lifemap.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(lifemap);
        }
    });
};

/**
 * List of Lifemaps
 */
exports.list = function (req, res) {
    Lifemap.find().sort('-created').populate('user', 'displayName').exec(function (err, lifemaps) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(lifemaps);
        }
    });
};

/**
 * Lifemap middleware
 */
exports.lifemapByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Lifemap is invalid'
        });
    }

    Lifemap.findById(id).populate('user', 'displayName').exec(function (err, lifemap) {
        if (err) {
            return next(err);
        } else if (!lifemap) {
            return res.status(404).send({
                message: 'No lifemap with that identifier has been found'
            });
        }
        req.lifemap = lifemap;
        next();
    });
};
