'use strict';

describe('ott.services', function () {
    beforeEach(module('ott.services'));

    describe('roles service', function () {
        it('should create roles object', inject([ 'roles', function (roles) {
            expect(roles).toBeDefined();
        } ]));
    });

    describe('levels service', function () {
        it('should create levels object', inject([ 'levels', 'roles', function (levels, roles) {
            expect(levels).toBeDefined();
        } ]));
    });

    describe('routeAccessConfig service', function () {
        it('should create routeAccessConfig object', inject([ 'routeAccessConfig', function (routeAccessConfig) {
            expect(routeAccessConfig).toBeDefined();
        } ]));
    });

    describe('authService', function () {
        var authService, roles, $timeout;

        beforeEach(inject( function (_authService_, _roles_, _$timeout_) {
            roles = _roles_;
            authService = _authService_;
            $timeout = _$timeout_;
        }));

        it('should login', function () {
            authService.login('admin', 'admin123').then(function (user) {
                expect(user).toBeDefined();
            });

            $timeout.flush();
        });

        it('should not login', function () {
            authService.login('hacker', 'r00t').catch(function (error) {
                expect(error).toBeDefined();
            });

            $timeout.flush();
        });

        it('should logout', function () {
            authService.logout().then(function () {
                expect(1).toBe(1);
            });

            $timeout.flush();
        });

        it('should authorize route', function () {
            var allow = authService.authorize('/dashboard', roles.ADMIN);
            var doNotAllow = authService.authorize('/dashboard', roles.GUEST);

            expect(allow).toBeGreaterThan(0);
            expect(doNotAllow).toBe(0);
        });
    });

    describe('dashboardService', function () {
        it('should load dashboard data', inject(function ($timeout, dashboardService) {
            dashboardService.load().then(function (data) {
                expect(data).toBeDefined();
                expect(data.length).toEqual(20);
            });

            $timeout.flush();
        }));
    });

    describe('contactService', function () {
        it('should send feedback', inject(function ($timeout, contactService) {
            contactService.send('test', 'test', 'Hello').then(function () {
                expect(true).toBe(true);
            });

            $timeout.flush();
        }));
    });
});