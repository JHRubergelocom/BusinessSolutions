// eslint-disable-next-line no-unused-vars
/*globals angular, elo, sol, api, console, moment, require, for, $$sol */
(function () {
  'use strict';

  angular.module('sol.common.apps.configurations')
    .directive('configDynKwl', function () {
      return {
        restrict: "E",
        controller: ['$rootScope','$scope', '$timeout', '$anchorScroll', 'baseProvider',
          function ($rootScope, $scope, $timeout, $anchorScroll, baseProvider) {
            elo.webapps.WebApp.hideLoadingScreen();
            $scope.cfWidth = "250px";
            $scope.test = { running: false };
            $scope.newKeywordlist = false;
            $scope.newKwl = "";

            $scope.getStyleLeft = function() {
              var ret = {};
              if ($scope.cfWidth && $scope.cfWidth.indexOf('px') > 0) {
                ret.width = $scope.cfWidth;
              }
              return ret;
            };

            $scope.getStyleRight = function() {
              var ret = {};
              if ($scope.cfWidth && $scope.cfWidth.indexOf('px') > 0) {
                var pos = $scope.cfWidth.indexOf('px');
                var num = parseInt($scope.cfWidth.substring(0, pos));
                ret.marginLeft = (num + 15) + 'px';
              }
              return ret;
            };

            $scope.isCustom = function(item) {
              if (!!$scope.allResult && !!$scope.allResult.configs) {
                var result = $scope.allResult.getPathInfo(item);
                return (result.sourceIndex === $scope.sourceIndex);
              }
            };

            $scope.setActive = function (key) {
              $scope.activeItem = key;
              $scope.newKeywordlist = false;
            };

            $scope.addKwl = function() {
              $scope.newKwl = "";
              $scope.newKeywordlist = true;
            };

            $scope.createKwl = function(newKwl) {
              $scope.allResult.merge[newKwl] = null;
              $scope.allResult.update();
              $scope.allResult.merge[newKwl] = {};
              $scope.allResult.merge[newKwl].type = null;
              $scope.allResult.merge[newKwl].translate = null;
              $scope.allResult.merge[newKwl].title = null;
              $scope.allResult.update();
              $scope.allResult.merge[newKwl].type = "DB";
              $scope.allResult.merge[newKwl].translate = true;
              $scope.allResult.merge[newKwl].title = "";
              $scope.newKeywordlist = false;
              $scope.setActive(newKwl);
            };

            $scope.cancelKwl = function() {
              $scope.newKwl = "";
              $scope.newKeywordlist = false;
            };

            $scope.showRemove = function(key) {
              if ($scope.sourceIndex === 0) {
                return true;
              }
              var result = $scope.allResult.findPropertyTarget(key, 0, $scope.sourceIndex-1);
              return result.configsIndex === -1 ? true : false;
            };

            $scope.removeKeywordlist = function(key) {
              delete $scope.allResult.configs[$scope.sourceIndex][key];
              delete $scope.allResult.merge[key];
              delete $scope.allResult.merge["___" + key];
              if ($scope.activeItem === key) {
                $scope.activeItem = null;
              }
            };

            $scope.changeType = function(key, value) {
              $scope.data[key].type = value;
              if (value === 'CHILDREN') {
                if (!$scope.allResult.merge[key].___output) {
                  $scope.allResult.merge[key].output = [];
                  $scope.allResult.update();
                  $scope.allResult.merge[key].output.push(null);
                  $scope.allResult.merge[key].output.push(null);
                }
                else {
                  $scope.data[key].output.length = 0;
                  $scope.data[key].output.push(null);
                  $scope.data[key].output.push(null);
                  $scope.data[key].output.solTriggerWatcher();
                  if (!!$scope.data[key].dataFields) {
                    $scope.data[key].dataFields = undefined;
                  }
                  if (!!$scope.data[key].header) {
                    $scope.data[key].header = undefined;
                  }
                }
              }
            };

            $scope.changeParentId = function(key, value) {
              if (!$scope.allResult.merge[key].___parentId) {
                $scope.allResult.merge[key].parentId = null;
                $scope.allResult.update();
                $scope.allResult.merge[key].parentId = value;
              }
            };

            $scope.changeDBName = function(key, value) {
              if (!$scope.allResult.merge[key].___dbName) {
                $scope.allResult.merge[key].dbName = null;
                $scope.allResult.update();
                $scope.allResult.merge[key].dbName = value;
              }
            };

            $scope.changeJdbc = function(key, value) {
              if (!$scope.allResult.merge[key].___jdbc) {
                $scope.allResult.merge[key].jdbc = null;
                $scope.allResult.update();
                $scope.allResult.merge[key].jdbc = value;
              }
            };

            $scope.getLength = function(tmpObject)
            {
              var iLength = 0;
              for (var sKey in tmpObject)
              {
                if (tmpObject.hasOwnProperty(sKey)) iLength++;
              }
              return iLength;
            };

            $scope.tableStyle = function(key, type, row) {
              return "";
              // var ret, val, hasAlternateOutput, iOutputCount;
              // hasAlternateOutput = false;
              // iOutputCount = 0;
              // if (!!$scope.data[key].output_) {
              //   hasAlternateOutput = true;
              //   iOutputCount = $scope.getLength($scope.data[key].output_);
              // }
              // switch(row) {
              // case 'header':
              //   ret = type === 'CHILDREN' ? {width: '10%'} : {width: '50%'};
              //   //ret = '';
              //   break;
              // case 'output':
              //   ret = type === 'CHILDREN' ? {width: (90/(iOutputCount+1)) +'%'} : (type === 'DB' ? {width: (100/(iOutputCount+2)) +'%'} : {width: (100/(iOutputCount+2)) +'%'});
              //   break;
              // case 'output_':
              //   ret = type === 'CHILDREN' ? {width: (90/(iOutputCount+1)) +'%'} : (type === 'DB' ? {width: (100/(iOutputCount+2)) +'%'} : {width: (100/(iOutputCount+2)) +'%'});
              //   break;
              // case 'dataField':
              //   ret = {width: (90/(iOutputCount+2)) +'%'};
              //   break;
              // }
              // return ret;
            };

            $scope.searchParamsStyle = function(type) {
              return type === 'SEARCH' ? {width: '20%'} : {width: '28%'};
            };

            $scope.changeElement = function(key, row) {
              $scope.data[key][row].solTriggerWatcher();
            };

            $scope.changeAltElement = function(key, outKey) {
              $scope.data[key].output_[outKey].solTriggerWatcher();
            };

            $scope.getElementStatus = function(key, row, $index) {
              return (!!$scope.data[key][row] && (!!$scope.data[key][row][$index] || angular.isString($scope.data[key][row][$index]))) ? true : false;
            };

            $scope.changeElementStatus = function(key, row, $index) {
              if (!!$scope.data[key][row] && (!!$scope.data[key][row][$index] || angular.isString($scope.data[key][row][$index]))) {
                $scope.data[key][row][$index] = null;
              }
              else {
                if (row === 'columnProperties') {
                  if (!$scope.data[key][row]) {
                    $scope.data[key][row] = [];
                    $scope.allResult.update();
                    for (var i = 0; i < $scope.data[key].output.length; i++) {
                      $scope.data[key][row].push(null);
                    }
                  }
                  $scope.data[key][row][$index] = {'width-px': ''};
                }
                else {
                  $scope.data[key][row][$index] = "";
                }
              }
              $scope.data[key][row].solTriggerWatcher();
            };

            $scope.getAltElementStatus = function(key, outKey, $index) {
              return (!!$scope.data[key].output_[outKey][$index] || angular.isString($scope.data[key].output_[outKey][$index])) ? true : false;
            };

            $scope.changeAltElementStatus = function(key, outKey, $index) {
              if (!!$scope.data[key].output_[outKey][$index] || angular.isString($scope.data[key].output_[outKey][$index])) {
                $scope.data[key].output_[outKey][$index] = null;
              }
              else {
                $scope.data[key].output_[outKey][$index] = "";
              }
              $scope.data[key].output_[outKey].solTriggerWatcher();
            };

            $scope.removeTableRow = function(key, type, $index) {
              if ($index !== -1) {
                $scope.data[key].output.splice($index, 1);
                $scope.data[key].output.solTriggerWatcher();
                if (!!$scope.data[key].columnProperties) {
                  $scope.data[key].columnProperties.splice($index, 1);
                  $scope.data[key].columnProperties.solTriggerWatcher();
                }
                if (type === "SEARCH") {
                  $scope.data[key].header.splice($index, 1);
                  $scope.data[key].header.solTriggerWatcher();
                  $scope.data[key].dataFields.splice($index, 1);
                  $scope.data[key].dataFields.solTriggerWatcher();
                }
                if (type === "DB") {
                  $scope.data[key].header.splice($index, 1);
                  $scope.data[key].header.solTriggerWatcher();
                }
                if (!!$scope.data[key].___output_ && $scope.getLength($scope.data[key].___output_) > 0) {
                  for (var sKey in $scope.data[key].output_)
                  {
                    if ($scope.data[key].output_.hasOwnProperty(sKey)) {
                      $scope.data[key].output_[sKey].splice($index, 1);
                      $scope.data[key].output_[sKey].solTriggerWatcher();
                    }
                  }
                }
              }
            };

            $scope.addTableRow = function(key, type) {
              if (!$scope.data[key].___output) {
                $scope.allResult.merge[key].output = [];
                $scope.allResult.update();
              }
              if (type === "SEARCH" && !$scope.data[key].___dataFields) {
                $scope.allResult.merge[key].dataFields = [];
                $scope.allResult.update();
              }
              if ((type === "DB" || type === "SEARCH") && !$scope.data[key].___header) {
                $scope.allResult.merge[key].header = [];
                $scope.allResult.update();
              }
              $scope.data[key].output.push("");
              $scope.data[key].output.solTriggerWatcher();
              if (!!$scope.data[key].columnProperties) {
                $scope.data[key].columnProperties.push("");
                $scope.data[key].columnProperties.solTriggerWatcher();
              }
              if (type === "SEARCH") {
                $scope.data[key].header.push("");
                $scope.data[key].header.solTriggerWatcher();
                $scope.data[key].dataFields.push("");
                $scope.data[key].dataFields.solTriggerWatcher();
              }
              if (type === "DB") {
                $scope.data[key].header.push("");
                $scope.data[key].header.solTriggerWatcher();
              }
              if (!!$scope.data[key].___output_) {
                for (var sKey in $scope.data[key].output_)
                {
                  if ($scope.data[key].output_.hasOwnProperty(sKey)) {
                    $scope.data[key].output_[sKey].push("");
                    $scope.data[key].output_[sKey].solTriggerWatcher();
                  }
                }
              }
            };

            $scope.getSearchParamsDBValue = function(param) {
              var ret = "";
              if (!!param.valueType || param.valueType !== undefined) {
                ret = api.helpers.Text.getText('SOL.COMMON.APPS.CONFIGURATIONS.DYNKWLCONFIG.SEARCHPARAMS.DB.LANG');
              }
              if (!!param.value || param.value !== undefined) {
                ret = api.helpers.Text.getText('SOL.COMMON.APPS.CONFIGURATIONS.DYNKWLCONFIG.SEARCHPARAMS.BUTTONVALUE');
              }
              if (!!param.name || param.name !== undefined) {
                ret = api.helpers.Text.getText('SOL.COMMON.APPS.CONFIGURATIONS.DYNKWLCONFIG.SEARCHPARAMS.DB.NAME');
              }
              if (ret.length === 0) {
                ret = api.helpers.Text.getText('SOL.COMMON.APPS.CONFIGURATIONS.DYNKWLCONFIG.SEARCHPARAMS.NONAME');
              }
              return ret;
            };

            $scope.changeSearchParamsDBValue = function(key, $index, value) {
              switch(value) {
              case 'NONAME':
                delete $scope.data[key].searchParams[$index].value;
                delete $scope.data[key].searchParams[$index].___value;
                delete $scope.data[key].searchParams[$index].name;
                delete $scope.data[key].searchParams[$index].___name;
                delete $scope.data[key].searchParams[$index].message;
                delete $scope.data[key].searchParams[$index].___message;
                delete $scope.data[key].searchParams[$index].valueType;
                delete $scope.data[key].searchParams[$index].___valueType;
                break;
              case 'NAME':
                $scope.data[key].searchParams[$index].name = '';
                delete $scope.data[key].searchParams[$index].value;
                delete $scope.data[key].searchParams[$index].___value;
                delete $scope.data[key].searchParams[$index].valueType;
                delete $scope.data[key].searchParams[$index].___valueType;
                break;
              case 'VALUE':
                $scope.data[key].searchParams[$index].value = '';
                delete $scope.data[key].searchParams[$index].name;
                delete $scope.data[key].searchParams[$index].___name;
                delete $scope.data[key].searchParams[$index].message;
                delete $scope.data[key].searchParams[$index].___message;
                delete $scope.data[key].searchParams[$index].valueType;
                delete $scope.data[key].searchParams[$index].___valueType;
                break;
              case 'LANG':
                $scope.data[key].searchParams[$index].valueType = 'LANGUAGE';
                delete $scope.data[key].searchParams[$index].name;
                delete $scope.data[key].searchParams[$index].___name;
                delete $scope.data[key].searchParams[$index].message;
                delete $scope.data[key].searchParams[$index].___message;
                delete $scope.data[key].searchParams[$index].value;
                delete $scope.data[key].searchParams[$index].___value;
                break;
              }
              $scope.data[key].searchParams.solTriggerWatcher();
            };

            $scope.getSearchParamsMode = function(param) {
              return (!!param.mode || param.mode !== undefined) ? param.mode : 'EQUALS';
            };

            $scope.changeSearchParamMode = function(key, $index, mode) {
              if (mode === 'EQUALS') {
                delete $scope.data[key].searchParams[$index].mode;
                delete $scope.data[key].searchParams[$index].___mode;
              }
              else {
                $scope.data[key].searchParams[$index].mode = mode;
              }
              $scope.data[key].searchParams.solTriggerWatcher();
            };

            $scope.changeSearchParamsValue = function(key, $index) {
              $scope.data[key].searchParams.solTriggerWatcher();
            };

            $scope.getSearchParamsName = function(param) {
              var ret = "";
              if (!!param.searchName || param.searchName !== undefined) {
                ret = param.searchName;
              }
              else {
                ret = param.name;
              }
              return ret;
            };

            $scope.getSearchParamsValue = function(param) {
              var ret = "";
              if (!!param.searchName || param.searchName !== undefined) {
                ret = param.name;
              }
              else {
                if (!!param.value || param.value !== undefined) {
                  ret = param.name;
                }
              }
              return ret;
            };

            $scope.getSearchParamsSearchValue = function(param) {
              var ret = "";
              if (!!param.value || param.value !== undefined) {
                ret = api.helpers.Text.getText('SOL.COMMON.APPS.CONFIGURATIONS.DYNKWLCONFIG.SEARCHPARAMS.BUTTONVALUE');
              }
              if (!!param.searchName || param.searchName !== undefined) {
                ret = api.helpers.Text.getText('SOL.COMMON.APPS.CONFIGURATIONS.DYNKWLCONFIG.SEARCHPARAMS.SEARCH.NAME');
              }
              if (ret.length === 0) {
                ret = api.helpers.Text.getText('SOL.COMMON.APPS.CONFIGURATIONS.DYNKWLCONFIG.SEARCHPARAMS.NONAME');
              }
              return ret;
            };

            $scope.changeSearchParamsSearchValue = function(key, $index, value) {
              switch(value) {
              case 'NONAME':
                delete $scope.data[key].searchParams[$index].value;
                delete $scope.data[key].searchParams[$index].___value;
                delete $scope.data[key].searchParams[$index].searchName;
                delete $scope.data[key].searchParams[$index].___searchName;
                break;
              case 'NAME':
                $scope.data[key].searchParams[$index].searchName = $scope.data[key].searchParams[$index].name;
                $scope.data[key].searchParams[$index].name = '';
                delete $scope.data[key].searchParams[$index].value;
                delete $scope.data[key].searchParams[$index].___value;
                break;
              case 'VALUE':
                $scope.data[key].searchParams[$index].name = $scope.data[key].searchParams[$index].searchName;
                $scope.data[key].searchParams[$index].value = '';
                delete $scope.data[key].searchParams[$index].searchName;
                delete $scope.data[key].searchParams[$index].___searchName;
                break;
              }
              $scope.data[key].searchParams.solTriggerWatcher();
            };

            $scope.getSearchParamsMessage = function(param) {
              return (!!param.message || param.message !== undefined) ? api.helpers.Text.getText('SOL.COMMON.APPS.CONFIGURATIONS.DYNKWLCONFIG.SEARCHPARAMS.DB.MESSAGE') : api.helpers.Text.getText('SOL.COMMON.APPS.CONFIGURATIONS.DYNKWLCONFIG.SEARCHPARAMS.DB.NOMESSAGE');
            };

            $scope.changeSearchParamsMessage = function(key, $index, value) {
              switch(value) {
              case 'MESSAGE':
                $scope.data[key].searchParams[$index].message = '';
                break;
              case 'NOMESSAGE':
                delete $scope.data[key].searchParams[$index].message;
                delete $scope.data[key].searchParams[$index].___message;
                break;
              }
              $scope.data[key].searchParams.solTriggerWatcher();
            };

            $scope.changeSqlQuery = function(key, value) {
              if (!$scope.data[key].___sqlQuery) {
                $scope.allResult.merge[key].sqlQuery = null;
                $scope.allResult.update();
                $scope.allResult.merge[key].sqlQuery = value;
              }
            };

            $scope.removeSearchParams = function(key, $index) {
              if ($index !== -1) {
                $scope.data[key].searchParams.splice($index, 1);
                $scope.data[key].searchParams.solTriggerWatcher();
              }
            };

            $scope.addSearchParams = function(key) {
              if (!$scope.data[key].___searchParams) {
                $scope.allResult.merge[key].searchParams = [];
                $scope.allResult.update();
              }
              $scope.data[key].searchParams.push({});
              $scope.data[key].searchParams.solTriggerWatcher();
            };

            $scope.changeTestInput = function(key, field, value) {
              if (!$scope.allResult.merge[key].___input) {
                $scope.allResult.merge[key].input = null;
                $scope.allResult.update();
                $scope.allResult.merge[key].input = {};
              }
              if (!$scope.allResult.merge[key].input['___' + field]) {
                $scope.allResult.merge[key].input[field] = null;
                $scope.allResult.update();
                $scope.allResult.merge[key].input[field] = value;
              }
            };

            $scope.changeFilter = function(key) {
              $scope.data[key].filter.solTriggerWatcher();
            };

            $scope.addFilter = function(key) {
              if (!$scope.allResult.merge[key].___filter) {
                $scope.allResult.merge[key].filter = [];
                $scope.allResult.update();
              }
              $scope.data[key].filter.push({});
              $scope.data[key].filter.solTriggerWatcher();
            };

            $scope.removeFilter = function(key, $index) {
              if ($index !== -1) {
                $scope.data[key].filter.splice($index, 1);
                $scope.data[key].filter.solTriggerWatcher();
              }
            };

            $scope.testDynKwl = function(key) {
              var i, tmp, inputVal, filterVal, searchParamsVal;
              $scope.test.running = true;

              inputVal = {};
              inputVal.name = (!!$scope.data[key].input && !!$scope.data[key].input.name) ? $scope.data[key].input.name : '';
              inputVal.value = (!!$scope.data[key].input && !!$scope.data[key].input.value) ? $scope.data[key].input.value : '';
              filterVal = [];
              if (!!$scope.data[key].filter) {
                for (i = 0; i < $scope.data[key].filter.length; i++) {
                  filterVal.push({name: $scope.data[key].filter[i].name, value: $scope.data[key].filter[i].value});
                }
              }
              searchParamsVal = [];
              if (!!$scope.data[key].searchParams) {
                for (i = 0; i < $scope.data[key].searchParams.length; i++) {
                  tmp = {};
                  if (!!$scope.data[key].searchParams[i].mode) {
                    tmp.mode = $scope.data[key].searchParams[i].mode;
                  }
                  if (!!$scope.data[key].searchParams[i].name) {
                    tmp.name = $scope.data[key].searchParams[i].name;
                  }
                  if (!!$scope.data[key].searchParams[i].message) {
                    tmp.message = $scope.data[key].searchParams[i].message;
                  }
                  if (!!$scope.data[key].searchParams[i].value) {
                    tmp.value = $scope.data[key].searchParams[i].value;
                  }
                  if (!!$scope.data[key].searchParams[i].searchName) {
                    tmp.searchName = $scope.data[key].searchParams[i].searchName;
                  }
                  searchParamsVal.push(tmp);
                }
              }

              sol.common.IxUtils.execute('RF_sol_service_TestGenericDynKwl', {
                type: $scope.data[key].type,
                translate: $scope.data[key].translate,
                title: $scope.data[key].title,
                header: $scope.data[key].header || null,
                output: $scope.data[key].output || null,
                dataFields: $scope.data[key].dataFields || null,
                searchParams: searchParamsVal,
                dbName: $scope.data[key].dbName || null,
                jdbc: $scope.data[key].jdbc || null,
                sqlQuery: $scope.data[key].sqlQuery || null,
                input: inputVal,
                filter: filterVal
              }, function (data) {
                $scope.test[key] = data;
                $scope.test.running = false;
                $scope.$apply();
                $timeout(function() {
                  $anchorScroll('testsection');
                },2);

              }, function (err) {
                if (!$scope.test[key]) {
                  $scope.test[key] = {};
                }
                $scope.test[key].error = err.msg;
                $scope.test.running = false;
                $scope.$apply();
                $timeout(function() {
                  $anchorScroll('testsection');
                },2);
              });
            };

            $scope.getFormat = function(key, type, $index) {
              return (!!$scope.data[key].formatting[$index][type] || $scope.data[key].formatting[$index][type] === 0);
            };

            $scope.addFormatting = function(key) {
              var format = {type: "NUMBER"};
              if (!$scope.data[key].formatting) {
                $scope.data[key].formatting = [];
                $scope.allResult.update();
              }
              $scope.data[key].formatting.push(format);
              $scope.data[key].formatting.solTriggerWatcher();
            };

            $scope.changeFormat = function(key, type, $index) {
              var val;
              if (type === 'groupingUsed') {
                if (!!$scope.data[key].formatting[$index][type]) {
                  $scope.data[key].formatting[$index][type] = !$scope.data[key].formatting[$index][type];
                }
                else {
                  $scope.data[key].formatting[$index][type] = true;
                  $scope.allResult.update();
                }
                $scope.data[key].formatting.solTriggerWatcher();
                return;
              }
              if (!!$scope.data[key].formatting[$index][type]) {
                delete $scope.data[key].formatting[$index][type];
                delete $scope.data[key].formatting[$index]['___' + type];
              }
              else {
                val = "";
                switch(type) {
                case 'decimalSeparator':
                  val = ",";
                  break;
                case 'minimumFractionDigits':
                  val = 2;
                  break;
                case 'maximumFractionDigits':
                  val = 2;
                  break;
                case 'groupingUsed':
                  val = true;
                  break;
                case 'columnNames':
                  val = [""];
                  if (!!$scope.data[key].formatting[$index].columnIndexes) {
                    delete $scope.data[key].formatting[$index].columnIndexes;
                    delete $scope.data[key].formatting[$index].___columnIndexes;
                  }
                  break;
                case 'columnIndexes':
                  val = [""];
                  if (!!$scope.data[key].formatting[$index].columnNames) {
                    delete $scope.data[key].formatting[$index].columnNames;
                    delete $scope.data[key].formatting[$index].___columnNames;
                  }
                  break;
                }
                $scope.data[key].formatting[$index][type] = val;
                $scope.allResult.update();
              }
              $scope.data[key].formatting.solTriggerWatcher();
            };

            $scope.removeFormat = function(key, $index) {
              $scope.data[key].formatting.splice($index, 1);
              $scope.data[key].formatting.solTriggerWatcher();
            };

            $scope.changeFormatting = function(key) {
              $scope.data[key].formatting.solTriggerWatcher();
            };

            $scope.addColumn = function(key, type, $index) {
              $scope.data[key].formatting[$index][type].push("");
              $scope.data[key].formatting.solTriggerWatcher();
            };

            $scope.changeColumn = function(key, type, outerIndex, $index, col) {
              $scope.data[key].formatting[outerIndex][type][$index] = col;
              $scope.data[key].formatting.solTriggerWatcher();
            };

            $scope.removeColumn = function(key, type, outerIndex, $index) {
              $scope.data[key].formatting[outerIndex][type].splice($index, 1);
              $scope.data[key].formatting.solTriggerWatcher();
            };



            $scope.$watch('$root.loaded',function() {
              if ($rootScope.loaded) {
                $scope.allResult = baseProvider.getAllResult();
                $scope.data = $scope.allResult.merge;
                $scope.sourceIndex = baseProvider.getSourceIndex();
                $scope.showCustom = baseProvider.getShowCustom();
              }
            });
          }],
        templateUrl: sol.common.apps.configurations.relativeUrl + 'directives/compositions/configDynKwl.html?_build=' + elo.data.server.appBuild
      };
    });
})();