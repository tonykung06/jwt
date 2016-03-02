'use strict';

/**
 * @ngdoc function
 * @name jwtApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the jwtApp
 */
angular.module('jwtApp')
  .controller('LogoutCtrl', function (authToken, $state, $auth) {
    // authToken.removeToken();
    $auth.logout();
    $state.go('main');
  });
