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
      controller: "HomeController",
      controllerAs: "HomeCtrl"
    })
    .state('enrollment', {
      url: "/enrollment",
      templateUrl: "src/view/enrollment.tmpl",
      controller: "EnrollmentController",
      controllerAs: "EnrollmentCtrl"
    })
    .state('report', {
      url: "/report",
      templateUrl: "src/view/report.tmpl",
      controller: "ReportController",
      controllerAs: "ReportCtrl"
    })
});
