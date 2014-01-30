/* App Module */
var memorizeApp = angular.module('memorizeApp', [ 'ngRoute', 'memorizeAppControllers', 'ngGrid', 'ui.bootstrap', 'ui.bootstrap.datepicker' ]);

// Initialize our session object with some default values.
memorizeApp.sessionObj = { dateFormat: 'dd-MMMM-yyyy' };

memorizeApp.config([ '$routeProvider', function($routeProvider) {

    'use strict';

    $routeProvider.when('/login', {
        templateUrl : 'partials/login.html',
        controller : 'LoginDetailCtrl'
    }).when('/things', {
        templateUrl : 'partials/thing-list.html',
        controller : 'ThingListCtrl'
    }).when('/things/detail/:thingId', {
        templateUrl : 'partials/thing-detail.html',
        controller : 'ThingDetailCtrl'
    }).when('/things/detail', {
        templateUrl : 'partials/thing-detail.html',
        controller : 'ThingDetailCtrl'
    }).when('/users', {
        templateUrl : 'partials/user-list.html',
        controller : 'UserListCtrl'
    }).when('/users/detail/:userId', {
        templateUrl : 'partials/user-detail.html',
        controller : 'UserDetailCtrl'
    }).when('/users/detail', {
        templateUrl : 'partials/user-detail.html',
        controller : 'UserDetailCtrl'
    }).otherwise({
        redirectTo : '/login'
    });
} ]);