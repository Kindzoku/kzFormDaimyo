angular.module('kzFormDaimyo').directive('kzWrap', kzWrap);

function kzWrap() {
    return {
        scope: true,
        controller: kzWrapController
    };
}

kzWrapController.$inject = ['$scope'];
function kzWrapController($scope) {
    this.setModel = function (model) {
        this.model = model;
        $scope.$errors = model.$error;
    };

}