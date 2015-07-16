angular.module('Liftme.controllers', [])

.controller('SignInCtrl', [
        '$scope', '$rootScope', '$firebaseAuth', '$window',
        function($scope, $rootScope, $firebaseAuth, $window) {
            // check session
            $rootScope.checkSession();

            $scope.user = {
                email: "",
                password: ""
            };
            $scope.validateUser = function() {
                $rootScope.show('Please wait.. Authenticating');
                var email = this.user.email;
                var password = this.user.password;
                if (!email || !password) {
                    $rootScope.notify("Please enter valid credentials");
                    return false;
                }

                $rootScope.auth.$login('password', {
                    email: email,
                    password: password
                }).then(function(user) {
                    $rootScope.hide();
                    $rootScope.userEmail = user.email;
                    $window.location.href = ('#/user-logged');
                }, function(error) {
                    $rootScope.hide();
                    if (error.code == 'INVALID_EMAIL') {
                        $rootScope.notify('Invalid Email Address');
                    } else if (error.code == 'INVALID_PASSWORD') {
                        $rootScope.notify('Invalid Password');
                    } else if (error.code == 'INVALID_USER') {
                        $rootScope.notify('Invalid User');
                    } else {
                        $rootScope.notify('Oops something went wrong. Please try again later');
                    }
                });
            }
        }
    ])

.controller('SignUpCtrl', [
    '$scope', '$rootScope', '$firebaseAuth', '$window',
    function($scope, $rootScope, $firebaseAuth, $window) {

        $scope.user = {
            email: "",
            password: ""
        };
        $scope.createUser = function() {
            var email = this.user.email;
            var password = this.user.password;
			var fname = this.user.fname;
			var lname = this.user.lname;
            if (!email || !password) {
                $rootScope.notify("Please enter valid credentials");
                return false;
            }
            $rootScope.show('Please wait.. Registering');

            $rootScope.auth.$createUser(email, password, fname, lname, function(error, user) {
                if (!error) {
                    $rootScope.hide();
                    $rootScope.userEmail = user.email;
                    $window.location.href = ('#/user/logged');
                } else {
                    $rootScope.hide();
                    if (error.code == 'INVALID_EMAIL') {
                        $rootScope.notify('Invalid Email Address');
                    } else if (error.code == 'EMAIL_TAKEN') {
                        $rootScope.notify('Email Address already taken');
                    } else {
                        $rootScope.notify('Oops something went wrong. Please try again later');
                    }
                }
            });
        }
    }
])

.controller('newCtrl', function($rootScope, $scope, $window, $firebase) {
    $scope.data = {
        item: ""
    };

    $scope.close = function() {
        $scope.modal.hide();
    };

    $scope.createNew = function() {
        var item = this.data.item;
        if (!item) return;
        $scope.modal.hide();
        $rootScope.show();

        $rootScope.show("Please wait... Creating new");

        var form = {
            item: item,
            isCompleted: false,
            created: Date.now(),
            updated: Date.now()
        };

        var userRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
        $firebase(userRef).$add(form);
        $rootScope.hide();

    };
})

.controller('completedCtrl', function($rootScope, $scope, $window, $firebase) {
        $rootScope.show("Please wait... Processing");
    })

.controller('loggedIn',['$rootScope', '$scope', '$window', '$firebase',
        function($rootScope, $scope, $window, $firebase){

            $rootScope.show(" Welcome ");

            $scope.onRefresh = function(){

            }
}]);




function escapeEmailAddress(email) {
    if (!email) {
        return false
    }
    // Replace '.' (not allowed in a Firebase key) with ','
    email = email.toLowerCase();
    email = email.replace(/\./g, ',');
    return email.trim();
}