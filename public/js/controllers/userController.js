
// This service should let us shar data between controllers...
memorizeAppControllers.service('userControllerService', function () {
    
    var savedUser = {};

    return {
        // Should be called from the list page
        getSavedUser:function () {
            // This exposed private data
            return savedUser;
        },
        
        // Should be called from the detail page.
        setSavedUser:function (user) {
        
            if (user !== undefined) {
            
                savedUser = user;
            }
        },
        
        // We don't need to hold the saved user anymore, clear it out.
        clearSavedUser:function () {
            
            savedUser = {};
        }
    };
});

/**
 * The LIST controller for the users function
 */
memorizeAppControllers.controller('UserListCtrl', ['$scope', '$http', '$parse', 'sessionService', 'userControllerService', '$location',  
    function ($scope, $http, $parse, sessionService, userControllerService, $location) {

        'use strict';

        $scope.users = [];

        // Create an object with all the options we want for the ng-grid
        $scope.gridOptions = {
            data: 'users',
            multiSelect: false,
            selectedItems: [],
            columnDefs: [{
                field: '_id',
                visible: false
            }, {
                field: 'userName',
                displayName: 'User Name'
            }, {
                field: 'firstName',
                displayName: 'First Name'
            }, {
                field: 'lastName',
                displayName: 'Last Name'
            }]
        };

        // Call the API to get a list of all the users that have been memorized
        $scope.getList = function getList() {

            $http.get(clientUtil.cacheBust('/api/user')).success(function (data) {

                $scope.users = data; 
                
                // Set this in the service object so that the list screen can get it.
                var lastSavedUser = userControllerService.getSavedUser();
                
                if (lastSavedUser.userName !== undefined) {
                    
                    clientUtil.handleSuccess("The User \"" + lastSavedUser.firstName + " " + lastSavedUser.lastName + "\" has been saved successfully." , $scope, $parse);
                    userControllerService.clearSavedUser();
                }

            }).error(function (err) {

                clientUtil.handleErrors(err, $scope, $parse);
            });
            
            // Reset the selected items array
            this.gridOptions.selectedItems.length = 0;
        };

        // Just re-direct the user to the detail page
        $scope.addNew = function addNew() {

            clientUtil.changeLocation($location, '/users/detail');
        };

        // Send the user to the detail screen with the id of the edited record
        $scope.edit = function edit() {

            if (this.gridOptions.selectedItems.length > 0) {

                clientUtil.changeLocation($location, '/users/detail/' + this.gridOptions.selectedItems[0]._id);

            } else {

                clientUtil.handleErrors(clientUtil.createClientMessage("Please select a record."), $scope, $parse);
            }
        };

        // Call the api and delete a record by its id
        $scope.deleteId = function deleteId() {

            if (this.gridOptions.selectedItems.length > 0) {

                $http.delete('/api/user/' + this.gridOptions.selectedItems[0]._id).success(function (deletedUser) {

                    // Display a success message to the user
                    clientUtil.handleSuccess("The User \"" + deletedUser.firstName + " " + deletedUser.lastName + "\" has been deleted successfully." , $scope, $parse);
                    
                    // Get the list
                    $scope.getList();

                }).error(function (err) {

                    clientUtil.handleErrors(err, $scope, $parse);
                });
            } else {

                clientUtil.handleErrors(clientUtil.createClientMessage("Please select a record."), $scope, $parse);
            }
        };

        // BUG BUG - This needs to be moved some where more global. But it's job is to
        //  allow the user to close the alert
        $scope.closeAlert = function closeAlert(index) {

            $scope.alerts.splice(index, 1);
        };

        // Execute the function to populate the list with data
        $scope.getList();

        // Call the method that handles all the global onload functionality, like finding the first
        // element to put focus to
        clientUtil.globalOnLoad(sessionService, $location);        
    }
]);

/**
 * The DETAIL controller for the memorize function
 */
memorizeAppControllers.controller('UserDetailCtrl', ['$scope', '$http', '$routeParams', '$parse', 'sessionService', 'userControllerService', '$location', 
    function ($scope, $http, $routeParams, $parse, sessionService, userControllerService, $location) {

        'use strict';

        // Create an empty object to hold the form data
        $scope.formData = {};

        // Set the id, which may be empty from the passed in id
        $scope.id = $routeParams.userId;

        // Call the api and get the object for the passed in id
        $scope.edit = function edit() {

            $http.get('/api/user/' + $scope.id).success(function (user) {

                $scope.formData.id = user._id;
                $scope.formData.firstName = user.firstName;
                $scope.formData.lastName = user.lastName;
                $scope.formData.userName = user.userName;
                $scope.formData.password = user.password;

            }).error(function (err) {

                clientUtil.handleErrors(err, $scope, $parse);
            });
        };

        // Call the api and insert or update the record
        $scope.save = function save() {

            $http.post('/api/user', $scope.formData).success(function (savedUser) {

                // Set this in the service object so that the list screen can get it.
                userControllerService.setSavedUser(savedUser);
                
                // Go back to the list screen
                clientUtil.changeLocation($location, '/users');

            }).error(function (err) {

                clientUtil.handleErrors(err, $scope, $parse);
            });
        };

        // Just re-direct the user to the list page.
        $scope.cancel = function cancel() {

            clientUtil.changeLocation($location, '/users');
        };

        // BUG BUG - This needs to be moved some where more global. But it's job is to
        //  allow the user to close the alert        
        $scope.closeAlert = function closeAlert(index) {

            $scope.alerts.splice(index, 1);
        };

        // If we have a id, then execute the edit function
        if ($scope.id !== undefined) {

            $scope.edit();
        }
        
        // Call the method that handles all the global onload functionality, like finding the first
        // element to put focus to
        clientUtil.globalOnLoad(sessionService, $location);
    }
]);