angular.module('myApp')
    .controller('AppCtrl', ['$scope', '$timeout', '$mdSidenav', '$mdUtil', '$log', function ($scope, $timeout, $mdSidenav, $mdUtil, $log) {

        //$scope.toggleRight = buildToggler('right');
        $scope.showFilter = true;
        $scope.showCreateFilter = false;

        $scope.numberColsCharts = 3;

        $scope.toggleRight = function() {
            $scope.showCreateFilter = !$scope.showCreateFilter;
            if ($scope.showCreateFilter) {
                $scope.numberColsCharts = 1;
            } else {
                $scope.numberColsCharts = 3;
            }
        };


        $scope.chosenFilters = [
            {
                "key":"the key",
                "value":"the value"
            },
            {
                "key":"another key",
                "value":"another value"

            }
        ];


        var chartDataPie = [{
            country: "Czech Republic",
            litres: 301.90
        }, {
            country: "Ireland",
            litres: 201.10
        }, {
            country: "Germany",
            litres: 165.80
        }, {
            country: "Australia",
            litres: 139.90
        }, {
            country: "Austria",
            litres: 128.30
        }, {
            country: "UK",
            litres: 99.00
        }, {
            country: "Belgium",
            litres: 60.00
        }];

        var chart;
        var arrow;
        var axis;

        function createGaugeChart() {
            chart = new AmCharts.AmAngularGauge();
            chart.addTitle("Speedometer");

            // create axis
            axis = new AmCharts.GaugeAxis();
            axis.startValue = 0;
            axis.axisThickness = 1;
            axis.valueInterval = 10;
            axis.endValue = 220;
            // color bands
            var band1 = new AmCharts.GaugeBand();
            band1.startValue = 0;
            band1.endValue = 90;
            band1.color = "#00CC00";

            var band2 = new AmCharts.GaugeBand();
            band2.startValue = 90;
            band2.endValue = 130;
            band2.color = "#ffac29";

            var band3 = new AmCharts.GaugeBand();
            band3.startValue = 130;
            band3.endValue = 220;
            band3.color = "#ea3838";
            band3.innerRadius = "95%";

            axis.bands = [band1, band2, band3];

            // bottom text
            axis.bottomTextYOffset = -20;
            axis.setBottomText("0 km/h");
            chart.addAxis(axis);

            // gauge arrow
            arrow = new AmCharts.GaugeArrow();
            chart.addArrow(arrow);

            chart.write("chartdivTwo");
            randomValue();
        }

        function randomValue() {
            var value = Math.round(Math.random() * 200);
            arrow.setValue(value);
            axis.setBottomText(value + " km/h");
        }

        function createChartPie() {
            var chartPie;
            chartPie = new AmCharts.AmPieChart();
            chartPie.dataProvider = chartDataPie;
            chartPie.titleField = "country";
            chartPie.valueField = "litres";
            chartPie.outlineColor = "#FFFFFF";
            chartPie.outlineAlpha = 0.8;
            chartPie.outlineThickness = 2;

            // WRITE
            chartPie.write("chartdivThree");

        }

    }]);


