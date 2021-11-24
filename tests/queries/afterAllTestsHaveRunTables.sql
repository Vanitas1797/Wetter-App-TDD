DROP TABLE IF EXISTS "wind_direction";
CREATE TABLE IF NOT EXISTS "wind_direction" (
	"pk_wind_direction"	TEXT,
	PRIMARY KEY("pk_wind_direction")
);
DROP TABLE IF EXISTS "sky_state";
CREATE TABLE IF NOT EXISTS "sky_state" (
	"pk_sky_state"	TEXT,
	PRIMARY KEY("pk_sky_state")
);
DROP TABLE IF EXISTS "user";
CREATE TABLE IF NOT EXISTS "user" (
	"pk_user_name"	TEXT,
	"email_address"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	PRIMARY KEY("pk_user_name")
);
DROP TABLE IF EXISTS "moon_phase";
CREATE TABLE IF NOT EXISTS "moon_phase" (
	"pk_moon_phase_id"	INTEGER,
	"moon_phase"	NUMERIC NOT NULL,
	"moon_phase_description"	TEXT NOT NULL,
	PRIMARY KEY("pk_moon_phase_id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "saved_location";
CREATE TABLE IF NOT EXISTS "saved_location" (
	"pk_saved_location_id"	INTEGER,
	"fk_user_name"	TEXT,
	"fk_location_id"	INTEGER,
	FOREIGN KEY("fk_location_id") REFERENCES "location"("pk_location_id"),
	FOREIGN KEY("fk_user_name") REFERENCES "user"("pk_user_name"),
	PRIMARY KEY("pk_saved_location_id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "weather_data_hour";
CREATE TABLE IF NOT EXISTS "weather_data_hour" (
	"pk_weather_data_hour_id"	INTEGER,
	"fk_weather_data_day_id"	INTEGER NOT NULL,
	"datetime_unix"	INTEGER NOT NULL,
	"temperature"	NUMERIC,
	"felt_temperature"	NUMERIC,
	"fk_sky_state"	TEXT,
	"wind_speed"	NUMERIC,
	"wind_gust"	NUMERIC,
	"wind_degree"	NUMERIC,
	"fk_wind_direction"	TEXT,
	"precipitation_probability"	NUMERIC,
	"humidity"	NUMERIC,
	"air_pressure"	INTEGER,
	FOREIGN KEY("fk_weather_data_day_id") REFERENCES "weather_data_day"("pk_weather_data_day_id"),
	FOREIGN KEY("fk_sky_state") REFERENCES "sky_state"("pk_sky_state"),
	FOREIGN KEY("fk_wind_direction") REFERENCES "wind_direction"("pk_wind_direction"),
	PRIMARY KEY("pk_weather_data_hour_id")
);
DROP TABLE IF EXISTS "weather_data_day";
CREATE TABLE IF NOT EXISTS "weather_data_day" (
	"pk_weather_data_day_id"	INTEGER,
	"fk_location_id"	INTEGER NOT NULL,
	"datetime_unix"	INTEGER NOT NULL,
	"temperature"	NUMERIC,
	"max_temperature"	NUMERIC,
	"min_temperature"	NUMERIC,
	"fk_sky_state"	TEXT,
	"max_felt_temperature"	NUMERIC,
	"min_felt_temperature"	NUMERIC,
	"wind_speed"	NUMERIC,
	"wind_gust"	NUMERIC,
	"wind_degree"	INTEGER,
	"fk_wind_direction"	TEXT,
	"precipitation_probability"	NUMERIC,
	"humidity"	NUMERIC,
	"air_pressure"	INTEGER,
	"sunrise_unix"	INTEGER,
	"sunset_unix"	INTEGER,
	"weather_report"	INTEGER,
	FOREIGN KEY("fk_wind_direction") REFERENCES "wind_direction"("pk_wind_direction"),
	FOREIGN KEY("fk_sky_state") REFERENCES "sky_state"("pk_sky_state"),
	FOREIGN KEY("fk_location_id") REFERENCES "location"("pk_location_id"),
	PRIMARY KEY("pk_weather_data_day_id")
);
DROP TABLE IF EXISTS "astronomy";
CREATE TABLE IF NOT EXISTS "astronomy" (
	"pfk_weather_data_day_id"	INTEGER,
	"moonrise_unix"	INTEGER,
	"moonset_unix"	INTEGER,
	"fk_moon_phase_id"	INTEGER,
	FOREIGN KEY("fk_moon_phase_id") REFERENCES "moon_phase"("pk_moon_phase_id"),
	FOREIGN KEY("pfk_weather_data_day_id") REFERENCES "weather_data_day"("pk_weather_data_day_id"),
	PRIMARY KEY("pfk_weather_data_day_id")
);
DROP TABLE IF EXISTS "country_code";
CREATE TABLE IF NOT EXISTS "country_code" (
	"pk_country_code_id"	INTEGER,
	"country"	TEXT NOT NULL,
	"country_code_2"	TEXT NOT NULL UNIQUE,
	"country_code_3"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("pk_country_code_id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "location";
CREATE TABLE IF NOT EXISTS "location" (
	"pk_location_id"	INTEGER,
	"city_name"	TEXT,
	"state_code"	TEXT,
	"fk_country_code_id"	TEXT,
	"zip_code"	TEXT,
	"latitude"	NUMERIC NOT NULL UNIQUE,
	"longitude"	NUMERIC NOT NULL UNIQUE,
	FOREIGN KEY("fk_country_code_id") REFERENCES "country_code"("pk_country_code_id"),
	PRIMARY KEY("pk_location_id" AUTOINCREMENT)
);