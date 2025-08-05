# SQLite

## 1. Basic SQL

- The goal is to create our own tables and later query them.
- We will focus only on `CREATE TABLE`, `INSERT INTO`, `SELECT ... WHERE`, `UPDATE`, `DELETE` and basic `JOIN`
- Practising will be simmple with SQLite CLI

- to **list the name of the tables** in a database: `.tables`

### 1.1 Installing SQLite

```bash
sudo apt update
sudo apt install sqlite3
```
To check installation:

```bash
sqlite3 --version
```

### 1.2 Creating a new database

Let's call it `ft_transcendence.db`:

```bash
sqlite3 ft_transcendence.db
```

This opens the SQLite prompt. The output in terminal should be similar to:

```bash
SQLite version 3.x.x
Enter ".help" for usage hints.
sqlite>
```

### 1.3 Creating a new table

At the `sqlite>` prompt, type:

```sql
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
This creates a simple users table:

- `user_id`: unique ID, auto-incremented.
- `username`: the user’s nickname. It must be unique.
- `email`: must also be unique.
- `created_at`: auto-filled with the current time.

### 1.4 Filling the table

Still at the SQLite prompt, type:

```sql
INSERT INTO users (username, email) VALUES ('Carlos', 'carlos@example.com');
INSERT INTO users (username, email) VALUES ('Clara', 'clara@example.com');
```

To retrieve what we stored:

```sql
SELECT * FROM users;
```

The output should be:

```bash
1 | Carlos | carlos@example.com | 2025-07-31 19:42:00
2 | Clara  | clara@example.com  | 2025-07-31 19:42:10
```

To exit the database:

```sql
.exit
```

Now we have a file `ft_transcendence.db` in our folder. That file is our database.

---

## 2. Connecting two tables: JOIN query

### 2.1 Creating a second table

Open the database:

```bash
sqlite3 ft_transcendence.db
```

and create a table called `tournaments`:

```sql
CREATE TABLE tournaments (
    tournament_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 Creating the JOIN table

Now we want to connect the data of the two tables, `users` and `tournaments`. Conceptually, _many users can join the same tournament, and many tournaments can be joined by the same user_. This means that the relation between both tables is _many to many_ (`N:M`), and we need a third table (called **join table**) to connect them:

```sql
CREATE TABLE tournament_participants (
    tournament_id INT NOT NULL,
    user_id INT NOT NULL,
    registered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

	-- Status of the participant: registered, waiting, or dropped (ENUM's not a SQLite native type)
	status TEXT NOT NULL DEFAULT 'registered',
	CHECK(status IN ('registered', 'waiting', 'dropped')),

    PRIMARY KEY (tournament_id, user_id),
    FOREIGN KEY (tournament_id) REFERENCES Tournaments(tournament_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
```

The **composite primary key** ensures that a user can appear only once **per tournament**, therefore there is no chance to duplicate registrations in a tournament.

### 2.3 Inserting some data

We add a couple of tournament:

```sql
INSERT INTO tournaments (name) VALUES ('Summer Cup');
INSERT INTO tournaments (name) VALUES ('Winter Cup');
```

And register the participants:

```sql
INSERT INTO tournament_participants (user_id, tournament_id) VALUES (1, 1);
INSERT INTO tournament_participants (user_id, tournament_id) VALUES (2, 1);
INSERT INTO tournament_participants (user_id, tournament_id) VALUES (2, 2);
```

### 2.4 Doing a JOIN query

Let's display the tournaments and their participants:

```sql
SELECT users.username, tournaments.name AS tournament
FROM tournament_participants
JOIN users ON tournament_participants.user_id = users.user_id
JOIN tournaments ON tournament_participants.tournament_id = tournaments.tournament_id;
```

> To shorten the commands, **aliases** can be used:
>
> `SELECT` u.username, t.name `AS` tournament \
> `FROM` tournament_participants **tp** \
> `JOIN` users **u** `ON` tp.user_id = u.user_id \
> `JOIN` tournaments **t** `ON` tp.tournament_id = t.tournament_id;
>
> u = users; t = tournaments; tp = tournament_participants
>
> Criteria for Placing Table Aliases
>  - Always immediately after the table name in the FROM or JOIN clause.
>  - Never in the SELECT clause.
 
The output will be:
```
Carlos | Summer Cup
Clara  | Summer Cup
Clara  | Winter Cup
```

Now let's filter the query to display only participants of the 'Summer Cup':

```sql
SELECT users.username
FROM tournament_participants
JOIN users ON tournament_participants.user_id = users.user_id
JOIN tournaments ON tournament_participants.tournament_id = tournaments.tournament_id
WHERE tournaments.name = 'Summer Cup';
```

Output:
```
Carlos
Clara
```

## 3. JOIN queries for a self-referencing table

Let's create the `friendships` table:

```sql
CREATE TABLE friendships (
	user_id INTEGER NOT NULL,
	friend_id INTEGER NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	-- Status of the participant: pending, accepted, or blocked (ENUM's not a SQLite native type)
	status TEXT NOT NULL DEFAULT 'pending',
	CHECK(status IN ('pending', 'accepted', 'blocked')),
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(user_id) ON DELETE CASCADE	
);
```

and create a friendship:

```sql
INSERT INTO friendships (user_id, friend_id) VALUES (1, 2);
```

In the `friendships` table, both `user_id` and `friend_id` point to `user` table. So when we build the query:

```sql
SELECT friendships.user_id, friendships.friend_id 
FROM friendships
JOIN users ON friendships.user_id = users.user_id
JOIN users ON friendships.friend_id = users.user_id
```

both `JOIN` call the table `user`. When SQLite sees `users.user_id` it doesn't know whether we mean the first `users` or the second. 

Hence the error when we run the query:

```sql
Error: ambiguous column name: users.user_id
```

To fix this, **we MUST give each instance of `users` its own alias**:

```sql
SELECT 
    u1.username AS user,
    u2.username AS friend,
    f.status,
    f.created_at
FROM friendships f
JOIN users u1 ON f.user_id = u1.user_id
JOIN users u2 ON f.friend_id = u2.user_id;
```

where **u1** = the initiating user. **u2** = the friend, and **f** = friendships table.

Now the query displays the friendship:

```sql
Carlos | Clara | pending | 2025-08-02 00:41:24
```


## 4. JOIN tables: preventing duplication of inverse tuples

Right now, the `friendships` table allows:

```sql
INSERT INTO friendships (user_id, friend_id) VALUES (1, 2);
INSERT INTO friendships (user_id, friend_id) VALUES (2, 1);
```

Those two rows represent the _same_ friendship, just reversed. But we want **only one row per friendship**.
Conceptually, we want to make sure that if `(1,2)` exists, `(2,1)` cannot be inserted. Two approaches:

### 4.1 `CHECK` constraint

The idea is to store values in a canonical order, so that we always insert the smaller `user_id` first.
Adding this `CHECK` constraint at the end of our `CREATE TABLE`:

```sql
CHECK(user_id < friend_id)
```
will reject any attempt to store `(2, 1)` will fail

```sql
Error: CHECK constraint failed: friendships
```

**Limitation:** 
If we try (2,1) while (1,2) doesn’t yet exist, **the DB will reject it instead of fixing it**.
So the friendship isn’t stored.
Therefore, this approach ensures no bad rows ever sneak in, but it does not fix our input.

### 4.2 Add logic in backend 

Using `MIN/MAX` in the backend reorders the IDs before inserting the values, so **the friendship is always stored, regardless of the order given**:

```sql
INSERT INTO friendships (user_id, friend_id, status)
VALUES (
    MIN(:user_id, :friend_id),
    MAX(:user_id, :friend_id),
    'accepted'
);
```

**Short description of how data is processed from frontend to backend:**

>
> - **Frontend:**	
> 	+ The user clicks the button to accept the friendship
>	+ The frontend (the website in the browser) sends a request, usually via HTTP, like:
>
>		```h
>		POST /api/friendships/accept
>		{
>		"user_id": 5,
>		"friend_id": 12
>		}
>		```
>
> - **Backend:**
> 	
>	+ The backend (Fastify server in our case) receives the request from the frontend
>	+ Runs any validation/security checks if necessary
>	+ Builds and executes the SQL statement with the INSERT command:
>
>		```sql
>		INSERT INTO friendships (user_id, friend_id, status)
>		VALUES (
>			MIN(:user_id, :friend_id),
>			MAX(:user_id, :friend_id),
>		'	accepted'
>		);
>		```
>	+ Returns a response back to the frontend, e.g.:
>
>		```json
>		{ "message": "Friendship accepted successfully!" }
>		```
>
> -	**Frontend:**
>	+ Receives the response
>	+ Updates the UI (e.g. hiding or disabling the button and showing _"You are now friends"_).
>

### 4.3 The Combo (best practice)

- Backend MIN/MAX: guarantees insertion always succeeds with the right order.
- CHECK constraint + PK: guarantees that if the backend slips up, the DB still refuses values given in the wrong order.
- Table's PK (`PRIMARY KEY (user_id, friend_id)`) prevents tuple duplications.