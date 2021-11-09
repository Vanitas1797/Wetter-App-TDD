const { default: axios } = require('axios');
// const db = new sqlite.Database(dbConfig.storage);

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

const currentAndForecastWeatherData = require('./backend/objects/raw/currentAndForecastWeatherData.json');
const currentAndForecastWeatherDataM = require('./backend/objects/mapped/currentAndForecastWeatherData.json');
const { generate } = require('./backend/generate/generate');

async function test2() {
  // const response = await axios.get('dsa');
  // response.data[currentAndForecastWeatherDataM.current.dt]
  generate.createFile('currentAndForecastWeatherData.json');
  let log = currentAndForecastWeatherDataM.daily;
  console.log(log);
}

test2();
