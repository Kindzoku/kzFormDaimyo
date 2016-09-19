angular.module('kz.formDaimyo').directive('kzRoot', kzRoot);

function kzRoot() {
    return {
        scope: true,
        controller: kzRootController
    };
}

kzRootController.$inject = ['$scope'];
function kzRootController($scope) {
    var vm = this;
    vm.models = [];

    vm.setModel = function (model) {
        vm.models.push(model);
    };
}