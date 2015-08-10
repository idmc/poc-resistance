angular.module('myApp.services')
    .factory('dataService', ['$log','$http', function($log, $http) {
        function DataService ($log,$http) {
            this.loadChartData = function(callback) {
                $log.info("Obtain data from the service.");

                callback([{
                    "country": "USA",
                    "visits": 4252
                }, {
                    "country": "China",
                    "visits": 1882
                }, {
                    "country": "Japan",
                    "visits": 1809
                }, {
                    "country": "Germany",
                    "visits": 1322
                }, {
                    "country": "UK",
                    "visits": 1122
                }, {
                    "country": "France",
                    "visits": 1114
                }, {
                    "country": "India",
                    "visits": 984
                }, {
                    "country": "Spain",
                    "visits": 711
                }, {
                    "country": "Netherlands",
                    "visits": 665
                }, {
                    "country": "Russia",
                    "visits": 580
                }, {
                    "country": "South Korea",
                    "visits": 443
                }, {
                    "country": "Canada",
                    "visits": 441
                }, {
                    "country": "Brazil",
                    "visits": 395
                }, {
                    "country": "Italy",
                    "visits": 386
                }, {
                    "country": "Australia",
                    "visits": 384
                }, {
                    "country": "Taiwan",
                    "visits": 338
                }, {
                    "country": "Poland",
                    "visits": 328
                }]);
            };

            this.loadNumRecordsByYear = function(callback) {
                $http.get("/api/numRecordsByYear")
                    .success(function(data) {
                        callback(data.items);
                    })
                    .error(httpError);
            };

            this.weeklyPatientsBRMO = function(filter,callback) {
                $http.post("/api/numUniquePatientsByBRMO",filter)
                    .success(function(data) {
                        var items = [];
                        angular.forEach(data, function(value, key) {
                            var item = {};
                            item.thedate = key;
                            angular.forEach(value.items, function(i) {
                                item[i.key]= i.value;
                            });
                            items.push(item);
                        });

                        callback(items);
                    })
                    .error(httpError);
            }
        }

        var httpError = function (data) {
            var message;
            if (data.errors && data.errors.length > 0) {
                message = data.errors[0]
            } else {
                message = "Error without a message was thrown";
            }
            $log.error(message);
            $rootScope.$broadcast('msg:notification', 'danger', message);
        };

        return new DataService($log,$http);
    }])
;
