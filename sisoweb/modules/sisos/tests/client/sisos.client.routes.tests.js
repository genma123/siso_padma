(function () {
  'use strict';

  describe('Sisos Route Tests', function () {
    // Initialize global variables
    var $scope,
      SisosService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SisosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SisosService = _SisosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('sisos');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/sisos');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SisosController,
          mockSiso;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('sisos.view');
          $templateCache.put('modules/sisos/client/views/view-siso.client.view.html', '');

          // create mock Siso
          mockSiso = new SisosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Siso Name'
          });

          //Initialize Controller
          SisosController = $controller('SisosController as vm', {
            $scope: $scope,
            sisoResolve: mockSiso
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:sisoId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.sisoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            sisoId: 1
          })).toEqual('/sisos/1');
        }));

        it('should attach an Siso to the controller scope', function () {
          expect($scope.vm.siso._id).toBe(mockSiso._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/sisos/client/views/view-siso.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SisosController,
          mockSiso;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('sisos.create');
          $templateCache.put('modules/sisos/client/views/form-siso.client.view.html', '');

          // create mock Siso
          mockSiso = new SisosService();

          //Initialize Controller
          SisosController = $controller('SisosController as vm', {
            $scope: $scope,
            sisoResolve: mockSiso
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.sisoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/sisos/create');
        }));

        it('should attach an Siso to the controller scope', function () {
          expect($scope.vm.siso._id).toBe(mockSiso._id);
          expect($scope.vm.siso._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/sisos/client/views/form-siso.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SisosController,
          mockSiso;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('sisos.edit');
          $templateCache.put('modules/sisos/client/views/form-siso.client.view.html', '');

          // create mock Siso
          mockSiso = new SisosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Siso Name'
          });

          //Initialize Controller
          SisosController = $controller('SisosController as vm', {
            $scope: $scope,
            sisoResolve: mockSiso
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:sisoId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.sisoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            sisoId: 1
          })).toEqual('/sisos/1/edit');
        }));

        it('should attach an Siso to the controller scope', function () {
          expect($scope.vm.siso._id).toBe(mockSiso._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/sisos/client/views/form-siso.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
