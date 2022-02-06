import { getCookie } from './cookie.js';
import { global_variables } from './globals.js';
import { fetchToBackend } from './http.js';

// api
let favorite_resp = {
  rows: [
    {
      pk_saved_location_id: 1,
      fk_user_id: 3,
      fk_location_id: 1,
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
      state_name: null,
      state_code_2: null,
    },
  ],
};

// alle favoriten
const div_favorites = document.getElementById('div_favorites');

window.onload = async () => {
  await loadFavorites();
};

if (!getCookie(global_variables.cookies.logged_user_id)) {
  window.location.href = 'index.html';
}

async function loadFavorites() {
  favorite_resp = await fetchToBackend(
    `http://localhost:3000/user/${getCookie(
      global_variables.cookies.logged_user_id
    )}/favorites`
  );

  if (favorite_resp.isError) {
    div_favorites.style.display = 'none';
    return;
  } else {
    div_favorites.style.display = 'block';
  }

  let i = 0;
  let list_favorites;
  for (const row of favorite_resp.rows) {
    list_favorites = div_favorites.querySelectorAll('.one_favorite_fragment');

    if (i > 0) {
      div_favorites.append(list_favorites[0].cloneNode(true));

      list_favorites = div_favorites.querySelectorAll('.one_favorite_fragment');

      list_favorites[i].id =
        list_favorites[i].id.slice(0, list_favorites[i].id.length - 1) + i;

      let bin_img = list_favorites[i].querySelector('#bin_img' + (i - 1));
      bin_img.id = 'bin_img' + i;
    }

    let latitude = list_favorites[i].querySelector('#latitude');
    let longitude = list_favorites[i].querySelector('#longitude');
    let zip = list_favorites[i].querySelector('#zip');
    let city = list_favorites[i].querySelector('#city');
    let country = list_favorites[i].querySelector('#country');
    let state = list_favorites[i].querySelector('#state');

    latitude.innerHTML = row.latitude
      .toPrecision(4)
      .toString()
      .replace('.', ',');
    longitude.innerHTML = row.longitude
      .toPrecision(4)
      .toString()
      .replace('.', ',');
    zip.innerHTML = row.zip_code || '{Keine Postleitzahl}';
    city.innerHTML = row.city_name;
    country.innerHTML = row.country_name || '{Kein Land}';
    state.innerHTML = row.state_name || '{Kein Staat}';

    let bin_img = document.getElementById('bin_img' + i);
    bin_img.onclick = () => {
      bin_img.parentElement.parentElement.parentElement.remove();
    };

    i++;
  }
}
