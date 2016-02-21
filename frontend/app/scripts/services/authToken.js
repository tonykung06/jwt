'use strict';

/**
 * @ngdoc service
 * @name jwtApp.authToken
 * @description
 * # authToken
 * Factory in the jwtApp.
 */
angular.module('jwtApp').factory('authToken', function ($window) {
  // Service logic
  // ...

  var storage = $window.localStorage;
  var cachedToken;

  // Public API here
  return {
    setToken: function(token) {
      cachedToken = token;
      storage.setItem('userToken', token);
    },
    getToken: function() {
      if (!cachedToken) {
        cachedToken = storage.getItem('userToken');
      }

      return cachedToken;
    },
    isAuthenticated: function() {
      return !!this.getToken();
    }
  };
});