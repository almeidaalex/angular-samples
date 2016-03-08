(function(){
  'use strict';

  angular.module('adn.tables',[])
  .directive('columnsSelector', ColumnsSelector)
  .directive('btnColumnsSelector', BtnColumnsSelector);

  function ColumnsSelector() {
    return {
      restrict: 'A',
      scope: true,  
      template: function(element, attrs){
           element.attr('ng-show', column.isVisible);
      }, 
      controller: ['$scope',function($scope) {        
        $scope.columns = [];
        $scope.tableElement;
        
        $scope.toggle = function(column) {
          column.isVisible = !column.isVisible;
          var header = $scope.tableElement.find('th[data-index='+ column.index +']');
          var associatedColumns = header.closest('table').find('td[headers='+ column.id +']');
          headers.hide();
          associatedColumns.hide();
        }
      }],
      compile: function(element, attr) {
        return {
          pre:  function(scope, element, attr){
            scope.tableElement = element.find('table'); 
            
            var columns =  scope.tableElement.find('th');
            angular.forEach(columns, function(column, idx){
              scope.columns.push({index: idx, name: angular.element(column).text(), isVisible: true, id: column.id});
              angular.element(column).attr('ng-show', column.isVisible);
              angular.element(column).addClass('ng-show');
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
      link: function(scope, element, attr){
        angular.forEach(scope.columns, function(column){

          var newToggle = angular.element(addElement(column));
          newToggle.on('click', function(){ scope.toggle(column)});
          element.append(newToggle);
        });
      }
    }

    function addElement(column) {
      return  '<li>'+
                '<a href="#">'+
                '<div class="checkbox">' +
                '<label>'+
                '<input type="checkbox" value="">'+
                column.name +
                '</label>'+
                '</div>'+
                '</a>'+
                '</li>';
    }
  }
})();
