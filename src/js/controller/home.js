var app = angular.module('MainApp')

app.controller('HomeController', function($scope, $rootScope, $http) {
    $scope.userData = $rootScope.userData;
});


function JSONController($rootScope, $scope, $mdDialog, $http, jsonString) {
  $scope.jsonString = jsonString;
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.exit = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
};
