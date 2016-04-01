(function () {
  'use strict';

  angular
    .module('sisos')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('sisos', {
        abstract: true,
        url: '/sisos',
        template: '<ui-view/>'
      })
      .state('sisos.list', {
        url: '',
        templateUrl: 'modules/sisos/client/views/list-sisos.client.view.html',
        controller: 'SisosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sisos List'
        }
      })
      .state('sisos.create', {
        url: '/create',
        templateUrl: 'modules/sisos/client/views/form-siso.client.view.html',
        controller: 'SisosController',
        controllerAs: 'vm',
        resolve: {
          sisoResolve: newSiso
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Sisos Create'
        }
      })
      .state('sisos.edit', {
        url: '/:sisoId/edit',
        templateUrl: 'modules/sisos/client/views/form-siso.client.view.html',
        controller: 'SisosController',
        controllerAs: 'vm',
        resolve: {
          sisoResolve: getSiso
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Siso {{ sisoResolve.name }}'
        }
      })
      .state('sisos.view', {
        url: '/:sisoId',
        templateUrl: 'modules/sisos/client/views/view-siso.client.view.html',
        controller: 'SisosController',
        controllerAs: 'vm',
        resolve: {
          sisoResolve: getSiso
        },
        data:{
          pageTitle: 'Siso {{ articleResolve.name }}'
        }
      });
  }

  getSiso.$inject = ['$stateParams', 'SisosService'];

  function getSiso($stateParams, SisosService) {
    return SisosService.get({
      sisoId: $stateParams.sisoId
    }).$promise;
  }

  newSiso.$inject = ['SisosService'];

  function newSiso(SisosService) {
    return new SisosService();
  }
})();
