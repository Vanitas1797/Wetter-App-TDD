const api = {
  openWeatherApi: {
    url: {
      urlParams: {
        apiKey: 'cea910880ce57c3997f3b4e5e34f25fe',
        limit: 50,
        exclude: 'minutely',
        units: 'metric',
        lang: 'de',
      },
      urls: {
        geocoding: {
          directGeocoding: {
            coordinatesByZipOrPostCode(zipCode, countryCode) {
              return `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${api.openWeatherApi.url.urlParams.apiKey}`;
            },
            coordinatesByLocationName(cityName, stateCode, countryCode) {
              return `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=${api.openWeatherApi.url.urlParams.limit}&appid=${api.openWeatherApi.url.urlParams.apiKey}`;
            },
          },
          reverseGeocoding: {
            reverseGeocoding(latitude, longitude) {
              return `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=${api.openWeatherApi.url.urlParams.limit}&appid=${api.openWeatherApi.url.urlParams.apiKey}`;
            },
          },
        },
        oneCall: {
          currentAndForecastWeatherData(latitude, longitude) {
            return `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=${api.openWeatherApi.url.urlParams.exclude}&appid=${api.openWeatherApi.url.urlParams.apiKey}&units=${api.openWeatherApi.url.urlParams.units}&lang=${api.openWeatherApi.url.urlParams.lang}`;
          },
        },
      },
    },
    execution: {
      dataUpdate: {
        OneCallApi: {
          interval: {
            minutes: 10,
          },
        },
      },
      forecast: {
        days: 7,
      },
    },
  },
};

const time = {
  timezoneOffsetSeconds() {
    return {
      de: 1 * this.timezoneOffsetSecondsFactor.de,
    };
  },
  timezoneOffsetSecondsFactor: {
    de: 3600,
  },
};

module.exports = {
  backend: {
    api,
    time,
  },
  frontend: {},
};
