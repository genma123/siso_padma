(function () {
  'use strict';

  // Sisos controller
  angular
    .module('sisos')
    .controller('SisosController', SisosController);

  SisosController.$inject = ['$scope', '$state', 'Authentication', 'sisoResolve'];

  function SisosController ($scope, $state, Authentication, siso) {
    var vm = this;

    vm.authentication = Authentication;
    vm.siso = siso;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Siso
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.siso.$remove($state.go('sisos.list'));
      }
    }

    // Save Siso
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.sisoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.siso._id) {
        vm.siso.$update(successCallback, errorCallback);
      } else {
        vm.siso.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('sisos.view', {
          sisoId: res._id
        });
      }

      function errorCallback(res) {
		console.log("Respobse......",res);  
        vm.error = res.data.message;
      }
    }
  }
})();
