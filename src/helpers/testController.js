(function(){

    angular.module('kzTestSuite', [ 'kz.formDaimyo', 'ngMessages' ]);

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

        vm.firstNameRules = [
            { type: 'required', value: true, error: 'Field is required' },
            { type: 'pattern', value: /\d/, error: 'Digits only!' }
        ];

        vm.lastName = 'Black';
        vm.lastNameRules = [
            { type: 'required', value: true, error: 'Field is required' },
            { type: 'minlength', value: 5, error: 'More than 5 characters!' }
        ];
    }

})();