# Picture of the very first version of a web app

## 1. The PIECES needed

### 1.1 The database

- This is where the information lives (like a notebook).
- In your case, the SQLite file `ft_transcendence.db`.
- Example: it has a table called `friendships` where you can store pairs of users.

### 1.2 The server (Fastify)

- This is like a waiter in a restaurant.
- It listens for requests (_“please add a friendship”_) and talks to the kitchen (the database).
- If successful, it comes back and says, _“Done, friendship added!”_

### 1.3 The client (for now: curl, later: your browser with an HTML form)

- This is the customer who tells the waiter what they want.
- With `curl`, you typed a command that said: _“Please add a friendship between user 3 and user 1.”_
- Later, a browser form will do the same thing when you click a button.

## 2. The TOOLS involved

### 2.1 Node.js

- Think of it as the “engine” that runs JavaScript outside the browser.
- Your Fastify server is written in JavaScript, and Node.js executes it.
- Without Node.js, the server code is just text.

### 2.2 Fastify

- A **library (toolbox) inside Node.js** that makes it easy to create a server.
- Instead of writing a huge amount of code to handle requests, you just say:

	```js
		fastify.post("/add-friendship", ...)
	```

	and Fastify does the rest.

### 2.3 SQLite

- A database that stores data in a single file on your computer.
- You already created the tables manually.
- Node.js talks to this file using the `sqlite3` library.

### 2.4 curl

- A testing tool.
- It pretends to be a browser and sends requests to your server.
- Useful while you don’t have an HTML form yet.

## 3. The WORKFLOW

Let's put it all together:

1. You start the server with:
	```bash
		node server.js
	```
	Node.js runs your Fastify code.

2. Fastify listens at `http://localhost:3000`.

3. You send a request with curl:
	```bash
		curl -X POST http://localhost:3000/add-friendship ...
	```

4. Fastify receives it, tells SQLite: _“Please insert (3,1) into the friendships table.”_

5. SQLite writes the row into `ft_transcendence.db`.

6. Fastify replies:
	```json
		{"message":"Friendship added!"}
	```