We do not need a separate database container.

Why?

- **SQLite** is not a service — it's a **file-based database**.

- Our _Node.js_ app reads and writes directly to a .sqlite file.

So: the database lives inside our app container (or ideally, in a mounted volume).

What we do need is a Docker volume or bind mount to store the .sqlite file persistently.

```yaml
volumes:
  - user-data:/app/data  # stores user.sqlite
```

When would we need a dedicated DB container?

Only if we're using a real database engine like:

- MariaDB / MySQL

- PostgreSQL

- MongoDB

- Redis

These run as database services, so we would:

- Run them in their own containers

- Communicate with them over a network (e.g., mariadb:3306)

- Still mount volumes for persistent storage

To sum up,

 - **No DB container needed for SQLite**

 - **But volume needed to store `user.sqlite` outside the container’s filesystem**



