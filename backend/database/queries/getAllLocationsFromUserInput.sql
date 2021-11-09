select pk_location_id, city_name, state_name, country_name, zip_code, latitude, longitude
from location as l
where city_name like ? or country_name like ? or state_name like ? or zip_code like ? or latitude like ? or longitude like ?
order by city_name asc