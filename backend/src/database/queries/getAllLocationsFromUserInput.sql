select *
from location as l
join country_code as cc on cc.pk_country_code_id = l.fk_country_code_id
where city_name like ? or state_code like ? or zip_code like ? or latitude like ? or longitude like ?
order by city_name asc