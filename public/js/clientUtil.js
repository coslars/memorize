var clientUtil = {

    // This function needs to handle all errors coming back from the server, if it's an
    //  array of errors then they are validation errors, if it's an object then we had a hard
    //  error on the server.
    handleErrors: function handleErrors(errorObject, $scope, $parse) {

        'use strict';

        var i, serverMessage, field, thisMsg, formGroupEle;

        // Clear out old messages
        this.clearErrors($scope, $parse);

        // If it's an array then we have an array of validation errors 
        if ($.isArray(errorObject)) {

            if (errorObject.length > 0) {

                for (i = 0; i < errorObject.length; i += 1) {

                    field = errorObject[i].param;
                    thisMsg = errorObject[i].msg;

                    // Here we are just setting the error message to what was received on the server.
                    serverMessage = $parse('mainForm.' + field + '.$error.serverMessage');
                    $scope.mainForm.$setValidity(field, false, $scope.mainForm);
                    serverMessage.assign($scope, thisMsg);

                    // Give the form group a style
                    formGroupEle = '#' + field + 'FormGroup';
                    if ($(formGroupEle).length) {

                        $(formGroupEle).addClass('has-error');
                    }
                }
            }
        } else {

            // Ok, we didn't get an array, this must be an error from the api.
            thisMsg = errorObject.message;

            // Make sure we are getting what we expect
            if (thisMsg === undefined) {

                // Ok, we didn't get what we had expected, BUG BUG, need to de-jasonify this
                thisMsg = errorObject;
            }

            $scope.alerts = [{
                type: 'danger',
                msg: thisMsg
            }];
        }
    },

    // The is the inverse of handleErrors.  The page doesn't refresh so we need to clear old messages out.
    clearErrors: function clearErrors($scope, $parse) {

        'use strict';

        var errorElements = $('.has-error'), formGroupEleId, fieldName, serverMessage, i, eleLength;

        for (i = 0, eleLength = errorElements.length; i < eleLength; i += 1) {

            // Pull out the id of the Form Group
            formGroupEleId = errorElements[i].id;

            // The fields are named [fieldName]FormGroup (ex: userNameFormGroup)
            //  Strip out the field Name
            fieldName = formGroupEleId.substring(0, formGroupEleId.indexOf('FormGroup'));

            // Reset the error message to nothing
            serverMessage = $parse('mainForm.' + fieldName + '.$error.serverMessage');
            $scope.mainForm.$setValidity(fieldName, true, $scope.mainForm);
            serverMessage.assign($scope, "");

            // Get rid of the error class.
            $('#' + formGroupEleId).removeClass('has-error');
        }
    },

    // Handle any success we need to show the user
    handleSuccess: function handleSuccess(successObject, $scope, $parse) {

        'use strict';

        var thisMsg;

        // Pull out the message from the object
        thisMsg = successObject.message;

        // Make sure we are getting what we expect
        if (thisMsg === undefined) {

            // Ok, we didn't get what we had expected, BUG BUG, need to de-jasonify this
            thisMsg = successObject;
        }

        $scope.alerts = [{
            type: 'success',
            msg: thisMsg
        }];
    },

    // Just create an object that we can pass to our alerts functionality
    createClientMessage: function createClientMessage(messageToCreate) {

        'use strict';

        return {
            message: messageToCreate
        };
    },

    // Find the first element to set focus to
    findFirstFocus: function findFirstFocus() {

        'use strict';

        if ($('#mainForm').length) {

            $('#mainForm').find('input[type=text],textarea,select').filter(':visible:first').focus();
        }
    },

    // Anything that needs to be called onload throughout the application.
    //  There should be a call to this at the bottom of each controller.
    globalOnLoad: function globalOnLoad(sessionService, $location) {

        'use strict';

        // Put the user id into the nav
        if (sessionService !== undefined) {

            sessionService.getSessionObj(function (sessionObj) {

                if (sessionObj !== undefined && sessionObj.authUser !== undefined) {

                    // Display the navigation
                    clientUtil.displayNav();

                    // For pages with inputs on them, set focus to the first one.
                    clientUtil.findFirstFocus();

                    // Put the name up in the navigation
                    clientUtil.setUserName('You are: ' + sessionObj.authUser.userName);

                    // Set the height of the grid
                    clientUtil.setGridHeight();

                } else if (!clientUtil.isOnLoginPage()) {

                    // We don't have a populated session object, make em go login
                    clientUtil.changeLocation($location, '/login');
                }
            });
        }
    },

    // Anything that needs to be called onload throughout the application.
    //  There should be a call to this at the bottom of each controller.
    globalOnResize: function globalOnResize() {

        'use strict';

        // Set the height of the grid if we are on a page with a grid
        this.setGridHeight();
    },

    // Set the user name in the header
    setUserName: function setUserName(userName) {

        'use strict';

        if ($('#divUserName').length) {

            $('#divUserName').html(userName);
        }
    },

    // Only show the nav when we are not on the login screen.
    displayNav: function displayNav() {

        'use strict';

        if (!clientUtil.isOnLoginPage()) {

            $('#divMainNav').show();
        }
    },

    // boolean to tell us if we are on the login page or not.
    isOnLoginPage: function isOnLoginPage() {

        'use strict';

        var isOnLogin = true;

        if ($('#divLogin').length === 0) {

            isOnLogin = false;
        }

        return isOnLogin;
    },

    // Set the height of the angular grid
    setGridHeight: function setGridHeight() {

        'use strict';

        var newHeight = 350, takePixels = 400;

        if ($('.gridStyle').length) {

            if ((window.innerHeight - takePixels) > newHeight) {

                newHeight = window.innerHeight - takePixels;
            }

            $('.gridStyle').height(newHeight);
        }
    },

    // Set all the options for the Angular calendar
    setCalendarOptions: function setCalendarOptions($scope) {

        'use strict';

        $scope.showWeeks = true;
        $scope.toggleWeeks = function () {
            $scope.showWeeks = !$scope.showWeeks;
        };

        $scope.toggleMin = function () {
            $scope.minDate = ($scope.minDate) ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        $scope.dateOptions = {
            'year-format': "'yyyy'",
            'starting-day': 1
        };

        //$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
        $scope.format = memorizeApp.sessionObj.dateFormat;
    },

    // Handle window.location.  Angular has it's own way of doing things
    //  so in case I don't really understand it, I'll just have to change it here.
    changeLocation: function changeLocation($location, newLocation, isReplace) {

        'use strict';

        $location.url(newLocation, isReplace);
    },

    // If the same URL is called multiple times in a row the browser will go to it's cache
    //  for it's results.  This tricks the browser into thinking it has a new url.
    cacheBust: function cacheBust(url) {

        'use strict';

        var append = '?ts=' + new Date().getTime();

        return url + append;
    }
};