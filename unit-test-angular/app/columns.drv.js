(function(){
  'use strict';

  angular.module('adn.tables',['ngCookies'])
  .directive('columnsSelector', ['columnStateService',ColumnsSelector])
  .directive('btnColumnsSelector', BtnColumnsSelector)
  .factory('columnStateService', ['$cookies',ColumnStateService]);

  function ColumnsSelector(columnStateService) {
    return {
      restrict: 'A',
      scope: true,
      controller: ['$scope',function($scope) {
                
        $scope.columns = [];
        $scope.tableElement;
        
        $scope.toggle = function(event, column) {
          column.isVisible = !column.isVisible;
          if (column.isVisible) 
            $scope.showColumn(column)          
          else                 
            $scope.hideColumn(column);
            
          columnStateService.save($scope.columns);
        }
        
        $scope.hideColumn = function(column) {
          var elements = getColumnElements(column);
          elements.header.hide(); 
          elements.associatedColumns.hide();
        }
        
        $scope.showColumn = function (column) {
          var elements = getColumnElements(column);
          elements.header.show();
          elements.associatedColumns.show();  
        }
        
        function getColumnElements(column){
            var _header = $scope.tableElement.find('th#'+ column.id);
            var _associatedColumns = _header.closest('table').find('td[headers='+ column.id +']');
            return {
                header : _header,
                associatedColumns: _associatedColumns  
            }  
        }
      }],
      compile: function(element, attr) {
        return {
          pre:  function(scope, element, attr){              
            columnStateService.setup({key: element.data('selector-key')});   
                     
            scope.tableElement = element.find('table'); 
            
            var columns =  scope.tableElement.find('th');
            angular.forEach(columns, function(column, idx){
              scope.columns.push({index: idx, name: angular.element(column).text(), isVisible: true, id: column.id});
            });           
           
            var defaultAttributesWatch = scope.$watchCollection(attr.columnsSelector, function (newValue) {                
                loadFromDefaultState(newValue, scope);                
            });
            
            loadFromState(defaultAttributesWatch, scope);         
          }
        }
        
        function findColumn(columns, id){
            for(var i = 0; i < columns.length; i++){
                if (columns[i].id == id)
                    return columns[i];     
            }
        }
        
        function loadFromState(watchDefaultState, scope){
            var lastConfiguration = columnStateService.load(); 
            if (lastConfiguration) {            
                watchDefaultState();
                
                angular.forEach(lastConfiguration, function(column){ 
                       if(column.isVisible)   
                         scope.showColumn(column);
                       else
                         scope.hideColumn(column);
                }); 
            }
        }
        
        function loadFromDefaultState(newValue, scope) {
            if (angular.isDefined(newValue)){
                angular.forEach(scope.columns, function(column){
                    column.isVisible = false;
                    scope.hideColumn(column);
                    var c = findColumn(newValue, column.id);
                    angular.merge(column, c);                       
                    if(column.isVisible)   
                        scope.showColumn(column);
                });                   
            }
        }
      }
    }
  }  
  
  function BtnColumnsSelector() {
    return {
      restrict: 'A',
      require: '^columnsSelector',      
      template: itemTemplate(),  
    }

    function itemTemplate() {        
      return    '<li ng-repeat="column in columns">'+  
                '<a href="#" ng-click="toggle($event, column)">'+
                '<div class="checkbox">' +
                '<label>'+
                '<input type="checkbox" ng-model="column.isVisible" ng-change="toggle($event, column)">'+
                    '{{column.name}}'+
                '</label>'+
                '</div>'+
                '</a>'+
                '</li>';
    }
  }
  
  function ColumnStateService($cookies){
      var _stateKey;
      return {
          setup: function(info){
              _stateKey = info.key;
          },
          save: function(config){
              if (angular.isUndefined(_stateKey) || _stateKey === '')
                throw Error('The StateKey was not configurated, please, run setup before');
              $cookies.put(_stateKey, config);
          },          
          load: function(key){
              return $cookies.get(_stateKey);
          }
      }
  }
})();
