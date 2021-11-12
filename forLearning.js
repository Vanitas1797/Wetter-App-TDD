const { default: axios } = require('axios');
const fs = require('fs');
const { query } = require('./backend/database/query');
const objectBinds = require('./backend/generate/objectBinds');

async function test() {
  const response = await axios.get(
    'https://www.50states.com/abbreviations.htm'
  );
  // console.log(response.data);
  const regex = /\.htm>([\w\s]+)<.*?>(\w{2})<|<td>([\w\s]+)<\/td>/g;
  const data = response.data;
  let match;
  let matchArray = [];
  let matchObjectArray = [{}];
  while ((match = regex.exec(data))) {
    for (let i = 1; i < match.length; i++) {
      if (match[i]) {
        if (!matchArray.includes(match[i])) {
          matchArray.push(match[i]);
        }
      }
    }
  }
  let i = 0;
  let j = 0;
  for (let m of matchArray) {
    if (i == 2) {
      j++;
      i = 0;
      matchObjectArray.push({ stateName: null, stateCode: null });
    }
    if (m.length == 2) {
      matchObjectArray[j]['stateCode'] = m;
    } else if (m.length > 2) {
      matchObjectArray[j]['stateName'] = m;
    }
    i++;
  }
  console.log(matchObjectArray);
  for (let m of matchObjectArray) {
    let inserts = [m.stateName, m.stateCode];
    await database.run(database.queries.insertStateCodes, inserts);
  }
}

async function test2(path) {
  let dirs = fs.readdirSync('./', { withFileTypes: true });
  for (let d of dirs) {
    d.isDirectory();
  }
  console.log(dirs);
}

async function test3(params) {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?lat=1&lon=99&exclude=minutely&appid=cea910880ce57c3997f3b4e5e34f25fe&units=metric`
  );
  currentAndForecastWeatherData = response.data;
  console.log(currentAndForecastWeatherData.current);
}

function test4() {
  cronjob.lastUpdatedOpenWeatherApi = 2;
  generate.updateJsonFile('./backend/generate/objects/cronjob.json', cronjob);
}

async function test5(params) {
  let dt = currentAndForecastWeatherData.current.dt;
  let realDt = new Date(dt * 1000);
  let now = new Date().getTime();
  // console.log(currentAndForecastWeatherData.current.dt);
  // console.log(now);
  // console.log(realDt);
  let date = parseInt(new Date(dt * 1000).toLocaleTimeString().slice(0, 2));
  console.log(date);
}

let tables = objectBinds.database.tables;
let whereOperators = objectBinds.database.whereOperators;

// query.UPDATE_SET({ user: { password: 'newhahaha' } }).WHERE({
//   user: { pk_user_name: whereOperators.equal + '' },
// });

query.SELECT_FROM({
  weather_data_day: { sunset: '', sunrise: '' },
  weather_data_hour: { air_pressure: '' },
});
query.SELECT_FROM({ weather_data_day: { sunset: '', sunrise: '' } });
