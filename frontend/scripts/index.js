import { deleteCookie, getCookie } from './cookie.js';
import { global_variables } from './globals.js';
import { fetchToBackend } from './http.js';
// alle elemente

const html = document.getElementsByTagName('html');

// oberer Rand
const burgermenu = document.getElementById('burgermenu');
const selection_burgermenu = document.getElementById('selection_burgermenu');
const image_burger = document.getElementById('image_burger');
const favoriten = document.getElementById('favorite');
const settings = document.getElementById('settings');
const logout = document.getElementById('logout');
const link_login = document.getElementById('link_login');

// suchleiste
const input_search_location = document.getElementById('input_search_location');
const selection_search_location = document.getElementById(
  'selection_search_location'
);

// wetter
const div_weather = document.getElementById('div_weather');
// buttons
const location_description = document.getElementById('location_description');
const button_selecter_weather = document.getElementById(
  'button_selecter_weather'
);
const button_selecter_present_future = document.getElementById(
  'button_selecter_present_future'
);
const button_selecter_past = document.getElementById('button_selecter_past');
// datum
const div_date_picker = document.getElementById('div_date_picker');
const available_weather_data = document.getElementById(
  'available_weather_data'
);
const picked_date = document.getElementById('picked_date');
// wetterdaten
const div_weather_data = document.getElementById('div_weather_data');

// hours
const weather_data_hours = document.getElementById('weather_data_hours');
const current_weather0 = document.getElementById('current_weather0');

// future
const weather_data_days = document.getElementById('weather_data_days');
const future_weather0 = document.getElementById('future_weather0');
const seven_days_title = document.getElementById('seven_days_title');

// api
// responses
let location_resp = {
  rows: [
    {
      pk_location_id: 1,
      city_name: 'Berlin',
      fk_state_code_id: 57,
      fk_country_code_id: 78,
      zip_code: null,
      latitude: 52.5170365,
      longitude: 13.3888599,
      timezone_offset: null,
      pk_country_code_id: 78,
      country_name: 'Germany',
      country_code_2: 'DE',
      country_code_3: 'DEU',
      pk_state_code_id: 57,
      state_name: 'null',
      state_code_2: 'null',
    },
  ],
};
let earliest_date_resp = {
  rows: {
    earliest_date: '03.02.2022',
  },
};
let past_resp = {
  rows: {
    day: {
      pk_weather_data_day_id: 1,
      fk_location_id: 1,
      date: '02.02.2022',
      max_temperature: 6.39,
      min_temperature: 0.98,
      sky_state_name: 'Leichter Regen',
      wind_speed: 4.22,
      wind_gust: 10.75,
      wind_degree: 211,
      fk_wind_direction: 'Süden',
      precipitation_probability: 1,
      humidity: 92,
      air_pressure: 1014,
      sunrise: '07:45:15',
      sunset: '16:55:12',
      weather_report: null,
    },
    hours: [
      {
        pk_weather_data_time_id: 1,
        fk_weather_data_day_id: 1,
        time: '16:00:00',
        temperature: 6.39,
        felt_temperature: 3.87,
        sky_state_name: 'Leichter Regen',
        wind_speed: 3.47,
        wind_gust: 9.92,
        wind_degree: 213,
        fk_wind_direction: 'Süden',
        precipitation_probability: 1,
        humidity: 95,
        air_pressure: 1004,
      },
    ],
    earliest_date: null,
  },
};
let future_resp = {
  current_locale_time: '16:21:15',
  rows: {
    current: {
      pk_weather_data_current_id: 1,
      date: '04.02.2022',
      weekday: 'Freitag',
      fk_location_id: 1,
      temperature: 5.36,
      sky_state_name: 'Ein paar Wolken',
      wind_speed: 4.02,
      wind_gust: 6.71,
      wind_degree: 232,
      fk_wind_direction: 'Südwesten',
      humidity: 93,
      air_pressure: 1001,
      sunrise: '07:43:34',
      sunset: '16:57:06',
      weather_report: 'Ein paar Wolken',
      last_updated_date_time: '04.02.2022, 07:27:50',
    },
    day: [
      {
        pk_weather_data_day_id: 1,
        fk_location_id: 1,
        date: '04.02.2022',
        weekday: 'Freitag',
        max_temperature: 7.15,
        min_temperature: 3.1,
        sky_state_name: 'Leichter Regen',
        wind_speed: 9.69,
        wind_gust: 18.06,
        wind_degree: 293,
        fk_wind_direction: 'Westen',
        precipitation_probability: 0.82,
        humidity: 83,
        air_pressure: 1008,
        sunrise: '07:43:34',
        sunset: '16:57:06',
        moonrise: '21:09:00',
        moonset: '09:32:00',
        moonphase: 0.12,
        weather_report: null,
      },
    ],
    hour: [
      {
        pk_weather_data_time_id: 1,
        fk_weather_data_day_id: 1,
        time: '16:00:00',
        temperature: 6.41,
        felt_temperature: 3.9,
        sky_state_name: 'Leichter Regen',
        wind_speed: 3.47,
        wind_gust: 9.92,
        wind_degree: 213,
        fk_wind_direction: 'Süden',
        precipitation_probability: 1,
        humidity: 95,
        air_pressure: 1004,
      },
    ],
  },
};

// events
if (getCookie(global_variables.cookies.logged_user_id)) {
  link_login.style.display = 'none';
  burgermenu.style.display = 'block';
}

image_burger.onclick = () => {
  if (selection_burgermenu.style.visibility === 'visible') {
    selection_burgermenu.style.visibility = 'hidden';
  } else selection_burgermenu.style.visibility = 'visible';
};
favoriten.onclick = () => {
  window.location.href = '../views/favorites.html';
};
settings.onclick = () => {
  // window.location.href = '../views/favorites.html';
};
logout.onclick = () => {
  deleteCookie(global_variables.cookies.logged_user_id);
  window.location.href = '../views/index.html';
};
input_search_location.oninput = async () => {
  selection_search_location.innerHTML = '';

  if (input_search_location.value) {
    const inputValue = input_search_location.value.trim().split(',');

    const json = await fetchToBackend('http://localhost:3000/location', {
      city_name: inputValue[0] || '',
      country_name: inputValue[1] || '',
      state_name: inputValue[2] || '',
      zip_code: inputValue[3] || '',
      latitude: inputValue[4] || '',
      longitude: inputValue[5] || '',
      timezone_offset: '',
    });

    if (!json.isError) {
      location_resp = json;
      if (location_resp.rows.length) {
        location_resp.rows.forEach((v) => {
          let opt = document.createElement('option');

          opt.className = 'clickable';

          opt.innerHTML = `${v.city_name || '{keine Stadt}'}, ${
            v.country_name == '{null}' || !v.country_name
              ? '{kein Land}'
              : v.country_name
          }, ${
            v.state_name == '{null}' || !v.state_name
              ? '{kein Staat}'
              : v.state_name
          }, ${v.zip_code || '{keine Postleitzahl}'}, ${
            v.latitude || '{kein Breitengrad}'
          }, ${v.longitude || '{kein Längengrad}'}`;

          opt.onclick = async () => {
            const url = new URLSearchParams(window.location.search);
            // url.append('city', v.city_name);
            // url.append(
            //   'country',
            //   v.country_name == '{null}' || !v.country_name
            //     ? null
            //     : v.country_name
            // );
            // url.append(
            //   'state',
            //   v.state_name == '{null}' || !v.state_name ? null : v.state_name
            // );
            // url.append('zip', v.zip_code);
            // url.append('lat', v.latitude);
            // url.append('lon', v.longitude);

            // document.location.href = '?' + url;

            input_search_location.value = '';
            selection_search_location.style.visibility = 'hidden';
            div_weather.style.display = 'none';
            button_selecter_present_future.className = '';
            button_selecter_past.className = '';
            button_selecter_weather.style.display = 'none';
            div_weather_data.style.display = 'none';
            div_date_picker.style.display = 'none';
            await toLocationData(v.pk_location_id, opt.innerHTML);
          };

          selection_search_location.append(opt);
        });

        selection_search_location.style.visibility = 'visible';
      }
    }
  } else selection_search_location.style.visibility = 'hidden';
};

async function toLocationData(locationId, description) {
  location_description.innerHTML = description;

  button_selecter_present_future.onclick = async () => {
    div_weather_data.style.display = 'none';
    weather_data_hours.innerHTML = '';
    weather_data_days.innerHTML = '';
    weather_data_hours.append(current_weather0);
    weather_data_days.append(future_weather0);

    future_resp = await fetchToBackend(
      `http://localhost:3000/location/${locationId}/presentFuture`
    );

    if (future_resp.isError) {
      alert('Wetterdaten des gewählten Ortes sind nicht vorhanden!');
      return;
    }

    getWeatherDataHours(future_resp.rows.hour);
    getWeatherDataDays(future_resp.rows.day);

    seven_days_title.innerHTML = '7 Tage';
    button_selecter_present_future.className = 'selected';
    button_selecter_past.className = '';
    div_date_picker.style.display = 'none';
    div_weather_data.style.display = 'block';
  };

  button_selecter_past.onclick = async () => {
    div_weather_data.style.display = 'none';
    picked_date.value = '';
    weather_data_hours.innerHTML = '';
    weather_data_days.innerHTML = '';
    weather_data_hours.append(current_weather0);
    weather_data_days.append(future_weather0);

    earliest_date_resp = await fetchToBackend(
      `http://localhost:3000/location/${locationId}/past`,
      {
        date_in_past: {
          date: '',
        },
      }
    );

    if (!earliest_date_resp.isError) {
      available_weather_data.innerHTML =
        earliest_date_resp.rows.earliest_date || '{Kein Datum}';
    }

    seven_days_title.innerHTML = '1 Tag';
    button_selecter_present_future.className = '';
    button_selecter_past.className = 'selected';
    div_date_picker.style.display = 'block';
  };

  picked_date.onchange = async () => {
    if (picked_date.value) {
      past_resp = await fetchToBackend(
        `http://localhost:3000/location/${locationId}/past`,
        {
          date_in_past: {
            date: getDateStringFormatted(picked_date.value),
          },
        }
      );

      if (past_resp.isError) {
        div_weather_data.style.display = 'none';
        weather_data_hours.innerHTML = '';
        weather_data_days.innerHTML = '';
        weather_data_hours.append(current_weather0);
        weather_data_days.append(future_weather0);
        alert('Das gewählte Datum ist nicht vorhanden!');
        return;
      }

      getWeatherDataHours(past_resp.rows.hours);
      getWeatherDataDays(past_resp.rows.day);

      div_weather_data.style.display = 'block';
    }
  };

  div_weather.style.display = 'flex';
  button_selecter_weather.style.display = 'flex';
}

function getWeatherDataHours(hours) {
  if (!Array.isArray(hours)) hours = [hours];

  let i = 0;
  let list_weathers;
  for (const hour of hours) {
    list_weathers = weather_data_hours.querySelectorAll(
      '.weather_data_one_data_fragment'
    );

    if (i > 0) {
      weather_data_hours.append(list_weathers[0].cloneNode(true));

      list_weathers = weather_data_hours.querySelectorAll(
        '.weather_data_one_data_fragment'
      );

      list_weathers[i].id =
        list_weathers[i].id.slice(0, list_weathers[i].id.length - 1) + i;
    }

    const hours_time = list_weathers[i].querySelector('#hours_time');
    const hours_temp = list_weathers[i].querySelector('#hours_temp');
    const hours_pop = list_weathers[i].querySelector('#hours_pop');
    const hours_wind_speed =
      list_weathers[i].querySelector('#hours_wind_speed');
    const hours_wind_direction = list_weathers[i].querySelector(
      '#hours_wind_direction'
    );
    const hours_wind_vane = list_weathers[i].querySelector('#hours_wind_vane');
    const hours_humidity = list_weathers[i].querySelector('#hours_humidity');
    const hours_pressure = list_weathers[i].querySelector('#hours_pressure');
    const hours_weather = list_weathers[i].querySelector('#hours_weather');

    hours_time.innerHTML = hour.time.slice(0, 5);
    hours_temp.innerHTML =
      hour.temperature.toString().replace('.', ',') + ' °C';
    hours_pop.innerHTML =
      hour.precipitation_probability.toString().replace('.', ',') + ' %';
    hours_wind_speed.innerHTML =
      hour.wind_speed.toString().replace('.', ',') + ' km/h';
    hours_wind_direction.innerHTML = hour.fk_wind_direction;
    hours_wind_vane.innerHTML =
      hour.wind_gust.toString().replace('.', ',') + ' km/h';
    hours_humidity.innerHTML =
      hour.humidity.toString().replace('.', ',') + ' %';
    hours_pressure.innerHTML =
      hour.air_pressure.toString().replace('.', ',') + ' pa';
    hours_weather.innerHTML = hour.sky_state_name;

    i++;
  }
}

function getWeatherDataDays(days) {
  if (!Array.isArray(days)) days = [days];

  let i = 0;
  let list_weathers;
  for (const day of days) {
    list_weathers = weather_data_days.querySelectorAll(
      '.weather_data_one_data_fragment'
    );

    if (i > 0) {
      weather_data_days.append(list_weathers[0].cloneNode(true));

      list_weathers = weather_data_days.querySelectorAll(
        '.weather_data_one_data_fragment'
      );

      list_weathers[i].id =
        list_weathers[i].id.slice(0, list_weathers[i].id.length - 1) + i;
    }

    const days_date = list_weathers[i].querySelector('#days_date');
    const days_weekday = list_weathers[i].querySelector('#days_weekday');
    const days_max_temp = list_weathers[i].querySelector('#days_max_temp');
    const days_min_temp = list_weathers[i].querySelector('#days_min_temp');
    const days_pop = list_weathers[i].querySelector('#days_pop');
    const days_wind_speed = list_weathers[i].querySelector('#days_wind_speed');
    const days_wind_direction = list_weathers[i].querySelector(
      '#days_wind_direction'
    );
    const days_wind_vane = list_weathers[i].querySelector('#days_wind_vane');
    const days_humidity = list_weathers[i].querySelector('#days_humidity');
    const days_pressure = list_weathers[i].querySelector('#days_pressure');
    const days_weather = list_weathers[i].querySelector('#days_weather');
    const days_sunrise = list_weathers[i].querySelector('#days_sunrise');
    const days_sunset = list_weathers[i].querySelector('#days_sunset');
    const days_moonrise = list_weathers[i].querySelector('#days_moonrise');
    const days_moonset = list_weathers[i].querySelector('#days_moonset');
    const days_moonphase = list_weathers[i].querySelector('#days_moonphase');

    days_date.innerHTML = day.date;
    days_weekday.innerHTML = day.weekday;
    days_max_temp.innerHTML =
      day.max_temperature.toString().replace('.', ',') + ' °C';
    days_min_temp.innerHTML =
      day.min_temperature.toString().replace('.', ',') + ' °C';
    days_pop.innerHTML =
      day.precipitation_probability.toString().replace('.', ',') + ' %';
    days_wind_speed.innerHTML =
      day.wind_speed.toString().replace('.', ',') + ' km/h';
    days_wind_direction.innerHTML = day.fk_wind_direction;
    days_wind_vane.innerHTML =
      day.wind_gust.toString().replace('.', ',') + ' km/h';
    days_humidity.innerHTML = day.humidity.toString().replace('.', ',') + ' %';
    days_pressure.innerHTML =
      day.air_pressure.toString().replace('.', ',') + ' pa';
    days_weather.innerHTML = day.sky_state_name;
    days_sunrise.innerHTML = day.sunrise;
    days_sunset.innerHTML = day.sunset;
    days_moonrise.innerHTML = day.moonrise;
    days_moonset.innerHTML = day.moonset;
    days_moonphase.innerHTML = day.moonphase;

    i++;
  }
}

function getDateStringFormatted(date) {
  let new_date = new Date(date);

  let m = () => {
    if ((new_date.getMonth() + 1).toString().length == 1) {
      return '0' + (new_date.getMonth() + 1).toString();
    }
    return (new_date.getMonth() + 1).toString();
  };

  let d = () => {
    if (new_date.getDate().toString().length == 1) {
      return '0' + new_date.getDate().toString();
    }
    return new_date.getDate().toString();
  };

  return d() + '.' + m() + '.' + new_date.getFullYear().toString();
}
