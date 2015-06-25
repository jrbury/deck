'use strict';


angular
  .module('spinnaker.pipeline.targetSelect.directive', [
  ])
  .directive('targetSelect', function() {
    return {
      restrict: 'E',
      scope: {
        options: '=',
        model: '='
      },
      templateUrl: 'scripts/modules/pipelines/config/targetSelect.html'
    };
  });