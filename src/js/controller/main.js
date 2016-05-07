var app = angular.module('MainApp', ['ui.router', 'ngMaterial', 'ngMdIcons', 'md.data.table'])

app.controller('EnrollmentController', function($rootScope, $scope, $http, $mdDialog, $mdMedia) {
  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

  $http.get('https://whsatku.github.io/skecourses/list.json').success(function(courseList){
    $scope.courses = courseList;
  });

  $scope.isEnrolled = function(courseID) {
    return $rootScope.userData.courses.includes(courseID);
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


app.controller('AppCtrl', function($scope, $state, $rootScope, $mdBottomSheet, $mdSidenav, $mdDialog, $mdToast, $http){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.changeState = function (page) {
    $state.go(page);
  }

  $http.get('http://52.37.98.127:3000/v1/5610545811/5610545811?pin=5811').success(function(userData){
    $rootScope.userData = userData;
  });

  var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };

  $scope.toastPosition = angular.extend({},last);

  $scope.getToastPosition = function() {
    sanitizePosition();
    return Object.keys($scope.toastPosition)
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(' ');
  };

  function sanitizePosition() {
    var current = $scope.toastPosition;
    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;
    last = angular.extend({},current);
  }

  enrollToast = function(courseID, message) {
    var toast = $mdToast.simple()
          .textContent(courseID + ' ' + message)
          .action('View JSON')
          .highlightAction(true)
          .position($scope.getToastPosition())
          .hideDelay(1500);
    $mdToast.show(toast).then(function(response) {
      if ( response == 'ok' ) {
        alert('You clicked \'OK\'.');
      }
    });
  };




});



function CourseController($rootScope, $scope, $mdDialog, $http, courseID, isEnrolled) {
  $scope.isEnrolled = isEnrolled;
  $scope.courseID = courseID;

  $http.get('https://whsatku.github.io/skecourses/' + courseID + '.json').success(function(course){
    $scope.course = course;
  });

  $http.get('https://whsatku.github.io/skecourses/sections/' + courseID + '.json').success(function(sections){
    $scope.sections = sections;
  });

  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $scope.isPressed = true;
    var userInfo = $rootScope.userData;
    userInfo.courses.push(courseID);
    var sendingData = {"5610545811": userInfo};
    $http.post('http://52.37.98.127:3000/v1/5610545811/?pin=5811', sendingData).then(function(response){
      console.log(response);
      $mdDialog.hide(answer);
      enrollToast(courseID,'is enrolled');
    }, function(xhr){
        alert(xhr.data);
        console.log(xhr.data);
    });

  };

  $scope.confirmDrop = function(courseID, courseName) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title(courseID + ' DROP Confirmation')
          .textContent('Are you sure you want to drop ['+ courseName + '] course?')
          .ariaLabel('Are you sure?')
          .ok('Yes, Please do it!')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      var userInfo = $rootScope.userData;
      userInfo.courses.splice(userInfo.courses.indexOf(courseID), 1);
      var sendingData = {"5610545811": userInfo};
      $http.post('http://52.37.98.127:3000/v1/5610545811/?pin=5811', sendingData).then(function(response){
        console.log(response);
        enrollToast(courseID,'is dropped');
      }, function(xhr){
          alert(xhr.data);
          console.log(xhr.data);
      });
    }, function() {
      $scope.status = 'You canceled to drop';
    });
  };

}

app.controller('ToastCtrl', function($scope, $mdToast) {
  $scope.closeToast = function() {
    $mdToast.hide();
  };
});

app.config(function($mdThemingProvider) {
  var customBlueMap = 		$mdThemingProvider.extendPalette('green', {
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50'],
    '50': 'ffffff'
  });
  $mdThemingProvider.definePalette('customBlue', customBlueMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('customBlue', {
      'default': '500',
      'hue-1': '50'
    })
    .accentPalette('pink')
  $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
});
