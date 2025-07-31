## USERS

```sql
CREATE TABLE Users (
    user_id			INT AUTO_INCREMENT PRIMARY KEY,
    nickname		VARCHAR(50) UNIQUE NOT NULL,
    email			VARCHAR(100) UNIQUE NOT NULL,
    password_hash	VARCHAR(255) NOT NULL,
    twofa_secret	VARCHAR(255),	-- encrypted 2FA secret
    avatar			TEXT,			-- URL or base64 string
    preferred_lang	VARCHAR(10) DEFAULT 'en',
    created_at		DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at		DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## FRIENDSHIPS

```sql
CREATE TABLE Friendships (
    user_id   		INT NOT NULL,
    friend_id 		INT NOT NULL,
    status    		VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at 		DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
```

- `user_id` and `friend_id` are both `INT`, matching `Users.user_id`.
- The **primary key** is the combination of both — no duplicates allowed.
- Both columns reference `Users.user_id` as foreign keys.
- `status` stores the friendship state as text. Possible values: _pending_ (default), _accepted_, _blocked_, _removed_.
- `created_at` timestamps when the friendship was created.

### Composite primary keys

When we define:

```sql
PRIMARY KEY (user_id, friend_id)
```

The pair `(user_id, friend_id)` together will uniquely identify a row. This means:

- We cannot insert the same pair `(user_id, friend_id)` twice.
- But it does NOT automatically prevent the reverse pair `(friend_id, user_id)` from existing.

Since our friendships must be reciprocal, i.e. accepted by both users, storing mirrored pairs would be redundant and useless. But the database doesn't do the job for us, therefore our table design and constraints will need a bit more logic.

Common strategies include:

- Enforce ordering: always store the friendship as (smaller_user_id, larger_user_id). So (1, 2) is allowed but (2, 1) is rejected or converted to (1, 2). That way, no duplicates in either order.

- Enforce this ordering in your application code before inserting.

- Add triggers or checks in the database to enforce ordering (more advanced).

### FOREIGN KEY

- A **foreign key** (FK) is a constraint that links a column in one table to a primary key column in another table.

- It enforces referential integrity: you can only store values that actually exist in the referenced table.

- In our case, `user_id` and `friend_id` in `Friendships` must both refer to existing `user_id`s in Users.

### ON DELETE CASCADE

It tells the database: “If a user in the Users table is deleted, then automatically delete all friendship rows involving that user.”

Example:

- User with `user_id` = `1` is deleted.
- All rows in `Friendships` where `user_id` = `1` or `friend_id` = `1` are also deleted automatically.

This prevents orphaned friendship records referencing users that no longer exist, and simplifies maintenance since we don’t have to remember to delete friendship rows separately.

---

## TOURNAMENT REGISTER

```sql
CREATE TABLE TournamentRegister (
    tournament_id INT NOT NULL,
    user_id INT NOT NULL,
    registered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('confirmed', 'waiting', 'dropped') NOT NULL DEFAULT 'confirmed',
    PRIMARY KEY (tournament_id, user_id),
    FOREIGN KEY (tournament_id) REFERENCES Tournaments(tournament_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
```

`registered_at` and `status` are optional fields, unnecessary if the game is always played locally. But I keep them just in case we implement the remote mode:

- `registered at` keeps track of when each user joined the tournament:
	+ If more players try to register than the number_of_players allows, we accept the first N by order of registered_at.
	+ Useful for debugging or disputes about who signed up first.
- `status`:
	+ `confirmed` for the first N players registered 
	+ `waiting list` for the rest: if someone drops out, the first waiting user is promoted
	+ `dropped out` when someone unregisters
	+ `kicked` if someone is disqualifyed

---

## PONG TOURNAMENTS

```sql
CREATE TABLE Tournaments (
    tournament_id		INT AUTO_INCREMENT PRIMARY KEY,
    tournament_name		VARCHAR(100) NOT NULL,
    start_datetime 		DATETIME NOT NULL,
    end_datetime		DATETIME,
    number_of_players	INT NOT NULL,
    winner_id			INT,
    created_at			DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (winner_id) REFERENCES Users(user_id)
);
```

---

## PONG MATCHES

```sql
CREATE TABLE Matches (
    match_id		INT AUTO_INCREMENT PRIMARY KEY,
    tournament_id	INT NOT NULL,
    round_number	INT NOT NULL,
    match_datetime	DATETIME,
    player1_id		INT NOT NULL,
    player2_id		INT NOT NULL,
    score1			INT,
    score2			INT,
    winner_id		INT,
    FOREIGN KEY (tournament_id) REFERENCES Tournaments(tournament_id),
    FOREIGN KEY (player1_id) REFERENCES Users(user_id),
    FOREIGN KEY (player2_id) REFERENCES Users(user_id),
    FOREIGN KEY (winner_id) REFERENCES Users(user_id)
);
```

---

## BREAKOUT GAMES

```sql
CREATE TABLE BreakoutGames (
    game_id				INT AUTO_INCREMENT PRIMARY KEY,
    player_id			INT NOT NULL,
    played_at			DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    score				INT NOT NULL,
    blocks_destroyed	INT NOT NULL,
    game_duration		INT NOT NULL, -- seconds or milliseconds
    FOREIGN KEY (player_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
```

---

## Entity Relationship Diagrams (ERD) vs. MSAccess diagrams

MSAccess **draw mostly connections**, letting Access decide the details:

- Hides much of the SQL logic (you don’t see composite keys, foreign key clauses, etc.).
- Relationship direction is more diagrammatic than relational.
- Not widely used in professional software projects today.

Instead, ERD is universal and accepted in real-world software engineering, so diagrams are easily understood.

**ERD style:**

- Arrows usually drawn **from the child (Foreign Key( FK)) to the parent (Parent Key (PK))** (the opposite to MSAccess):

	+ MSAccess diagrams show **cardinality direction** (parent → child).
	+ Instead, ERD diagrams show **dependency direction** (child → parent), emphasizing **foreign key constraints**.

- Cardinalities often shown as 1:N, N:M, etc.

- Constraints written explicitly (e.g., `PK(user_id, friend_id)`).

In the context of ERDs, cardinality means **the number of rows in one table that can or must be linked to rows in another table**. It’s a way to describe the quantity relationship between two entities.

>Main Types of Cardinality:
>- **One-to-One (1:1)**
>	+ Each row in A relates to at most one row in B.
>	+ And each row in B relates to at most one row in A.
>
>	+ Example:
>		- Each user has one profile.
>		- Each profile belongs to one user.
>
>	- **One-to-Many (1:N)**    
>	+ Each row in A relates to many rows in B.
>	+ But each row in B relates to exactly one row in A.
>
>	+ Example:    
>		- One tournament → many matches.
>		- Each match belongs to exactly one tournament.
>
>	- **Many-to-Many (N:M)**    
>	+ Rows in A can relate to many rows in B.
>	+ Rows in B can relate to many rows in A.
>	+ Requires a join table in relational databases.
>		
>	+ Example:    
>		- Many users can register for many tournaments.
>		- That’s why you need tournament_register.



