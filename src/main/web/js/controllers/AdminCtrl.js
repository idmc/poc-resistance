function AdminCtrl($scope,$http,$rootScope) {
    $scope.numberOfEvents = 0;
    $scope.importRunning = false;

    $scope.reloadEvents = function () {
        $scope.importRunning = true;
        $http.post('/events/import').success(function (data) {
            createNotification(data);
            $scope.importRunning = false;
        });
    };

    $scope.obfuscateEvents = function () {
        $scope.obfuscateRunning = true;
        $http.post('/events/obfuscate').success(function (data) {
            createNotification(data);
            $scope.obfuscateRunning = false;
        });
    };

    $scope.countEvents = function () {
        $http.get('/events/count').success(function (data) {
            $scope.numberOfEvents = data;
        });
    };

    function createNotification(message) {
        $rootScope.$broadcast('msg:notification', 'success', message);
    }

    $scope.countEvents();

}
AdminCtrl.$inject = ['$scope','$http', '$rootScope'];

