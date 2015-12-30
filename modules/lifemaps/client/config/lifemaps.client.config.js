'use strict';

// Configuring the Lifemaps module
angular.module('articles').run(['Menus',
  function (Menus) {
    // Add the lifemaps dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Lifemaps',
      state: 'lifemaps',
      type: 'dropdown',
      roles: ['*']
    });

// Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'lifemaps', {
      title: 'Your Lifemaps',
      state: 'lifemaps.view',
      roles: ['user']
    });

  }
]);
