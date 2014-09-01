'use strict';

angular.module('ott', [ 'ott.controllers', 'ott.services', 'ngRoute' ])

    .config([ '$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html'
            })
            .when('/contact', {
                controller: 'ContactCtrl',
                templateUrl: 'views/contact.html'
            })
            .when('/dashboard', {
                controller: 'DashboardCtrl',
                templateUrl: 'views/dashboard.html'
            })
            .otherwise({ redirectTo: '/' });
    } ])

    .run([ '$rootScope', '$location', 'authService', 'roles', function ($rootScope, $location, authService, roles) {
        $rootScope.$on('$routeChangeStart', function (event, next) {
            if (!authService.authorize(next.originalPath, $rootScope.user.role)) {
                $location.path('/');
            }
        });

        $rootScope.user = {
            username: 'Anonymous',
            role: roles.GUEST
        };
    } ]);