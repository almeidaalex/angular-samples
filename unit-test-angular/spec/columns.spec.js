describe('The column selector', function(){
  var $compile, $rootScope;

  beforeEach(module('adn.tables'));

  beforeEach(inject(function(_$compile_, _$rootScope_){
   $compile = _$compile_;
   $rootScope = _$rootScope_;
 }));

  it('should to list column names for a table', function(){
     var element = $compile('<div column-selector=""><table><thead><tr><th>Column1</th><th>Column2</th></tr></thead></table></div>');
     
  });
})
