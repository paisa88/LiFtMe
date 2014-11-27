// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',
'starter.controllers',
'firebase'])

.run(function($ionicPlatform, $rootScope, $firebaseAuth, $firebase, $window, $ionicLoading) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        $rootScope.userEmail = null;
        $rootScope.baseUrl = 'https://blinding-torch-1105.firebaseapp.com/';
        var authRef = new Firebase($rootScope.baseUrl);
        $rootScope.auth = $firebaseAuth(authRef);

        $rootScope.show = function(text) {
            $rootScope.loading = $ionicLoading.show({
                content: text ? text : 'Loading..',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        };

        $rootScope.hide = function() {
            $ionicLoading.hide();
        };

        $rootScope.notify = function(text) {
            $rootScope.show(text);
            $window.setTimeout(function() {
                $rootScope.hide();
            }, 1999);
        };

        $rootScope.logout = function() {
            $rootScope.auth.$logout();
            $rootScope.checkSession();
        };

        $rootScope.checkSession = function() {
            var auth = new FirebaseSimpleLogin(authRef, function(error, user) {
                if (error) {
                    // no action yet.. redirect to default route
                    $rootScope.userEmail = null;
                    $window.location.href = '#/auth/signin';
                } else if (user) {
                    // user authenticated with Firebase
                    $rootScope.userEmail = user.email;
                    $window.location.href = ('#/user/logged');
                } else {
                    // user is logged out
                    $rootScope.userEmail = null;
                    $window.location.href = '#/auth/signin';
                }
            });
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('auth', {
            url: "/auth",
            abstract: true,
            templateUrl: "templates/auth.html"
        })
        .state('auth.signin', {
            url: '/signin',
            views: {
                'auth-signin': {
                    templateUrl: 'templates/auth-signin.html',
                    controller: 'SignInCtrl'
                }
            }
        })
        .state('auth.signup', {
            url: '/signup',
            views: {
                'auth-signup': {
                    templateUrl: 'templates/auth-signup.html',
                    controller: 'SignUpCtrl'
                }
            }
        })
        .state('usernav', {
            url: "/usernav",
            abstract: true,
            templateUrl: "templates/usernav.html"
        })
        .state('user.completed', {
            url: '/user-completed',
            views: {
                'user-completed': {
                    templateUrl: 'templates/user-completed.html',
                    controller: 'completedCtrl'
                }
            }
        })
    $urlRouterProvider.otherwise('/auth/signin');
});


