'use strict';

describe('A diretiva de seleção de coluna', function(){
  var $compile, scope, tableTemplate, columnStateService;

  beforeEach(module('adn.tables')); 
  
  beforeEach(function () {
        angular.module('ngCookies',[]);
      
        module(function ($provide) {
            $provide.service('columnStateService', function () {
                this.save = jasmine.createSpy('key');
                this.load = jasmine.createSpy('load');
                this.setup = jasmine.createSpy('setup');
            });
        });
  });
  
  
  beforeEach(inject(function(_$compile_, _$rootScope_, _columnStateService_){
    $compile = _$compile_;
    scope = _$rootScope_.$new();
    columnStateService = _columnStateService_;
    tableTemplate = '<div columns-selector="" data-selector-key="test-key">' +
                        '<table>' +
                            '<thead><tr>'+
                                '<th id="c1">Column1</th>' +
                                '<th id="c2">Column2</th>' +
                                '<th id="c3">Column2</th>' +
                                '<th id="c4">Column2</th>' +
                                '<th id="c5">Column2</th>' +
                            '</tr></thead>' + 
                         '</table>' +
                     '</div>';
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
      
     var element = $compile(tableTemplate)(scope);
     scope.$digest();
     var sc = element.scope();     
     sc.toggle({}, sc.columns[0]);     
     scope.$digest();
     
     expect(angular.element(element.html()).find('th#c1').css('display')).toEqual('none');
  })
  
  it('deverá exibir uma coluna quando ela for setada para isVisible = true', function(){
      
     var element = $compile(tableTemplate)(scope);
     scope.$digest();
     var sc = element.scope();
     sc.columns[0].isVisible = false;     
     sc.toggle({}, sc.columns[0]);     
     scope.$digest();
     
     expect(angular.element(element.html()).find('th#c1').css('display')).toEqual('table-cell');
  })
  
   it('quando um valor de coluna padrão for definido, as demais colunas devem ficarem ocultas', function(){
      scope.defaultColumns = [
            {id:"c1", isVisible: true},
            {id:"c3", isVisible: false},
        ];
        
     scope.$digest();
     var newTemplate = tableTemplate.replace('columns-selector=""','columns-selector="defaultColumns"');
     var element = $compile(newTemplate)(scope);
     scope.$digest();
     var sc = element.scope();
     
     expect(sc.columns.length).toEqual(5);
     
     expect(angular.element(element.html()).find('th#c1').css('display')).toEqual('table-cell');
     expect(angular.element(element.html()).find('th#c3').css('display')).toEqual('none');
     expect(angular.element(element.html()).find('th#c2').css('display')).toEqual('none');
     expect(angular.element(element.html()).find('th#c4').css('display')).toEqual('none');
     expect(angular.element(element.html()).find('th#c5').css('display')).toEqual('none');
  })
  
   it('deverá armazenar a última configuração de colunas do usuário', function(){
    columnStateService.load = function () {
        return [
                {id: 'c1', isVisible: true},
                {id: 'c2', isVisible: false},
                {id: 'c3', isVisible: true}, 
                {id: 'c4', isVisible: false},                        
                {id: 'c5', isVisible: true}
            ];
    };
    columnStateService.save = jasmine.createSpy('saved');
        
     var element = $compile(tableTemplate)(scope);
     scope.$digest();
     var sc = element.scope();
     
     expect(angular.element(element.html()).find('th#c1').css('display')).toEqual('table-cell');     
     expect(angular.element(element.html()).find('th#c2').css('display')).toEqual('none');
     expect(angular.element(element.html()).find('th#c3').css('display')).toEqual('table-cell');
     expect(angular.element(element.html()).find('th#c4').css('display')).toEqual('none');
     expect(angular.element(element.html()).find('th#c5').css('display')).toEqual('table-cell');
  });
  
  it('deverá salvar o estado em cada alteração de visibiliade da coluna', function(){
     columnStateService.save = jasmine.createSpy('saved');
     var element = $compile(tableTemplate)(scope);
     scope.$digest();
     var sc = element.scope();
     
     sc.toggle({}, sc.columns[0]);
     
     expect(columnStateService.save).toHaveBeenCalled();
  });
  
  afterEach(function(){
      scope.$destroy();
  })
})
