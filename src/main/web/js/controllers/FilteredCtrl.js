angular.module('myApp')
    .controller('FilteredCtrl', ['$scope', '$log', '$filter','dataService', function ($scope, $log, $filter, dataService) {
        $scope.options = {};
        $scope.clickFilters={};

        $scope.chartData = [];
        $scope.chartDataBRMO = [];

        $scope.clickChart = function (select,data,sliceIndex) {
            if (select) {
                $scope.clickFilters[data.key]={"sign":"minus","value":data.value,"sliceIndex":sliceIndex};
            } else {
                if ($scope.clickFilters.hasOwnProperty(data.key)) {
                    delete $scope.clickFilters[data.key];
                }
            }
            $scope.loadBRMOData();
        };

        $scope.removeFilter = function(key) {
            if ($scope.clickFilters.hasOwnProperty(key)) {
                var slice = $scope.clickFilters[key];
                delete $scope.clickFilters[key];
            }
        };

        $scope.negateFilter = function(key) {
            if ($scope.clickFilters.hasOwnProperty(key)) {
                if ($scope.clickFilters[key].sign === "minus") {
                    $scope.clickFilters[key].sign = "plus";
                } else {
                    $scope.clickFilters[key].sign = "minus";
                }
            }
        };

        $scope.loadBRMOData = function() {
            loadBRMOData();
        };

        function loadChartData() {
            dataService.loadNumRecordsByYear(function (data) {
                angular.forEach(data, function(item) {
                    item.pullOut = false;
                });
                $scope.chartData = data;
            });
        }

        function loadBRMOData() {
            var filter = [];
            angular.forEach($scope.clickFilters, function(value,key) {
                filter.push(key)
            });
            dataService.weeklyPatientsBRMO({"years":filter},function(data) {
                $scope.chartDataBRMO = $filter('orderBy')(data, "thedate");
            });
        }

        loadChartData();
        loadBRMOData();
    }]);

