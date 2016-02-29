(function(){
  'use strict';

  angular.module('adn.tables',[])
  .directive('columnsSelector', ColumnsSelector)
  .directive('btnColumnsSelector', BtnColumnsSelector);

  function ColumnsSelector() {
    return {
      restrict: 'A',
      controller: function() {
        var self = this;
        self.columns = [];

        self.toggle = function(column) {
          column.isVisible = !column.isVisible;
          var columnElement = angular.element('th[data-index='+ column.index +']');
          var tableColumn = columnElement.closest('table').find('td[headers='+ column.id +']');
          tableColumn.hide();
          columnElement.hide();
        }
      },
      compile: function(element, attr) {
        return {
          pre:  function(scope, element, attr, ctlr){
            var table = element.find('table');

            var columns = table.find('th');
            angular.forEach(columns, function(column, idx){
              ctlr.columns.push({index: idx, name: angular.element(column).text(), isVisible: true, id: column.id});
              angular.element(column).attr('data-index', idx);
            });
            //scope.$apply();
          }
        }
      }
    }
  }

  function BtnColumnsSelector() {
    return {
      restrict: 'A',
      require: '^columnsSelector',
      link: function(scope, element, attr, columnCtrl){
        angular.forEach(columnCtrl.columns, function(column){

          var newToggle = angular.element(addElement(column));
          newToggle.on('click', function(){ columnCtrl.toggle(column)});
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
