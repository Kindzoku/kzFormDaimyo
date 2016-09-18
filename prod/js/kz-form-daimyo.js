;(function() {
"use strict";

angular.module('kzFormDaimyo', []);
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
angular.module('kzFormDaimyo').directive('kzRq', kzRq);

kzRq.$inject = ['$kz'];
function kzRq($kz){

    return {

        require: '^kzWrap',
        link: function(scope, elem, attr, kzWrapCtrl){
            var canValidate = $kz.requiredOnInit, // is required check enabled on init
                errorClass = attr.kzRq || 'kz-rq-invalid', // class for required - true
                watchers = {};

            if(attr.kzRqOninit) canValidate = attr.kzRqOninit === 'true';

            scope.$evalAsync(function(){
                var initWatch = scope.$watch(
                    function(){
                        return kzWrapCtrl.model; // waiting kzWrap receive a model
                    },
                    function(model){
                        if(!model) return;
                        initWatch(); // killing the watcher as it doesn't required anymore
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
                    function(val){
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

angular.module('kzFormDaimyo').directive('kzWrap', kzWrap);

function kzWrap() {
    return {
        scope: true,
        controller: kzWrapController
    };
}

kzWrapController.$inject = ['$scope'];
function kzWrapController($scope) {
    this.setModel = function (model) {
        this.model = model;
        $scope.$errors = model.$error;
    };

}
}());
