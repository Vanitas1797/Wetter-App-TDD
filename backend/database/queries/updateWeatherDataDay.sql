-- SQLite
UPDATE weather_data_day
SET max_temperature = ?, min_temperature = ?, fk_sky_state = ?, wind_speed = ?, wind_gust = ?, wind_degree = ?, fk_wind_direction = ?, precipitation_probability = ?, humidity = ?, air_pressure = ?, sunrise = ?, sunset = ?, weather_report = ?, last_updated_unix = ?
WHERE date = ?