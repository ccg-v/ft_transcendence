# Adding a POST Route (Basic API)

## What is a “route”?

A route is like a door to the server.

Each route is a URL (like `/login`, `/hello`, `/users`) where the client (like a browser) can **talk to the server**.

There are different kinds of routes based on what the client wants to do:

Method     | Meaning
---------- | --------------------------------------------------------
**GET**	   | “Hey server, give me something”
**POST**   | “Hey server, I’m sending you something” (like form data)

## Why do we need a POST route?

Because users will send data to the server:

- When they **log in**: they send username + password
- When they **sign up**: they send name, email, etc.
- When they **chat**: they send a message

That’s why we need a **POST route**, to **receive data**.


## What and where to add it?

This is the **POST route**:

```js
fastify.post('/login', async (request, reply) => {
  const { username, password } = request.body
  return { received: { username, password } }
})
```

We are telling Fastify to **create a route that listens for POST requests at the URL path `/login`**

We must add it to the same `server.js` file where we have previously defined our Fastify server.

<ins>Remember: this file, `server.js`, is our backend, our “brain behind the curtain”.</ins>

```js
const fastify = require('fastify')({ logger: true })

// Route: GET /
fastify.get('/', async (request, reply) => {
  return { message: 'Hello!' }
})

// Route: POST /login
fastify.post('/login', async (request, reply) => {
  const { username, password } = request.body
  return { received: { username, password } }
})

// Start server
const start = async () => {
  try {
    await fastify.listen(3000, '0.0.0.0')
    console.log('Server listening on http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
```

## How to test it?

We **CAN'T** test a POST route from the browser by just visiting a link.

Instead, let’s use the terminal.

### 1. Method 1: Use curl

Open another terminal window and run:

```
curl -X POST http://localhost:3000/login \
	 -H "Content-Type: application/json" \
	 -d '{"username":"carlos", "password":"1234"}'
```
What we are doing is sending a **JSON object** with two fields: `username` and p`assword`. They are not variables, but **key–value pairs** in the **request body**.

Let’s break this into parts:
Part                                | Meaning
------------------------------------| ----------------------------------------------------------------------
curl                                | A command-line tool to send requests to a server
-X POST                             | We're making a **POST request** (not GET)
http://localhost:3000/login         | We're targeting the **/login route** on your server, running on port 3000
-H "Content-Type: application/json" | We're telling the server: “Hey, I’m sending you JSON data”
-d '{...}'	                      | This is the actual **data payload** you're sending, in JSON format

After running the curl commannd, we should see a response like:

```json
{
  "received": {
    "username": "carlos",
    "password": "1234"
  }
}
```

These are called **request body parameters**, and they are part of the HTTP POST request. That means: your server received the data successfully.

### Method 2: Use a test tool later (like Postman or Insomnia)

We’ll get to that soon, but curl is fine for now.

# Summary

We have just built:

- A POST route at /login
- It waits for a client to send data
- It takes that data and sends it back (echoes it)
- It proves our server can now receive information, not just serve it