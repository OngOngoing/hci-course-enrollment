var app = angular.module('MainApp')

app.controller('HomeController', function($scope, $rootScope, $http) {
  $http.get('http://52.37.98.127:3000/v1/5610545811/5610545811?pin=5811').success(function(userData){
    $scope.userData = userData;
  });
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
