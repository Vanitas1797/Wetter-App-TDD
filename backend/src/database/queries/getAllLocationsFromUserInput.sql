select pk_location_id, city_name, state_code, country_name, zip_code, latitude, longitude
from location as l
join country_code as cc on cc.country = l.country_name
where city_name like ? or country like ? or state_code like ? or zip_code like ? or latitude like ? or longitude like ?
order by city_name asc