'use strict';

var myApp = angular.module('myApp', ['ngRoute','myApp.services','ngMaterial','lum.directives.amcharts']);

myApp.config(['$routeProvider',function($routeProvider) {
    $routeProvider.when('/dashboard', {templateUrl: '/assets/partials/dashboard.html', controller: 'DashboardCtrl'});
    $routeProvider.when('/filtered', {templateUrl: '/assets/partials/filtered.html', controller: 'FilteredCtrl'});
    $routeProvider.when('/admin', {templateUrl: '/assets/partials/admin.html', controller: 'AdminCtrl'});
    $routeProvider.otherwise({redirectTo: '/dashboard'});
}]);

myApp.factory('$exceptionHandler',['$injector','$log', function($injector,$log) {
    return function(exception, cause) {
        $log.error(exception);
        var errorHandling = $injector.get('errorHandling');
        errorHandling.add(exception.message);
        throw exception;
    };
}]);

var serviceModule = angular.module('myApp.services', []);