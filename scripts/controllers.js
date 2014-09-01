'use strict';

angular.module('ott.controllers', [ 'ui.bootstrap', 'ott.services' ])
    .controller('NavCtrl', [ '$scope', '$modal', 'authService', 'roles', function ($scope, $modal, authService, roles) {

        $scope.loggedIn = false;

        $scope.isAdmin = function () {
            return $scope.user.role & roles.ADMIN;
        };

        $scope.logout = function () {
            authService.logout().then(function () {
                $scope.user.username = 'guest';
                $scope.user.name = 'Anonymous';
                $scope.user.role = roles.GUEST;

                $scope.loggedIn = false;

                $scope.$emit('user:logout');
            });
        };

        $scope.openLoginWindow = function () {
            var instance = $modal.open({
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            });

            instance.result.then(function (user) {
                angular.extend($scope.user, user);
                $scope.loggedIn = true;
            });
        };
    } ])

    .controller('LoginCtrl', [ '$scope', '$modalInstance', 'authService', function ($scope, $modalInstance, authService) {
        // Need to nest properties to avoid issues with $scope inheritance
        $scope.credentials = {
            username: '',
            password: ''
        };

        $scope.loading = false;

        $scope.login = function () {
            $scope.loading = true;

            authService
                .login($scope.credentials.username, $scope.credentials.password)
                .then(
                    function (user) {
                        $modalInstance.close(user);
                    },
                    function (error) {
                        console.error(error);
                    }
                ).finally(function () {
                    $scope.loading = false;
                });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    } ])

    .controller('DashboardCtrl', [ '$scope', 'dashboardService', function ($scope, dashboardService) {
        $scope.data = [ ];

        $scope.loading = false;

        $scope.refresh = function () {
            $scope.loading = true;

            dashboardService
                .load()
                .then(function (data) {
                    $scope.data = data;
                }).finally(function () {
                    $scope.loading = false;
                });
        };

        $scope.refresh();
    } ])

    .controller('ContactCtrl', [ '$scope', 'contactService', function ($scope, contactService) {
        $scope.name = '';
        $scope.email = '';
        $scope.message = '';

        $scope.infoBoxVisible = false;

        $scope.loading = false;

        $scope.send = function () {
            $scope.loading = true;

            contactService
                .send($scope.name, $scope.email, $scope.message)
                .then(function () {
                    $scope.reset();
                    $scope.showInfoBox();
                }).finally(function () {
                    $scope.loading = false;
                });
        };

        $scope.reset = function () {
            $scope.name = '';
            $scope.email = '';
            $scope.message = '';

            $scope.contactForm.$setPristine();
        };

        $scope.hideInfoBox = function () {
            $scope.infoBoxVisible = false;
        };

        $scope.showInfoBox = function () {
            $scope.infoBoxVisible = true;
        };
    } ]);