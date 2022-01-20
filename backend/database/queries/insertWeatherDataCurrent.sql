-- SQLite
INSERT INTO weather_data_current (fk_location_id, date, temperature, sky_state_name, wind_speed, wind_gust, wind_degree, fk_wind_direction, humidity, air_pressure, sunrise, sunset, weather_report, last_updated_date_time)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);