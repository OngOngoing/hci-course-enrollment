var app = angular.module('MainApp', ['ui.router', 'ngMaterial'])
app.controller('TodoListController', function () {
  var todoList = this
  todoList.todos = [
    {text: 'learn angular', done: true},
    {text: 'build an angular app', done: false}]

  todoList.addTodo = function () {
    todoList.todos.push({text: todoList.todoText, done: false})
    todoList.todoText = ''
  }

  todoList.remaining = function () {
    var count = 0
    angular.forEach(todoList.todos, function (todo) {
      count += todo.done ? 0 : 1
    })
    return count
  }

  todoList.archive = function () {
    var oldTodos = todoList.todos
    todoList.todos = []
    angular.forEach(oldTodos, function (todo) {
      if (!todo.done) todoList.todos.push(todo)
    })
  }
})


app.controller('EnrollmentController', function($scope, $http, $mdDialog, $mdMedia) {
  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

  $http.get('https://whsatku.github.io/skecourses/list.json').success(function(courseList){
    $scope.courses = courseList;
  });


  $scope.showDescription = function(ev) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'src/view/dialog1.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: useFullScreen
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };

});


app.controller('AppCtrl', function($scope, $mdBottomSheet, $mdSidenav, $mdDialog){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
});



function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}

app.config(function($mdThemingProvider) {
  var customBlueMap = 		$mdThemingProvider.extendPalette('light-blue', {
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
    .accentPalette('pink');
  $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
});
