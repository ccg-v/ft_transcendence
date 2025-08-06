# SQLite COMMANDS

- `.tables`: **lists the name of the tables** in a database

- `.schema <table_name>`: **prints the SQL codeS** used to create a table:

- Add a new column:
```sql
 	ALTER TABLE users ADD COLUMN password TEXT NOT NULL DEFAULT 'changeme';
```

- Change a column's name:
```sql
 	ALTER TABLE users RENAME COLUMN username TO nick;
 ```

- Update values directly in terminal:
```sql
	UPDATE users
	SET nickname = 'new_nick'
	WHERE user_id = 1;
```

- Delete values directly from terminal:
```sql
	DELETE FROM users WHERE user_id = 1;
	DELETE FROM friendships WHERE user_id = 3 OR friend_id = 3;
```

- See rows sorted:
```sql
	SELECT * FROM users ORDER BY created_at DESC;
```