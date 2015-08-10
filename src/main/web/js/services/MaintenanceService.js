serviceModule.factory('maintenanceService', ['$http', '$filter', '$log', '$rootScope', function ($http, $filter, $log, $rootScope) {
    function MaintenanceService($http, $filter, $log, $rootScope) {

        this.loadAnatomicLocations = function (callback) {
            $http.get('/procreator/anatomiclocations').success(function (data) {
                callback($filter('orderBy')(data, 'name'));
            }).error(httpError);
        };

        this.loadMicroOrganismData = function (filterAnatomicLocation, callback) {
            var filterObj = {};
            if (filterAnatomicLocation && filterAnatomicLocation.name) {
                filterObj.filterAnatomicLocation = filterAnatomicLocation.name;
            }
            $http.post('/procreator/data',filterObj).success(function (data) {

                var items = $filter('orderBy')(data, '-amount');

                //var cum = 0;
                var cumPercent = 0;
                angular.forEach(items, function(item) {
                    //cum += item.amount;
                    cumPercent += item.amountPercentage;

                    //item.cum = cum;
                    item.cumPercent = cumPercent;
                });

                callback(items);
            }).error(httpError);
        };

        this.loadKibanaUrl = function(callback) {
            $http.get('/kibana/config').success(function (data) {
                console.log("FOUND KIABANA: " + data.serverUrl);
                callback(data.serverUrl);
            }).error(httpError);
        };

        var httpError = function (data) {
            var message;
            if (data.errors && data.errors.length > 0) {
                message = data.errors[0]
            } else {
                message = "Error without a message was thrown";
            }
            $log.error(message);
            $rootScope.$broadcast('msg:notification', 'danger', message);
        }
    }

    return new MaintenanceService($http, $filter, $log, $rootScope);
}]);
