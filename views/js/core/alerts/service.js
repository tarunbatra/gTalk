alerts.factory('alertService', ['$window', function($window) {
  return {
    show: function(text) {
      $window.alert(text);
    }
  };
}]);
