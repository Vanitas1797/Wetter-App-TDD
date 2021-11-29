BEGIN TRANSACTION;
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
DROP TABLE IF EXISTS "astronomy";
CREATE TABLE IF NOT EXISTS "astronomy" (
	"pfk_weather_data_day_id"	INTEGER,
	"moonrise_unix"	INTEGER,
	"moonset_unix"	INTEGER,
	"fk_moon_phase_id"	INTEGER,
	PRIMARY KEY("pfk_weather_data_day_id")
);
DROP TABLE IF EXISTS "saved_location";
CREATE TABLE IF NOT EXISTS "saved_location" (
	"pk_saved_location_id"	INTEGER,
	"fk_user_name"	TEXT,
	"fk_location_id"	INTEGER,
	PRIMARY KEY("pk_saved_location_id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "country_code";
CREATE TABLE IF NOT EXISTS "country_code" (
	"pk_country_code_id"	INTEGER,
	"country_name"	TEXT NOT NULL,
	"country_code_2"	TEXT,
	"country_code_3"	TEXT,
	PRIMARY KEY("pk_country_code_id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "sky_state";
CREATE TABLE IF NOT EXISTS "sky_state" (
	"pk_sky_state_name"	TEXT,
	PRIMARY KEY("pk_sky_state_name")
);
DROP TABLE IF EXISTS "weather_data_day";
CREATE TABLE IF NOT EXISTS "weather_data_day" (
	"pk_weather_data_day_id"	INTEGER,
	"fk_location_id"	INTEGER NOT NULL,
	"date"	INTEGER NOT NULL,
	"max_temperature"	NUMERIC,
	"min_temperature"	NUMERIC,
	"sky_state_name"	TEXT,
	"wind_speed"	NUMERIC,
	"wind_gust"	NUMERIC,
	"wind_degree"	INTEGER,
	"fk_wind_direction"	TEXT,
	"precipitation_probability"	NUMERIC,
	"humidity"	NUMERIC,
	"air_pressure"	INTEGER,
	"sunrise"	INTEGER,
	"sunset"	INTEGER,
	"weather_report"	TEXT,
	PRIMARY KEY("pk_weather_data_day_id")
);
DROP TABLE IF EXISTS "state_code";
CREATE TABLE IF NOT EXISTS "state_code" (
	"pk_state_code_id"	INTEGER,
	"state_name"	TEXT,
	"state_code_2"	TEXT,
	PRIMARY KEY("pk_state_code_id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "wind_direction";
CREATE TABLE IF NOT EXISTS "wind_direction" (
	"pk_wind_degree"	INTEGER,
	"wind_direction_name"	TEXT,
	PRIMARY KEY("pk_wind_degree")
);
DROP TABLE IF EXISTS "weather_data_time";
CREATE TABLE IF NOT EXISTS "weather_data_time" (
	"pk_weather_data_time_id"	INTEGER,
	"fk_weather_data_day_id"	INTEGER NOT NULL,
	"time"	INTEGER NOT NULL,
	"temperature"	NUMERIC,
	"felt_temperature"	NUMERIC,
	"sky_state_name"	TEXT,
	"wind_speed"	NUMERIC,
	"wind_gust"	NUMERIC,
	"wind_degree"	NUMERIC,
	"fk_wind_direction"	TEXT,
	"precipitation_probability"	NUMERIC,
	"humidity"	NUMERIC,
	"air_pressure"	INTEGER,
	PRIMARY KEY("pk_weather_data_time_id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "weather_data_current";
CREATE TABLE IF NOT EXISTS "weather_data_current" (
	"pk_weather_data_current_id"	INTEGER,
	"fk_location_id"	INTEGER NOT NULL,
	"date"	INTEGER NOT NULL,
	"temperature"	NUMERIC,
	"sky_state_name"	TEXT,
	"wind_speed"	NUMERIC,
	"wind_gust"	NUMERIC,
	"wind_degree"	INTEGER,
	"fk_wind_direction"	TEXT,
	"humidity"	NUMERIC,
	"air_pressure"	INTEGER,
	"sunrise"	INTEGER,
	"sunset"	INTEGER,
	"weather_report"	TEXT,
	"last_updated_date_time"	INTEGER,
	PRIMARY KEY("pk_weather_data_current_id")
);
DROP TABLE IF EXISTS "location";
CREATE TABLE IF NOT EXISTS "location" (
	"pk_location_id"	INTEGER,
	"city_name"	TEXT,
	"fk_state_code_id"	INTEGER,
	"fk_country_code_id"	INTEGER,
	"zip_code"	TEXT,
	"latitude"	NUMERIC,
	"longitude"	NUMERIC,
	"timezone_offset"	INTEGER,
	PRIMARY KEY("pk_location_id" AUTOINCREMENT)
);
COMMIT;
