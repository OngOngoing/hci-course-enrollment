var app = angular.module('MainApp', ['ui.router', 'ngMaterial', 'ngMdIcons', 'md.data.table'])

app.controller('EnrollmentController', function($rootScope, $scope, $http, $mdDialog, $mdMedia) {
  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

  $http.get('https://whsatku.github.io/skecourses/list.json').success(function(courseList){
    $scope.courses = courseList;
  });

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

  $scope.isCourseAvailable = function(courseID) {
    var courses = ["01219113", "01219215",
      "01219216","01219243","01219244", "01219245", "01219246", "01219343", "01219344",
      "01219347", "01219348" ,"01219351", "01219361" ,"01219412" ,"01219448" ,"01219449", "01219452" ,"01219492",
      "01219496", "01219497", "01219498", "01219499"
    ];
    return courses.includes(courseID);
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

  $http.get('http://52.37.98.127:3000/v1/5610545811/5610545811?pin=5811').success(function(userData){
    $rootScope.userData = userData;
  });

  $scope.showJSON = function(jsonObject) {
    $mdDialog.show({
      controller: JSONController,
      templateUrl: 'src/view/jsonDialog.tmpl',
      parent: angular.element(document.body),
      clickOutsideToClose:true,
      locals: { jsonString: JSON.stringify(jsonObject, null, 2) }
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };

  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.changeState = function (page) {
    $state.go(page);
  }

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

  $scope.isSectionEnrolled = function(courseID, section) {
    var result = false;
    for (index = 0; index < $rootScope.userData.courses.length; index++) {
      if($rootScope.userData.courses[index].id == courseID && $rootScope.userData.courses[index].section.id == section.id && $rootScope.userData.courses[index].section.type == section.type) {
        result = true;
        break;
      }
    }
    return result;
  }

  $scope.getEnrollmentIndex = function(courseID, section) {
    var result;
    for (index = 0; index < $rootScope.userData.courses.length; index++) {
      if($rootScope.userData.courses[index].id == courseID && $rootScope.userData.courses[index].section.id == section.id && $rootScope.userData.courses[index].section.type == section.type) {
        result = index;
        break;
      }
    }
    return result;
  }

  $scope.getEnrollment = function(courseID, section) {
    var result;
    for (index = 0; index < $rootScope.userData.courses.length; index++) {
      if($rootScope.userData.courses[index].id == courseID && $rootScope.userData.courses[index].section.id == section.id && $rootScope.userData.courses[index].section.type == section.type) {
        result = $rootScope.userData.courses[index];
        break;
      }
    }
    return result;
  }

  $scope.isEnrolled = isEnrolled;
  $scope.courseID = courseID;

  $http.get('https://whsatku.github.io/skecourses/' + courseID + '.json').success(function(course){
    $scope.course = course;
  });

  $http.get('https://whsatku.github.io/skecourses/sections/' + courseID + '.json').success(function(sections){
      $scope.sections = sections;
      $scope.isAvailable = true;
    }).error(function(x) {
      $scope.isAvailable = false;
  });

  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(section, regisType) {
    $scope.press = {
      isPressed: true,
      section: section
    }
    var userInfo = $rootScope.userData;
    section.enrolled+=1;
    var courseObject = {
      "id": courseID,
      "regisType": regisType,
      "section": section,
      "name" : {
        "en" : $scope.course.name.en,
        "th" : $scope.course.name.th
      },
      "credit" : $scope.course.credit.total,
    }
    userInfo.courses.push(courseObject);
    var sendingData = {"5610545811": userInfo};
    $http.post('http://52.37.98.127:3000/v1/5610545811/?pin=5811', sendingData).then(function(response){
      console.log(response);
      $mdDialog.hide();
      enrollToast(courseID,'is enrolled');
    }, function(xhr){
        alert(xhr.data);
        console.log(xhr.data);
    });

  };

  $scope.confirmDrop = function(course, section) {


    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title(course.id + ' DROP Confirmation')
          .textContent('Are you sure you want to drop ['+ course.name.en + '] course?')
          .ariaLabel('Are you sure?')
          .ok('Yes, Please do it!')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      var userInfo = $rootScope.userData;
      userInfo.courses.splice($scope.getEnrollmentIndex(course.id, section), 1);
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
