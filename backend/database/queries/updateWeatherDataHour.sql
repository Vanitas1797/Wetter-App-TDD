-- SQLite
UPDATE weather_data_hour
SET temperature = ?, felt_temperature = ?, fk_sky_state = ?, wind_speed = ?, wind_gust = ?, wind_degree = ?, fk_wind_direction = ?, precipitation_probability = ?, humidity = ?, air_pressure = ?
WHERE hour = ?