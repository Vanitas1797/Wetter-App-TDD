SELECT *
FROM weather_data_day
JOIN weather_data_hour ON fk_weather_data_day_id = pk_weather_data_day_id
WHERE fk_location_id = ? AND dat = ?