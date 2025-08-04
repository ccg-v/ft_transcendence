# Building a basic web server with Fastify

Let's start from zero and build up a very simple Node.js web server using Fastify.
First, what are these tools?

- **Node.js** is a runtime that lets you run JavaScript code outside the browser (on your computer or server). Think of it like Python or C, but for JavaScript.

- **Fastify** is a web framework for Node.js. It helps you build web servers easily — handling routes, requests, and responses fast and cleanly.

## 1. Prerequisites

Check if we have `Node.js` and `npm` installed:

```bash
	node -v
	npm -v
```

### Installing Node.js

If `Node.js` is not installed, we can either go to the `Node.js` archive (https://nodejs.org/en/download/releases), download the desired Linux binary (12.22.9 is the version installed in campus computers), extract and install:

```bash
	tar -xJf node-v12.22.9-linux-x64.tar.xz
	sudo mv node-v12.22.9-linux-x64 /opt/node12
	sudo ln -s /opt/node12/bin/node /usr/local/bin/node
	sudo ln -s /opt/node12/bin/npm /usr/local/bin/npm
```

or use the **Node Version Manager (nvm)**. that lets you install multiple versions of Node.js, but it doesn't "lock" your terminal to one of them permanently:

- Install **nvm** (if not installed):

	`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`

- Restart the terminal, then check:

	`command -v nvm`

- Install Node.js 12.22.9 (the campus version):

	`nvm install 12.22.9`

- Use it:

	`nvm use 12.22.9`

- Set it as default (optional):

    `nvm alias default 12.22.9`

### Installing Node Package Manager (npm)

You don’t install npm separately, it comes bundled automatically with Node.js.
`npm` is the default package manager for Node.js. It is used it to:

- Install JavaScript libraries (called "packages") like Fastify, Express, etc.
- Manage those dependencies in a file called package.json
- Run project scripts (e.g., npm start, npm test)
- Publish your own packages to the public npm registry

For example:

`npm install fastify`

This command downloads the Fastify package and saves it into your project under `node_modules/`. You can think of `npm` like `apt` (on Ubuntu) or `pip` (in Python), but for JavaScript/Node.js.

## 2.  Building the Fastify Web Server step-by-step

1. Create a new folder

```bash
	mkdir my-fastify-server
	cd my-fastify-server
```

2. Initialize the project

	`npm init -y`

	This creates a `package.json` file that keeps track of your project dependencies.

3. Install Fastify

	`npm install fastify@3`

	We force to install the latest stable v3 to ensure compatibility with the old version of Node.js installed in campus

4. Create a JavaScript file (your server)

	`touch server.js`

5. Open it in an editor and paste the following code:

```js
	// Import Fastify [1]
	const fastify = require('fastify')({ logger: true })

	// Define a basic route [2]
	fastify.get('/', async (request, reply) => {
	return { message: 'Hello, ft_transcendence!' }
	})

	// Start the server
	const start = async () => {
	try {
		await fastify.listen({ port: 3000, host: '0.0.0.0' })
		console.log('Server is running at http://localhost:3000')
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
	}

	start()

	/* [1]	This loads Fastify and enables logging (so you see what's happening).
	 *
	 * [2]	This defines what happens when someone visits / (your home page).
	 * 			return { message: "..." } 
	 * 		sends a JSON response to the client.
	 * 
	 * [3]	The `start` function starts the server on port 3000 and shows a message
	 * 		in the terminal.
	 */ 
```

6. Run the server

	`node server.js`

	We should see something like:

	> Server is running at http://localhost:3000

	Now open the browser and go to http://localhost:3000

	We should see:

	`{ "message": "Hello, ft_transcendence!" }`
