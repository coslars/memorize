/* App Module */
var memorizeApp = angular.module('memorizeApp', [ 'ngRoute', 'memorizeAppControllers', 'ngGrid', 'ui.bootstrap', 'ui.bootstrap.datepicker' ])
.config(['$httpProvider', function ($httpProvider) {
    // enable http caching
   $httpProvider.defaults.cache = false;
}])
.run(['$rootScope', '$location', '$http', function($rootScope, $location, $http) {
	
	$rootScope.$on('$routeChangeSuccess', function (event, currRoute, prevRoute) {

        // Not sure of another way.  We need to see if we have a valid sessio
        //  for each location change.
        $http.get('/api/util/getSession').success(function (thisSessionObj) {

            memorizeApp.sessionObj = thisSessionObj;
            
            if (!currRoute.access.isFree && memorizeApp.sessionObj.authUser === undefined) {

                console.log('Not authenticated.');
                $location.path("/login");
            }
            
            console.log('Ok.');

        }).error(function (err) {

            console.log('Error coming back from getting session.  Error Details:' + err)
            $location.path("/login");
        });	    		
	});
}]);

// Initialize our session object with some default values.
memorizeApp.sessionObj = { dateFormat: 'dd-MMMM-yyyy' };

memorizeApp.config([ '$routeProvider', function($routeProvider) {

    'use strict';

    $routeProvider.when('/login', {
        templateUrl : 'partials/login.html',
        controller : 'LoginDetailCtrl',
        access: {
    		isFree: true
        }
    }).when('/things', {
        templateUrl : 'partials/thing-list.html',
        controller : 'ThingListCtrl',
        access: {
    		isFree: false
        }
    }).when('/things/detail/:thingId', {
        templateUrl : 'partials/thing-detail.html',
        controller : 'ThingDetailCtrl',
        access: {
    		isFree: false
        }
    }).when('/things/detail', {
        templateUrl : 'partials/thing-detail.html',
        controller : 'ThingDetailCtrl',
        access: {
    		isFree: false
        }
    }).when('/things/view/:thingId', {
        templateUrl : 'partials/thing-view.html',
        controller : 'ThingViewCtrl',
        access: {
            isFree: false
        }
    }).when('/users', {
        templateUrl : 'partials/user-list.html',
        controller : 'UserListCtrl',
        access: {
    		isFree: false
        }
    }).when('/users/detail/:userId', {
        templateUrl : 'partials/user-detail.html',
        controller : 'UserDetailCtrl',
        access: {
    		isFree: false
        }
    }).when('/users/detail', {
        templateUrl : 'partials/user-detail.html',
        controller : 'UserDetailCtrl',
        access: {
    		isFree: false
        }
    }).otherwise({
        templateUrl : 'partials/login.html',
        controller : 'LoginDetailCtrl',
        access: {
        	isFree: true
        }
    });
} ]);