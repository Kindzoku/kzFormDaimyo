(function(){

    angular.module('kz.formDaimyo').directive('kzRules', rules);

    rules.$inject = ['$kz', '$compile', '$parse'];
    function rules($kz, $compile, $parse) {
        return {
            terminal: true,
            priority: 1500,
            require: '^kzUnit',
            compile: function compile(element){
                element.removeAttr('kz-rules');
                return {
                    post: function postLink(scope, iElement, iAttrs, kzUnitCtrl) {
                        var init = scope.$watch(iAttrs.kzRules, function(val){
                            if(!val) return;
                            init();
                            var rules = $parse(iAttrs.kzRules)(scope);
                            if(rules) {
                                var aliases = $kz.rules;
                                rules.forEach(function (rule) {
                                    iElement.attr(aliases[rule.type] || rule.type, rule.value);
                                    kzUnitCtrl.setError(rule.type, rule.error);
                                });
                            }
                            $compile(iElement)(scope);

                        });
                    }
                };
            }
        };
    }

})();