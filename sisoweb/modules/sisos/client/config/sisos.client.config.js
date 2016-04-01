(function () {
  'use strict';

  angular
    .module('sisos')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Sisos',
      state: 'sisos',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'sisos', {
      title: 'List Sisos',
      state: 'sisos.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'sisos', {
      title: 'Create Siso',
      state: 'sisos.create',
      roles: ['user']
    });
  }
})();
