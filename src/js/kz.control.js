angular.module('kzFormDaimyo').directive('kzControl', kzControl);

function kzControl(){

    return {

        require: ['^kzWrap', 'ngModel'],
        link: function(scope, element, attrs, ctrls){
            var
                kzWrap = ctrls[0],
                ngModel = ctrls[1];

            kzWrap.setModel(ngModel);
        }
    };
}