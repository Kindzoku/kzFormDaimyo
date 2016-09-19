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
