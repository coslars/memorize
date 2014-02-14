
// This service should let us shar data between controllers...
memorizeAppControllers.service('thingControllerService', function () {
    
    var savedThing = {};

    return {
        // Should be called from the list page
        getSavedThing:function () {
            // This exposed private data
            return savedThing;
        },
        
        // Should be called from the detail page.
        setSavedThing:function (thing) {
        
            if (thing !== undefined) {
            
                savedThing = thing;
            }
        },
        
        // We don't need to hold the saved thing anymore, clear it out.
        clearSavedThing:function () {
            
            savedThing = {};
        }
    };
});

/**
 * The LIST controller for the memorize function
 */
memorizeAppControllers.controller('ThingListCtrl', ['$scope', '$http', '$parse', 'sessionService', 'thingControllerService', '$location', 
    function ($scope, $http, $parse, sessionService, thingControllerService, $location) {

        'use strict';       

        $scope.things = [];
        
        // Create an object with all the options we want for the ng-grid
        $scope.gridOptions = {
            data: 'things',
            multiSelect: false,
            selectedItems: [],
            columnDefs: [{
                field: '_id',
                visible: false
            }, {
                field: 'dateCompleted',
                displayName: 'Date Completed',
                cellFilter: 'date:\'' + memorizeApp.sessionObj.dateFormat + '\'',
            }, {
                field: 'desc',
                displayName: 'Description'
            }]
        };        

        // Call the API to get a list of all the things that have been memorized
        $scope.getList = function getList() {

            $http.get(clientUtil.cacheBust('/api/thing'), { cache : false }).success(function (data) {            	
            	
                $scope.things = data; 
                
                // Set this in the service object so that the list screen can get it.
                var lastSavedThing = thingControllerService.getSavedThing();
                
                if (lastSavedThing.desc !== undefined) {
                    
                    clientUtil.handleSuccess("The Memorized Thing with the description \"" + lastSavedThing.desc + "\" has been saved successfully." , $scope, $parse);
                    thingControllerService.clearSavedThing();
                }

            }).error(function (err) {
            	
                clientUtil.handleErrors(err, $scope, $parse);
            });
        	
            // Reset the selected items array
            this.gridOptions.selectedItems.length = 0;
        };

        // Just re-direct the user to the detail page
        $scope.addNew = function addNew() {

            // Go back to the list screen
            clientUtil.changeLocation($location, '/things/detail');
        };

        // Send the user to the detail screen with the id of the edited record
        $scope.edit = function edit() {

            if (this.gridOptions.selectedItems.length > 0) {

                // Go back to the list screen
                clientUtil.changeLocation($location, '/things/detail/' + this.gridOptions.selectedItems[0]._id);                

            } else {

                clientUtil.handleErrors(clientUtil.createClientMessage("Please select a record."), $scope, $parse);
            }
        };

        // Call the api and delete a record by its id
        $scope.deleteId = function deleteId() {

            if (this.gridOptions.selectedItems.length > 0) {

                $http.delete('/api/thing/' + this.gridOptions.selectedItems[0]._id).success(function (deletedThing) {
                    
                    // Get the list
                    $scope.getList();                	
                	
                    // Display a success message to the user
                    clientUtil.handleSuccess("The Memorized Thing with the description \"" + deletedThing.desc + "\" has been deleted successfully." , $scope, $parse);

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
memorizeAppControllers.controller('ThingDetailCtrl', ['$scope', '$http', '$routeParams', '$parse', 'sessionService', 'thingControllerService', '$location', 
    function ($scope, $http, $routeParams, $parse, sessionService, thingControllerService, $location) {

        'use strict';

        // Create an empty object to hold the form data
        $scope.formData = {};

        // Set the id, which may be empty from the passed in id
        $scope.id = $routeParams.thingId;

        // Call the api and get the object for the passed in id
        $scope.edit = function edit() {

            $http.get('/api/thing/' + $scope.id).success(function (thing) {

                $scope.formData.id = thing._id;
                $scope.formData.usr = thing.usr;
                $scope.formData.text = thing.text;
                $scope.formData.desc = thing.desc;
                $scope.formData.dateCompleted = thing.dateCompleted;

            }).error(function (err) {

                clientUtil.handleErrors(err, $scope, $parse);
            });
        };

        // Call the api and insert or update the record
        $scope.save = function save() {

            $http.post('/api/thing', $scope.formData).success(function (savedThing) {

                // Set this in the service object so that the list screen can get it.
                thingControllerService.setSavedThing(savedThing);
                
                // Go back to the list screen                
                clientUtil.changeLocation($location, '/things');

            }).error(function (err) {

                clientUtil.handleErrors(err, $scope, $parse);
            });
        };

        // Just re-direct the user to the list page.
        $scope.cancel = function cancel() {
            
            clientUtil.changeLocation($location, '/things');
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
        
        // CALENDAR OPTIONS
        clientUtil.setCalendarOptions($scope);
    }
]);