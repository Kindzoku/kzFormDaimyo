angular.module('kz.formDaimyo').provider('$kz', kzProvider);

function kzProvider(){

    var requireOnInit = false;

    var rules = {
        'required': 'ng-required',
        'pattern': 'ng-pattern',
        'minlength': 'ng-minlength',
        'maxlength': 'ng-maxlength'
    };

    return {

        requireOnInit: function(isRequired){
            requireOnInit = isRequired || false;
        },

        addRuleType: function(name, alias){
            rules[name] = alias;
        },

        $get: function(){
            return {
                requiredOnInit: requireOnInit,
                rules: rules
            };
        }

    };

}