'use strict';

/**
 * Module dependencies
 */
var sisosPolicy = require('../policies/sisos.server.policy'),
  sisos = require('../controllers/sisos.server.controller');

module.exports = function(app) {
  // Sisos Routes
  app.route('/api/sisos').all(sisosPolicy.isAllowed)
    .get(sisos.list)
    .post(sisos.create);

  app.route('/api/sisos/:sisoId').all(sisosPolicy.isAllowed)
    .get(sisos.read)
    .put(sisos.update)
    .delete(sisos.delete);

  // Finish by binding the Siso middleware
  app.param('sisoId', sisos.sisoByID);
};
