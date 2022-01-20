SELECT *
FROM location
JOIN country_code ON pk_country_code_id = fk_country_code_id
JOIN state_code ON pk_state_code_id = fk_state_code_id
WHERE city_name LIKE ? OR country_name LIKE ? OR state_name LIKE ? OR zip_code LIKE ? OR latitude LIKE ? OR longitude LIKE ? OR timezone_offset LIKE ?
ORDER BY city_name ASC