angular.module('kzFormDaimyo').provider('$kz', kzProvider);

function kzProvider(){

    var requireOnInit = false;

    return {

        requireOnInit: function(isRequired){
            requireOnInit = isRequired || false;
        },

        $get: function(){
            return {
                requiredOnInit: requireOnInit
            };
        }

    };

}