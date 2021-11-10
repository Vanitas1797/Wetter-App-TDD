-- SQLite
SELECT pk_weather_data_day_id, fk_location_id, date, max_temperature, min_temperature, fk_sky_state, wind_speed, wind_gust, wind_degree, fk_wind_direction, precipitation_probability, humidity, air_pressure, sunrise, sunset, weather_report, last_updated_unix
FROM weather_data_day
JOIN location ON pk_location_id = fk_location_id
WHERE latitude = ? AND longitude = ?