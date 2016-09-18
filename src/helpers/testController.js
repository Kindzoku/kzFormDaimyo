(function(){

    angular.module('kzTestSuite', [ 'kzFormDaimyo', 'ngMessages' ]);

    angular.module('kzTestSuite').config(['$kzProvider', function($kzProvider){
        $kzProvider.requireOnInit(false);
    }]);

    angular.module('kzTestSuite').controller('KzController', KzController);

    KzController.$inject = ['$timeout'];
    function KzController($timeout){

        var vm = this;

        $timeout(function(){
            vm.firstName = '';
        }, 1000);

        vm.lastName = 'Black';

    }

})();