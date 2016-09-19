angular.module('kz.formDaimyo').directive('kzUnit', kzUnit);

function kzUnit() {
    return {
        scope: true,
        require: ['kzUnit', '^?kzRoot'],
        controller: kzUnitController,
        link: function(scope, elem, attrs, ctrls){
            var me = ctrls[0];
            me.root = ctrls[1];
        }
    };
}

kzUnitController.$inject = ['$scope'];
function kzUnitController($scope) {
    var vm = this,
        errorTexts = {},
        watchers = {};


    vm.setModel = function (model) {
        vm.model = model;
        watchers.errors = $scope.$watchCollection(
            function() {
                return model.$error;
            },
            function(errors) {
                $scope.$errors = {};
                Object.keys(errors).map(function(value) {
                    $scope.$errors[value] = errorTexts[value];
                });
            }
        );
        if(vm.root) vm.root.setModel(model);
    };

    vm.setError = function (type, error){
        errorTexts[type] = error;
    };

    $scope.$on('$destroy', function(){
        for(var watcher in watchers) {
            watchers[watcher](); // killing all watchers
        }
    });
}