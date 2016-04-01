(function () {
  'use strict';

  angular
    .module('sisos')
    .controller('SisosListController', SisosListController);

  SisosListController.$inject = ['SisosService'];

  function SisosListController(SisosService) {
    var vm = this;

    vm.sisos = SisosService.query();
	
	
	console.log("SISOs List" + vm.sisos);
  }
})();
