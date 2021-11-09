select *
from saved_location as sl
join location as l on sl.fk_location_id = l.pk_location_id
where sl.fk_user_name = ?