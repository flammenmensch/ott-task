'use strict';

angular.module('ott.services', [ ])

    .factory('roles', function () {
        return {
            GUEST: 1,
            USER:  2,
            ADMIN: 4
        };
    })

    .factory('levels', [ 'roles', function (roles) {
         return {
             USER:   roles.USER | roles.ADMIN,
             ADMIN:  roles.ADMIN,
             PUBLIC: roles.GUEST | roles.USER | roles.ADMIN
         };
    } ])

    .factory('routeAccessConfig', [ 'levels', function (levels) {
        return {
            '/': levels.PUBLIC,
            '/contact': levels.PUBLIC,
            '/dashboard': levels.ADMIN
        };
    } ])

    .factory('authService', [ '$q', '$timeout', 'routeAccessConfig', 'roles', function ($q, $timeout, routeAccessConfig, roles) {
        var users = [
            { username: 'root', password: 'root', name: 'Alexey Protasov', role: roles.ADMIN },
            { username: 'admin', password: 'admin123', name: 'Alexey Protasov', role: roles.ADMIN },
            { username: 'johndoe', password: '12345', name: 'John Doe', role: roles.USER },
            { username: 'janedoe', password: '54321', name: 'Jane Doe', role: roles.USER }
        ];

        return {
            login: function (username, password) {
                var deferred = $q.defer();

                $timeout(function () {
                    var found = users.reduce(function (previous, current) {
                        if (current.username === username && current.password === password) {
                            return current;
                        }

                        return previous;
                    }, undefined);

                    if (found) {
                        return deferred.resolve(found);
                    }

                    deferred.reject(new Error('Incorrect username and/or password'));
                }, 1000);

                return deferred.promise;
            },

            authorize: function (route, role) {
                return routeAccessConfig[route] & role;
            },

            logout: function () {
                var deferred = $q.defer();

                $timeout(function () {
                    deferred.resolve(true);
                });

                return deferred.promise;
            }
        };
    } ])

    .factory('dashboardService', [ '$q', '$timeout', function ($q, $timeout) {
        return {
            load: function () {
                var deferred = $q.defer();

                $timeout(function () {
                    var data = [ ];

                    for (var i = 0; i < 20; i++) {
                        data.push({ x: i, y: Math.round(Math.random() * 100) });
                    }

                    deferred.resolve(data);
                }, 1000);

                return deferred.promise;
            }
        };
    } ])

    .factory('contactService', [ '$timeout', function ($timeout) {
        return {
            send: function (name, email, message) {
                return $timeout(function () { }, 1000);
            }
        };
    } ]);