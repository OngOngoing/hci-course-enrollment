angular.module('MainApp')
.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /home
  $urlRouterProvider.otherwise("/home");
  //
  // Now set up the states
  $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "src/view/home.tmpl",
    })
    .state('enrollment', {
      url: "/enrollment",
      templateUrl: "src/view/enrollment.tmpl",
      controller: "EnrollmentController",
      controllerAs: "EnrollmentCtrl"
    })
    .state('enroll_course', {
      url: "/enrollment/{id:int}",
      templateUrl: "src/view/course.tmpl",
      controller: "CourseController",
      controllerAs: "CourseCtrl"
    })
});
