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
all_favorites.append(d)
