-- SQLite
SELECT pk_weather_data_day_id, city_name, state_name, country_name, zip_code, latitude, longitude, datetime_unix, temperature, max_temperature, min_temperature, fk_sky_state, max_felt_temperature, min_felt_temperature, wind_speed, wind_gust, wind_degree, fk_wind_direction, precipitation_probability, humidity, air_pressure, sunrise_unix, sunset_unix, weather_report
FROM weather_data_day
JOIN location ON pk_location_id = fk_location_id
JOIN wind_direction ON pk_wind_direction = fk_wind_direction
JOIN sky_state ON pk_sky_state = fk_sky_state
WHERE latitude = ? AND longitude = ? AND datetime_unix >= ?