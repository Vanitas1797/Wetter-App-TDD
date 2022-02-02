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
const current_weather = document.getElementById('current_weather');
// future
const weather_data_future = document.getElementById('weather_data_future');
const future_weather = document.getElementById('future_weather');

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
  const inputValue = input_search_location.value.trim().split(',');

  selection_search_location.innerHTML = '';

  if (inputValue.length) {
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

            await toLocationData(v.pk_location_id, opt.innerHTML);
            selection_search_location.style.visibility = 'hidden';
          };

          selection_search_location.append(opt);
        });

        selection_search_location.style.visibility = 'visible';
      }
    }
  } else selection_search_location.style.visibility = 'hidden';
};

async function toLocationData(locationId, description) {
  button_selecter_present_future.onclick = () => {
    button_selecter_present_future.className = 'selected';
    button_selecter_past.className = '';
    div_date_picker.style.display = 'none';
  };
  button_selecter_past.onclick = async () => {
    button_selecter_present_future.className = '';
    button_selecter_past.className = 'selected';
    div_date_picker.style.display = 'block';

    available_weather_data.innerHTML = '';
  };

  location_description.innerHTML = description;

  const future_data = await fetchToBackend(
    `http://localhost:3000/location/${locationId}/presentFuture`
  );

  picked_date.onchange = () => {};

  div_weather.style.display = 'flex';
}
