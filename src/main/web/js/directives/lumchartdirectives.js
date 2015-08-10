angular.module('lum.directives.amcharts', [])
    .directive('lumAmPieChart', [
        function () {

            function link(scope, element, attrs) {
                var id = attrs.chartId;
                element.attr('id', id);

                var chartData = scope.chartData;

                if (chartData) {

                    var chart = AmCharts.makeChart(id, {
                        "type": "pie",
                        "valueField": "value",
                        "titleField": "key",
                        "dataProvider": chartData,
                        "balloonText": "[[title]]: <b>[[value]]</b>",
                        "responsive": {
                            "enabled": true
                        },
                        "pullOutRadius": 3,
                        "pulledField": "pullOut"
                    });

                    if (scope.clickCallback) {
                        chart.addListener("pullOutSlice", function(event) {
                            scope.$apply(function () {
                                scope.clickCallback({"select":true, "data": event.dataItem.dataContext, "sliceIndex":event.dataItem.index});
                            });
                        });
                        chart.addListener("pullInSlice", function(event) {
                            scope.$apply(function () {
                                scope.clickCallback({"select":false, "data": event.dataItem.dataContext, "sliceIndex":event.dataItem.index});
                            });
                        });
                    }

                    scope.$watch('chartData', function(data) {
                        chart.dataProvider=data;
                        chart.validateData();
                    });

                }
            }

            return {
                restrict: 'E',
                scope: {
                    chartId: '@',
                    chartData: '=',
                    clickCallback: '&',
                    pullIn: '&'
                },
                replace: true,
                link: link,
                template: '<div style="width: 100%; height: 100%;"></div>'
            }
        }
    ])
    .directive('lumAmChart', [
        function () {

            function link(scope, element, attrs) {
                var id = attrs.chartId;
                element.attr('id', id);

                var chartData = scope.chartData;

                if (chartData) {

                    var chart = AmCharts.makeChart(id, {
                        "type": "serial",
                        "categoryField": "key",
                        "graphs": [
                            {
                                "valueField": "value",
                                "type": "column",
                                "fillAlphas": 0.8,
                                "balloonText": "[[category]]: <b>[[value]]</b>"
                            },
                            {
                                "valueField": "value",
                                "type": "line",
                                "bullet": "square",
                                "lineColor": "#8d1cc6"
                            }
                        ],
                        "categoryAxis": {
                            "gridPosition": "start",
                            "labelRotation": 45
                        },
                        "dataProvider": chartData,
                        "export": {
                            "enabled": true,
                            "libs": {
                                "path": "assets/amcharts/plugins/export/libs/"
                            }
                        },
                        "responsive": {
                            "enabled": true
                        }
                    });

                    if (scope.clickCallback) {
                        chart.addListener("clickGraphItem", function(event) {
                            scope.$apply(function () {
                                scope.clickCallback({"data": event.item.dataContext});
                            });
                        });
                    }

                    scope.$watch('chartData', function(data) {
                        chart.dataProvider=data;
                        chart.validateData();
                    });

                }
            }

            return {
                restrict: 'E',
                scope: {
                    chartId: '@',
                    chartData: '=',
                    clickCallback: '&'
                },
                replace: true,
                link: link,
                template: '<div style="width: 100%; height: 100%;"></div>'
            }
        }
    ])
    .directive('lumAmTimeChart', [
        function () {

            function link(scope, element, attrs) {
                var id = attrs.chartId;
                element.attr('id', id);

                var chartData = scope.chartData;

                if (chartData) {

                    var chart = AmCharts.makeChart(id, {
                        "type": "serial",
                        "categoryField": "thedate",
                        "graphs": [
                            {
                                "valueField": "RSV",
                                "title": "RSV"
                            },
                            {
                                "valueField": "esbl",
                                "title": "esbl"
                            },
                            {
                                "valueField": "brmo",
                                "title": "brmo"
                            },
                            {
                                "valueField": "influenza",
                                "title": "influenza"
                            },
                            {
                                "valueField": "norrovirus",
                                "title": "norrovirus"
                            },
                            {
                                "valueField": "C.difficile",
                                "title": "C.difficile"
                            }
                        ],
                        "categoryAxis": {
                            "gridPosition": "start",
                            "labelRotation": 45,
                            "parseDates": true
                        },
                        "chartCursor": {
                            "categoryBalloonDateFormat": "JJ:NN, DD MMMM",
                            "cursorPosition": "mouse"
                        },
                        "dataProvider": chartData,
                        "export": {
                            "enabled": true,
                            "libs": {
                                "path": "assets/amcharts/plugins/export/libs/"
                            }
                        },
                        "responsive": {
                            "enabled": true
                        },
                        "dataDateFormat": "YYYYMMDD",
                        "legend": {
                            "useGraphSettings": false,
                            "position": "right"
                        }
                    });

                    if (scope.clickCallback) {
                        chart.addListener("clickGraphItem", function(event) {
                            scope.$apply(function () {
                                scope.clickCallback({"data": event.item.dataContext});
                            });
                        });
                    }

                    scope.$watch('chartData', function(data) {
                        chart.dataProvider=data;
                        chart.validateData();
                    });

                }
            }

            return {
                restrict: 'E',
                scope: {
                    chartId: '@',
                    chartData: '=',
                    clickCallback: '&'
                },
                replace: true,
                link: link,
                template: '<div style="width: 100%; height: 100%;"></div>'
            }
        }
    ])
    .directive('lumAmXyChart', [
        function () {

            function link(scope, element, attrs) {
                var id = attrs.chartId;
                element.attr('id', id);

                var chartData = scope.chartData;

                if (chartData) {
                    var chart = new AmCharts.AmXYChart();
                    chart.dataProvider = chartData;
                    chart.categoryField = "country";

                    var xAxis = new AmCharts.ValueAxis();
                    xAxis.title = "X Axis";
                    xAxis.position = "bottom";
                    xAxis.autoGridCount = true;
                    chart.addValueAxis(xAxis);

                    var yAxis = new AmCharts.ValueAxis();
                    yAxis.title = "Y Axis";
                    yAxis.position = "left";
                    yAxis.autoGridCount = true;
                    yAxis.minMaxMultiplier = 1.2;
                    chart.addValueAxis(yAxis);

                    var graph = new AmCharts.AmGraph();
                    graph.errorField = "errorX"; // valueField responsible for the size of a bullet
                    graph.xField = "x";
                    graph.yField = "y";
                    graph.lineAlpha = 0;
                    graph.bulletAxis = xAxis;
                    graph.bullet = "xError";
                    graph.balloonText = "x:<b>[[x]]</b> y:<b>[[y]]</b><br>x error:<b>[[errorX]]</b><br>y error:<b>[[errorY]]</b>";
                    chart.addGraph(graph);

                    graph = new AmCharts.AmGraph();
                    graph.errorField = "errorY"; // valueField responsible for the size of a bullet
                    graph.xField = "x";
                    graph.yField = "y";
                    graph.lineAlpha = 0;
                    graph.bulletAxis = yAxis;
                    graph.bullet = "yError";
                    graph.balloonText = "x:<b>[[x]]</b> y:<b>[[y]]</b><br>x error:<b>[[errorX]]</b><br>y error:<b>[[errorY]]</b>";
                    chart.addGraph(graph);

                    chart.write(id);
                }
            }

            return {
                restrict: 'E',
                scope: {
                    chartId: '@',
                    chartData: '='
                },
                replace: true,
                link: link,
                templateUrl: 'assets/template/charts/xychart.html'
            }
        }
    ])
    .directive('lumAmGaugeChart', [
        function () {

            function link(scope, element, attrs) {
                var id = attrs.chartId;
                element.attr('id', id);

                var chartData = scope.chartData;

                if (chartData) {
                    var chart = AmCharts.makeChart(id,{
                        "type": "gauge",
                        "arrows": chartData,
                        "titles": [
                            {
                                "text": "Speedometer",
                                "size": 15
                            }
                        ],
                        "axes": [
                            {
                                "bottomText": "0 km/h",
                                "endValue": 220,
                                "valueInterval": 10,
                                "bands": [
                                    {
                                        "color": "#00CC00",
                                        "endValue": 90,
                                        "startValue": 0
                                    },
                                    {
                                        "color": "#ffac29",
                                        "endValue": 130,
                                        "startValue": 90
                                    },
                                    {
                                        "color": "#ea3838",
                                        "endValue": 220,
                                        "startValue": 130,
                                        "innerRadius": "95%"
                                    }
                                ]
                            }
                        ],
                        "responsive": {
                            "enabled": true
                        }
                    });

                    //chart.write(id);
                }
            }

            return {
                restrict: 'E',
                scope: {
                    chartId: '@',
                    chartData: '='
                },
                replace: true,
                link: link,
                templateUrl: 'assets/template/charts/xychart.html'
            }
        }
    ]);

