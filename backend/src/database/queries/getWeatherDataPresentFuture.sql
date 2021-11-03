select *
from weather_data_day as wdd
where wdd.datetime_unix >= ? and wdd.datetime_unix <= ?
order by wdd.datetime_unix asc