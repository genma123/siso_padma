//Sisos service used to communicate Sisos REST endpoints
(function () {
 'use strict';

  angular
    .module('sisos')
    .factory('SisosService', SisosService);

  SisosService.$inject = ['$resource'];

  function SisosService($resource) {
    return $resource('http://innovate20:3001/api/sisos/:sisoId',
    {
      sisoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
