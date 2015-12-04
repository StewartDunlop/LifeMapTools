'use strict';

/**
 * Module dependencies.
 */
var lifemapsPolicy = require('../policies/lifemaps.server.policy'),
  articles = require('../controllers/lifemaps.server.controller');

module.exports = function (app) {
  // Lifemaps collection routes
  app.route('/api/lifemaps').all(lifemapsPolicy.isAllowed)
    .get(lifemaps.list)
    .post(lifemaps.create);

  // Single article routes
  app.route('/api/lifemaps/:lifemapId').all(lifemapsPolicy.isAllowed)
    .get(lifemaps.read)
    .put(lifemaps.update)
    .delete(lifemaps.delete);

  // Finish by binding the article middleware
  app.param('lifemapId', lifemaps.lifemapByID);
};
