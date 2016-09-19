angular.module('kz.formDaimyo').directive('kzControl', kzControl);

function kzControl(){

    return {

        require: ['^kzUnit', 'ngModel'],
        link: function(scope, element, attrs, ctrls){
            var
                kzUnit = ctrls[0],
                ngModel = ctrls[1];

            kzUnit.setModel(ngModel);
        }
    };
}