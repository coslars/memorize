/* Controllers */
var memorizeAppControllers = angular.module('memorizeAppControllers', []);

//This service should let us share data between controllers...
memorizeAppControllers.service('sessionService', ['$http', '$parse', function ($http, $parse) {    

    return {
        
        // Should be called from the list page
        getSessionObj: function (callMeBack) {
            
            if (memorizeApp.sessionObj.authUser === undefined) {
                
                $http.get('/api/util/getSession').success(function (thisSessionObj) {

                    memorizeApp.sessionObj = thisSessionObj;
                    
                    callMeBack(memorizeApp.sessionObj);

                }).error(function (err) {

                    memorizeApp.sessionObj = err;
                });
            } else {
                
                callMeBack(memorizeApp.sessionObj);
            }
        },
    };
}]);