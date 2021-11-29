UPDATE weather_data_time
SET temperature = ?, felt_temperature = ?, sky_state_name = ?, wind_speed = ?, wind_gust = ?, wind_degree = ?, fk_wind_direction = ?, precipitation_probability = ?, humidity = ?, air_pressure = ?
WHERE fk_weather_data_day_id = ?