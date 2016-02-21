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
  var userToken = 'userToken';

  // Public API here
  var authToken = {
    setToken: function(token) {
      cachedToken = token;
      storage.setItem(userToken, token);
    },
    removeToken: function() {
      cachedToken = null;
      storage.removeItem(userToken);
    },
    getToken: function() {
      if (!cachedToken) {
        cachedToken = storage.getItem(userToken);
      }

      return cachedToken;
    },
    isAuthenticated: function() {
      return !!authToken.getToken();
    }
  };

  return authToken;
});
