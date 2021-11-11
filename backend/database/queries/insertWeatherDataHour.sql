-- SQLite
INSERT INTO weather_data_hour (fk_weather_data_day_id, hour, temperature, felt_temperature, fk_sky_state, wind_speed, wind_gust, wind_degree, fk_wind_direction, precipitation_probability, humidity, air_pressure)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);