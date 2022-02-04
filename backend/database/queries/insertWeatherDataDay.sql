-- SQLite
INSERT INTO weather_data_day (fk_location_id, date, weekday, max_temperature, min_temperature, sky_state_name, wind_speed, wind_gust, wind_degree, fk_wind_direction, precipitation_probability, humidity, air_pressure, sunrise, sunset, moonset, moonrise, moonphase, weather_report)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);