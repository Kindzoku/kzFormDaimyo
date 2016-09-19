;(function() {
"use strict";

angular.module('kz.formDaimyo', []);
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
angular.module('kz.formDaimyo').directive('kzRq', kzRq);

kzRq.$inject = ['$kz'];
function kzRq($kz){

    return {

        require: '^kzUnit',
        link: function(scope, elem, attr, kzUnitCtrl){
            var canValidate = $kz.requiredOnInit, // is required check enabled on init
                errorClass = attr.kzRq || 'kz-rq-invalid', // class for required - true
                watchers = {};

            if(attr.kzRqOninit) canValidate = attr.kzRqOninit === 'true';

            scope.$evalAsync(function(){
                watchers.init = scope.$watch(
                    function(){
                        return kzUnitCtrl.model; // waiting kzWrap receive a model
                    },
                    function(model){
                        if(!model) return;
                        watchers.init(); // killing the watcher as it doesn't required anymore
                        initDone(model); // initializing logic
                    }
                );
            });

            function initDone(model){
                if(!canValidate) {

                    // getting form reference
                    var el = elem[0];
                    while ((el = el.parentElement) && el.tagName.toLowerCase() !== 'form'){}
                    var form = angular.element(el);

                    // listening for form submit
                    form.on('submit', function(){
                        canValidate = true; // can validate required after form `submit`
                        scope.$apply();
                    });

                    // watching for user interaction with control. Enabling validation on user interaction
                    watchers.dtWatch = scope.$watch(
                        function(){
                            return model.$dirty;
                        },
                        function(dirty){
                            if(!dirty) return;
                            canValidate = true;
                            watchers.dtWatch();
                        }
                    );
                }

                watchers.rqWatch = scope.$watch(
                    function(){
                        return model.$error.required + canValidate;
                    },
                    function(){
                        if(!canValidate) return;
                        elem.toggleClass(errorClass, model.$error.required || false);
                    }
                );

                scope.$on('$destroy', function(){
                    for(var watcher in watchers) {
                        watchers[watcher](); // killing all watchers
                    }
                });
            }
        }
    }
}

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
}());
