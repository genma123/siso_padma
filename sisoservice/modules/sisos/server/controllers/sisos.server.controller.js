'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Siso = mongoose.model('Siso'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Siso
 */
exports.create = function(req, res) {
  var siso = new Siso(req.body);
  siso.user = req.user;
  console.log("Req info coming in ...", siso);
  siso.save(function(err) {
	  console.log(res.status());
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(siso);
    }
  });
};

/**
 * Show the current Siso
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var siso = req.siso ? req.siso.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  siso.isCurrentUserOwner = req.user && siso.user && siso.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(siso);
};

/**
 * Update a Siso
 */
exports.update = function(req, res) {
  var siso = req.siso ;

  siso = _.extend(siso , req.body);

  siso.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(siso);
    }
  });
};

/**
 * Delete an Siso
 */
exports.delete = function(req, res) {
  var siso = req.siso ;

  siso.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(siso);
    }
  });
};

/**
 * List of Sisos
 */
exports.list = function(req, res) { 
  Siso.find({'name':'test'}).sort('-created').populate('user', 'displayName').exec(function(err, sisos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
	
      res.jsonp(sisos);
    }
  });
};

/**
 * Siso middleware
 */
exports.sisoByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Siso is invalid'
    });
  }

  Siso.findById(id).populate('user', 'displayName').exec(function (err, siso) {
    if (err) {
      return next(err);
    } else if (!siso) {
      return res.status(404).send({
        message: 'No Siso with that identifier has been found'
      });
    }
    req.siso = siso;
    next();
  });
};
