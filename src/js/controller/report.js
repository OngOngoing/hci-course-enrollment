var app = angular.module('MainApp')

app.controller('ReportController', function($scope, $rootScope, $http, $mdDialog, $mdMedia) {
  $http.get('http://52.37.98.127:3000/v1/5610545811/5610545811?pin=5811').success(function(userData){
    $rootScope.userData = userData;
    $scope.courses = $rootScope.userData.courses;
  });

  $scope.getTotalCredits = function() {
    var totalCredits = 0;
    for (index = 0; index < $rootScope.userData.courses.length; index++) {
      totalCredits += $rootScope.userData.courses[index].credit;
    }
    return totalCredits;
  }

  $scope.isEnrolled = function(courseID) {

    var result = false;

    for (index = 0; index < $rootScope.userData.courses.length; index++) {
      if($rootScope.userData.courses[index].id == courseID) {
        result = true;
        break;
      }
    }

    return result;
  }

  $scope.showDescription = function(courseID) {
    $mdDialog.show({
          controller: CourseController,
          templateUrl: 'src/view/course.html',
          parent: angular.element(document.body),
          locals: { courseID: courseID, isEnrolled: $scope.isEnrolled(courseID) },
          clickOutsideToClose:true
        })
            .then(function(answer) {
              $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
              $scope.status = 'You cancelled the dialog.';
            });
  };
});
