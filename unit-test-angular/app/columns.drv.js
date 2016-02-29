(function(){
  'use strict';

  angular.module('trs')
  .directive('columnsSelector', ColumnsSelector)
  .directive('btnColumnsSelector', BtnColumnsSelector);

  function ColumnsSelector() {
    return {
      restrict: 'A',
      controller: function() {
        var self = this;
        self.columns = [];

        self.toggle = function(column) {

        }
      },
      compile: function(element, attr) {
        return {
          pre:  function(scope, element, attr, ctlr){
            var table = element.find('table');

            var columns = table.find('th');
            angular.forEach(columns, function(column, idx){

              ctlr.columns.push({index: idx, name: angular.element(column).text(), isVisible: true});
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
          console.log(column);
          var newToggle = angular.element(addElement(column));
          newToggle.on('click', function(){ alert('oi')});
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
