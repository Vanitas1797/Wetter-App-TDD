import cookie from "./cookie";

export async function selectLocation(locationId, description) {
  input_search_location.value = '';
  selection_search_location.style.visibility = 'hidden';
  div_weather.style.display = 'none';
  button_selecter_present_future.className = '';
  button_selecter_past.className = '';
  button_selecter_weather.style.display = 'none';
  div_weather_data.style.display = 'none';
  div_date_picker.style.display = 'none';
  let favorite_resp = await fetchToBackend(
    `http://localhost:3000/user/${cookie.getCookie(
      global_variables.cookies.logged_user_id
    )}/favorites`
  );
  
  if (!favorite_resp.isError) {
    if (favorite_resp.rows.find((v) => v.pk_location_id === locationId)) {
      star_img.src = '../images/star_gefüllt.png';
    }
  } else star_img.src = '../images/star.png';
  await toLocationData(locationId, description);
}

export function getLocationDescription(row) {
  return `${row.city_name || '{keine Stadt}'}, ${
    row.country_name == '{null}' || !row.country_name
      ? '{kein Land}'
      : row.country_name
  }, ${
    row.state_name == '{null}' || !row.state_name
      ? '{kein Staat}'
      : row.state_name
  }, ${row.zip_code || '{keine Postleitzahl}'}, ${
    row.latitude || '{kein Breitengrad}'
  }, ${row.longitude || '{kein Längengrad}'}`;
}
