const Fastify = require("fastify");
const sqlite3 = require ("sqlite3");
const { open } = require("sqlite");
const path = require("path");
//const fs = require("fs");

// Create Fastify instance
const fastify = Fastify({ logger: true });

// Open database connection
let db;
const initDb = async () => {
    const dbPath = path.resolve(__dirname, "ft_transcendence.db");
    console.log("Opening DB at: ", dbPath);

    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

//    const rows = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
//    console.log("Tables I can see:", rows);
};

/* --- ROUTES ------------------------------------------------------------------------- */

// Route: user registration
fastify.post("/register", async (request, reply) => {
    const { nickname, email, password } = request.body;

    if (!nickname || !email || !password) {
        return reply.status(400).send({error: "All fields are required."});
    }

    try {
        await db.run(
            "INSERT INTO users (nickname, email, password) VALUES (?, ?, ?)",
            [nickname, email, password]
        );
        return { message: "User registered successfully!" };
    } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: "Could not register user." });
    }
});

// Route: add a friendship
fastify.post("/add-friendship", async (request, reply) => {
  let { user_id, friend_id } = request.body;

  if (!user_id || !friend_id) {
    return reply.status(400).send({ error: "Missing user_id or friend_id" });
  }

    if(user_id > friend_id) {
        [user_id, friend_id] = [friend_id, user_id];
    }

  await db.run(
    "INSERT INTO friendships (user_id, friend_id) VALUES (?, ?)",
    [user_id, friend_id]
  );

  return { message: "Friendship added!" };
});

// Serve static files from 'public' folder at root URL
fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, "public"),
//    prefix: "/",
//    index: ["index.html"]
});

// Enable CORS so that the HTML page can talk to Fastify
fastify.register(require("@fastify/cors"), { origin: "*"});

// Start the server
const start = async () => {
  try {
    await initDb();
    await fastify.listen({ port: 3000 });
    console.log("Server is running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
