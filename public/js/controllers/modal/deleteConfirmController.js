memorizeAppControllers.controller('DeleteConfirmCtrl', ['$scope', '$modalInstance',
    function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close('success');
        };
    
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);