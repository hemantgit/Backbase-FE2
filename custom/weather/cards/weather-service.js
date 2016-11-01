//Getting weather forecast from the API call
weather.service('getWeatherData',['$http',function ($http) {
    this.getForeCast = function (city,country,count,baseURL,apiKey) {
        baseURL = baseURL+"forecast";
        return $http.get(baseURL,{params:{q:city+","+country,appid:apiKey,units:'metric',type:'accurate',cnt:count}});
    };
    //API Call to fetch weather details
    this.getCurrent = function (city,country,baseURL,apiKey) {
        baseURL = baseURL+"weather";
        return $http.get(baseURL,{params:{q:city+","+country,appid:apiKey,units:'metric',type:'accurate'}});
    };
}]);
//Configuration settings
weather.service('getConfigData',['$http',function ($http) {
    this.getConfig = function () {
        return $http.get("custom/weather/cards/config.json")
    }
}]);
