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

// Route: Simple login (no hashing yet)
fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body;

    if (!email || !password) {
        return reply.status(400).send({ error: "Email and password required." });
    }

    try {
        const user = await db.get(
            "SELECT user_id, nickname, email FROM users WHERE email = ? AND password = ?",
            [email, password]
        );

        if (!user) {
            return reply.status(401).send({ error: "Invalid email or password." });
        }

        return { message: "Login successful!", user };
    } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: "Could not log in." });
    }
});

// Route: get user profile with friendships
fastify.get("/profile/:user_id", async (request, reply) => {
    const {user_id } = request.params;

    try {
        const user = await db.get(
            "SELECT user_id, nickname, email, created_at FROM users WHERE user_id = ?",
            [user_id]
        );

        console.log("User object:", user); // check if null

        if (!user) {
            return reply.status(404).send({ error: "User not found." });
        }

//        const friends = await db.all(
//            `SELECT u.user_id, u.nickname, u.email
//            FROM friendships f
//            JOIN users u ON (u.user_id = f.friend_id OR u.user_id = f.user_id)
//            WHERE (? IN (f.user_id, f.friend_id) AND u.user_id != ?)`,
//            [user_id, user_id]
//        );

        const friends = await db.all(
            `SELECT u.user_id, u.nickname, u.email
            FROM friendships f
            JOIN users u
                ON (u.user_id = CASE WHEN f.user_id = ? THEN f.friend_id ELSE f.user_id END)
            WHERE (f.user_id = ? OR f.friend_id = ?)`,
            [user_id, user_id]
        );


        console.log({ user, friends });

        return reply.send({ user, friends });

    } catch (err) {
        console.error("Profile route error:", err.message, err.stack);
        return reply.status(500).send({ error: "Could not load profile." });
    }
});

// Serve static files from 'public' folder at root URL
fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, "public"),
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
