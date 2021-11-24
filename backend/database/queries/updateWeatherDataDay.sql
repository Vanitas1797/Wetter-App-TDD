UPDATE FROM weather_data_day
SET max_temperature = ?, min_temperature = ?, fk_sky_state_name = ?, wind_speed = ?, wind_gust = ?, wind_degree = ?, fk_wind_direction = ?, precipitation_probability = ?, humidity = ?, air_pressure = ?, sunrise = ?, sunset = ?, weather_report = ?
WHERE fk_location_id = ?