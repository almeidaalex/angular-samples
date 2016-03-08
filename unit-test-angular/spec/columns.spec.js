'use strict';

describe('A diretiva de seleção de coluna', function(){
  var $compile, scope;

  beforeEach(module('adn.tables'));

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    scope = _$rootScope_.$new();
  }));

  it('deverá ler todos os headers da tabela e criar seus respectivos objetos', function(){
     var element = $compile('<div columns-selector=""><table><thead><tr><th id="c1">Column1</th><th id="c2">Column2</th></tr></thead></table></div>')(scope);
     scope.$digest();
     
     var sc = element.scope();
     
     expect(sc.columns.length).toBe(2);
     
     var column = sc.columns[0];
     
     expect(column.id).not.toEqual("");
     expect(column.name).toBeDefined();
     expect(column.name).not.toEqual("");
     expect(column.index).toBeDefined();
  });
  
  it('deverá ocultar uma coluna quando ela for setada para isVisible = false', function(){
      
     var element = $compile('<div columns-selector=""><table><thead><tr><th id="c1">Column1</th><th id="c2">Column2</th></tr></thead></table></div>')(scope);
     scope.$digest();
     var sc = element.scope();     
     sc.toggle(sc.columns[0]);     
     scope.$digest();
     
     expect(element.html()).not.toContains('Column1');
  })
  
  afterEach(function(){
      scope.$destroy();
  })
})
