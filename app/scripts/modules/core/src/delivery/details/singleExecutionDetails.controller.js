'use strict';

import {EXECUTION_SERVICE} from '../service/execution.service';
import {SCHEDULER_FACTORY} from 'core/scheduler/scheduler.factory';

const angular = require('angular');

module.exports = angular.module('spinnaker.singleExecutionDetails.controller', [
    require('@uirouter/angularjs').default,
    EXECUTION_SERVICE,
    SCHEDULER_FACTORY,
  ])
  .controller('SingleExecutionDetailsCtrl', function ($scope, $state, executionService, schedulerFactory, app) {

    let executionScheduler = schedulerFactory.createScheduler(5000);

    let getExecution = () => {
      this.application = app;
      if (this.application.notFound) {
        return;
      }
      executionService.getExecution($state.params.executionId).then((execution) => {
        this.execution = this.execution || execution;
        executionService.transformExecution(this.application, execution);
        executionService.synchronizeExecution(this.execution, execution);
        if (!execution.isActive) {
          executionScheduler.unsubscribe();
          executionLoader.unsubscribe();
        }
      }, () => {
        this.execution = null;
        this.stateNotFound = true;
      });
    };

    let executionLoader = executionScheduler.subscribe(getExecution);
    getExecution();

    $scope.$on('$destroy', () => {
      executionScheduler.unsubscribe();
      executionLoader.unsubscribe();
    });

    this.showDetails = () => true;

    $scope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
      if (toParams.application !== fromParams.application || toParams.executionId !== fromParams.executionId) {
        getExecution();
      }
    });
  });
