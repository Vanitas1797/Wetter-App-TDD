select *
from location as l
JOIN country_code ON pk_country_code_id = fk_country_code_id
JOIN state_code ON pk_state_code_id = fk_state_code_id
where city_name like ? or country_name like ? or state_name like ? or zip_code like ? or latitude like ? or longitude like ?
order by city_name asc