// api
const api_location = {
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
const api_url = 'http://localhost:3000/user/1/favorites';
const api_body = {
  city_name: 'Berlin',
  country_name: '',
  state_name: '',
  zip_code: '',
  latitude: '',
  longitude: '',
  timezone_offset: '',
};

// alle favoriten
const all_favorites = document.querySelector('div.form');
const one_favorite = all_favorites.querySelector('div.form > div');
const latitude = one_favorite.querySelector('#latitude').innerHTML;
const longitude = one_favorite.querySelector('#longitude').innerHTML;
const zip = one_favorite.querySelector('#zip').innerHTML;
const city = one_favorite.querySelector('#city').innerHTML;
const country = one_favorite.querySelector('#country').innerHTML;
console.log(one_favorite);
console.log(latitude);
console.log(longitude);
console.log(zip);
console.log(city);
console.log(country);
// klonen von elementen
const d = one_favorite.cloneNode(true);
// kinder anfügen
all_favorites.append(d);

loadAllFavorites();

function loadAllFavorites(params) {}
