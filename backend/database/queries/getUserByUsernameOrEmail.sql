-- SQLite
SELECT pk_user_name, email_address, password
FROM user
WHERE pk_user_name = ? OR email_address = ?