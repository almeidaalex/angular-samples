(function(){
  'use strict';

  angular.module('adn.tables',[])
  .directive('columnsSelector', ColumnsSelector)
  .directive('btnColumnsSelector', BtnColumnsSelector);

  function ColumnsSelector() {
    return {
      restrict: 'A',
      scope: true,
      controller: ['$scope',function($scope) {        
        $scope.columns = [];
        $scope.tableElement;
        
        $scope.toggle = function(event, column) {
          column.isVisible = !column.isVisible;
          var header = $scope.tableElement.find('th#'+ column.id);
          var associatedColumns = header.closest('table').find('td[headers='+ column.id +']');
          
          if (column.isVisible) {
            header.show();
            associatedColumns.show();
          }
          else {
            header.hide();
            associatedColumns.hide();            
          }
        }
      }],
      compile: function(element, attr) {
        return {
          pre:  function(scope, element, attr){
            scope.tableElement = element.find('table'); 
            
            scope.$watchCollection(attr.columnsSelector, function (newValue) {
                if (angular.isDefined(newValue)){
                    angular.forEach(scope.columns, function(column){
                       column.isVisible = false;
                       var c = findColumn(newValue, column.id);
                       angular.merge(column, c);   
                    });                   
                }
            });
            
            var columns =  scope.tableElement.find('th');
            angular.forEach(columns, function(column, idx){
              scope.columns.push({index: idx, name: angular.element(column).text(), isVisible: true, id: column.id});
            });            
          }
        }
        
        function findColumn(columns, id){
            for(var i = 0; i < columns.length; i++){
                if (columns[i].id == id)
                    return columns[i];     
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
})();
