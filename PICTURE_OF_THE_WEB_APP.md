# Picture of the very first version of a web app (no frontend)

We'll start testing without a frontend. Instead of using HTML to start testing the database connection, we will use `cURL` in terminal to validate our backend <-> database pipeline before the frontend exists.

## 1. The PIECES needed

### 1.1 The database

- This is where the information lives (like a notebook).
- In your case, the SQLite file `ft_transcendence.db`.
- Example: it has a table called `friendships` where you can store pairs of users.

### 1.2 The backend

- A minimal Fastify app, since that's the required framework.
- It will run SQL commands on our SQLite DB.

### 1.3 The server (Fastify)

- Fastify doubles as web server for now (we don't need Nginx yet just to test the basics).
- This is like a waiter in a restaurant.
- It listens for requests (_“please add a friendship”_) and talks to the kitchen (the database).
- If successful, it comes back and says, _“Done, friendship added!”_

### 1.4 The client (for now: curl, later: your browser with an HTML form)

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

# Jumping to a _full stack round_: test connection 

Lets go forward and complete a "full stack round trip":

```
	HTML → Fastify backend → SQLite database → browser response
```

1. Allow Fastify to accept requests from your browser

- Add CORS plugin to the project (CORS = Cross-Origin Resource Sharing). Since we have installed Fastify v4, we will install CORS version 8:

```bash
	npm install @fastify/cors@8
```

- In `server.js`, register CORS after creating the Fastify instance but before starting the server:

```js
	fastify.register(require("@fastify/cors"), { origin: "*" });
```

2. At this point,, still our Fastify server does not know how to serve a webpage at the root URL (`GET /`). To serve our HTML page with Fastify, we have two options:

2.1 Serve the HTML with a custom route

- Define a GET route in your server.js that sends the HTML manually:

```js
const fs = require("fs");
const path = require("path");

fastify.get("/", async (request, reply) => {
  const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  reply.type("text/html").send(html);
});
```
- We are manually reading `index.html` from disk each time someone visits `/`. 
- This works fine for a single page, but as soon as we need CSS, images, or frontend JavaScript, we will have to add more custom routes (`/style.css`, `/script.js`, `/logo.png`, etc.).
- Each file served means we repeat `fs.readFileSync` or similar.
- This option is good for a quick test or one single HTML file.

2.2 Serve a static index.html file with Fastify

- Create a folder called, for example, `public` inside your project folder.
- Put your `index.html` file inside that `public` folder.
- Install the Fastify static plugin to serve static files (must be `6.x`, which is the last version compatible with Fastify v4 - `7.x` requires v5):
```bash
	npm install @fastify/static@6
```
- Modify your `server.js` to register the static plugin **before** your routes:

```js
	const path = require("path");

	// Serve files from 'public' folder at root URL
	fastify.register(require('@fastify/static'), {
	root: path.join(__dirname, "public"),
	});
```
- Now Fastify automatically serves all files inside a folder (in our case, `public`).
- We can drop in `index.html`, `style.css`, `app.js`, and even folders like `/images` and they’re all available right away:
	- Visiting `/` will give `public/index.html` automatically.
	- Visiting `/style.css` will give `public/style.css`.
	- Visiting `/js/app.js` will give `public/js/app.js`.
- The snippet is enough to serve all the files inside `public/` automatically, we don’t need to write a route per file. Fastify detects file types, sets the right headers, and handles them.

---

# Lock in the mini-MVP: basic user registration

Before you throw Docker or Nginx into the mix, let’s turn that into a tiny prototype that actually feels like a game site.

Add just one real feature for users:

- a registration form with nick, email, and password
- save the user in the users table (no security yet — cleartext password is fine for this step)

That way, you prove:

-Frontend form → Fastify route → SQLite insert → Feedback to user

You’ll see the same cycle working for a more meaningful table than friendships.
