/**
 * The DETAIL controller for the login function
 */
memorizeAppControllers.controller('LoginDetailCtrl', ['$scope', '$http', '$parse', '$location', 
    function ($scope, $http, $parse, $location) {
    
        'use strict';               
        
        // Create an empty object to hold the form data
        $scope.formData = {};

        // Call the api and insert or update the record
        $scope.login = function login() {

            $http.post('/api/login', $scope.formData).success(function (sessionObj) {
                
                // They've returned the session object
                memorizeApp.sessionObj = sessionObj;
                
                // Go to the Things list screen
                clientUtil.changeLocation($location, '/things', false);

            }).error(function (err) {

                clientUtil.handleErrors(err, $scope, $parse);
            });
        };

        // BUG BUG - This needs to be moved some where more global. But it's job is to
        //  allow the user to close the alert        
        $scope.closeAlert = function closeAlert(index) {

            $scope.alerts.splice(index, 1);
        };
        
        // For pages with inputs on them, set focus to the first one.
        clientUtil.findFirstFocus();       
    }
]);