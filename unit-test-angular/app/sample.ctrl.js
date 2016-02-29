(function(){
    'use strict';

    angular.module('sample-app')
      .controller('SampleController', SampleController);

    function SampleController(){
      var self = this;

      self.cars = generateCars(20);

      function generateCars(numberOfCars){
        var list = [];

        for (var i = 0; i < numberOfCars; i++) {
          list.push({model: 'Model' + i, color: 'black', year: 2000 + i, power: 200, milage: 20000, airbag: true, doors: 4});
        }

        return list;
      }
    };


})();
