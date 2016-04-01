(function () {
  'use strict';

  describe('Sisos Controller Tests', function () {
    // Initialize global variables
    var SisosController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      SisosService,
      mockSiso;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _SisosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      SisosService = _SisosService_;

      // create mock Siso
      mockSiso = new SisosService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Siso Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Sisos controller.
      SisosController = $controller('SisosController as vm', {
        $scope: $scope,
        sisoResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleSisoPostData;

      beforeEach(function () {
        // Create a sample Siso object
        sampleSisoPostData = new SisosService({
          name: 'Siso Name'
        });

        $scope.vm.siso = sampleSisoPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (SisosService) {
        // Set POST response
        $httpBackend.expectPOST('api/sisos', sampleSisoPostData).respond(mockSiso);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Siso was created
        expect($state.go).toHaveBeenCalledWith('sisos.view', {
          sisoId: mockSiso._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/sisos', sampleSisoPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Siso in $scope
        $scope.vm.siso = mockSiso;
      });

      it('should update a valid Siso', inject(function (SisosService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/sisos\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('sisos.view', {
          sisoId: mockSiso._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (SisosService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/sisos\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Sisos
        $scope.vm.siso = mockSiso;
      });

      it('should delete the Siso and redirect to Sisos', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/sisos\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('sisos.list');
      });

      it('should should not delete the Siso and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
