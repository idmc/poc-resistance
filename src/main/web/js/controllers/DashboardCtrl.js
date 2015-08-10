angular.module('myApp')
    .controller('DashboardCtrl', ['$scope', '$log', 'dataService', function ($scope, $log, dataService) {
        $scope.options = {};

        $scope.chartData = [];

        $scope.chartDataXY = [{
            "x": 10,
            "y": 14,
            "errorX": 3,
            "errorY": 4
        }, {
            "x": 5,
            "y": 3,
            "errorX": 1.52,
            "errorY": 6.8
        }, {
            "x": -10,
            "y": 3,
            "errorX": 0.8,
            "errorY": 3.5
        }, {
            "x": -6,
            "y": 5,
            "errorX": 1.2,
            "errorY": 4.2
        }, {
            "x": 11,
            "y": -4,
            "errorX": 2.4,
            "errorY": 3.9
        }, {
            "x": 13,
            "y": 1,
            "errorX": 1.5,
            "errorY": 3.3
        }, {
            "x": 1,
            "y": 6,
            "errorX": 2,
            "errorY": 3.3
        }];

        $scope.chartDataGauge = [
            {
                "value": 130
            }
        ];

        $scope.clickChart = function (data) {
            console.log(data);
        };

        function loadChartData() {
            console.log("Dashboard");

            dataService.loadNumRecordsByYear(function (data) {
                console.log(data);
                $scope.chartData = data;
            });
        }

        loadChartData();
    }]);

