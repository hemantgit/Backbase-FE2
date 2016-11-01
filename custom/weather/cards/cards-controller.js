function CardController($scope, $element, $attrs, getWeatherData,getConfigData) {
    $scope.completeData = {}; // Storing the chart data for all the countries.
    if ($attrs.city && $attrs.country) {
        $scope.city = $attrs.city;
        $scope.country = $attrs.country;
        //Get current UTC time
        var time = moment.utc().format('H');
        $scope.cardData = {};
        $scope.cardData.predictedWeathers = [];
        //Today reading count
        var todayReadingCountRemaining = Math.round(Math.abs(21 / 3 - time / 3));
        //Reading count per day = 24/3 = 8. For 5 days, 8*5=40
        var fiveDayReadingCount = 40;
        var totalReadingCount = todayReadingCountRemaining + fiveDayReadingCount;
        getConfigData.getConfig().then(function (configResponse) {
            getWeatherData.getForeCast($scope.city, $scope.country, totalReadingCount,configResponse.data.apiBaseURL,
                configResponse.data.apiKey).then(function (response) {
                    var weatherList = response.data.list;
                    weatherList.splice(0,todayReadingCountRemaining);
                    // Initializing the country in completeData
                    $scope.completeData[$scope.country] = {
                        labels: [], // The labels to use on x-axis
                        series: ['SeaLevel'], // The value representing y-axis
                        data: [] // The values for y-axis
                    };
                    var labels = [], data = [];
                    angular.forEach(weatherList,function (weather) {
                        //Specifying time format
                        if(moment(weather.dt_txt,"YYYY-MM-DD HH:mm:ss").format("HH")=='09')
                        {
                            var sea_level = weather.main.sea_level;
                            var date = moment(weather.dt_txt,"YYYY-MM-DD HH:mm:ss").format("Do MMM YYYY");
                            $scope.cardData.predictedWeathers.push({
                                //Fetching data from the API
                                sea_level: sea_level,
                                date: date
                            });
                            labels.push(date);
                            data.push(sea_level);
                        }
                    });
                    $scope.completeData[$scope.country]['labels'] = labels;
                    $scope.completeData[$scope.country]['data'].push(data);
            });
            getWeatherData.getCurrent($scope.city, $scope.country,configResponse.data.apiBaseURL,
                configResponse.data.apiKey).then(function (response) {

                    ///$scope.cardData.timeZone = moment(response.data.sys.sunrise,"X");
                    $scope.cardData.currentSunrise = moment(response.data.sys.sunrise,"X").format("HH:mm:ss");


                    $scope.cardData.currentSunset =  moment(response.data.sys.sunset,"X").local().format("HH:mm:ss");
            });
        });
    }
    // Function to get the y-axis value for a country
    $scope.getChartData = function(country) {
        if($scope.completeData.hasOwnProperty(country)) return $scope.completeData[country].data;
    };
    // Function to get the labels (x-axis) for a country
    $scope.getChartLabels = function(country) {
        if($scope.completeData.hasOwnProperty(country)) return $scope.completeData[country].labels;
    };
    // Function to get the value representing y-axis for a country
    $scope.getChartSeries = function(country) {
        if($scope.completeData.hasOwnProperty(country)) return $scope.completeData[country].series;
    };
}
