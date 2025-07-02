# If each microservice has its own database, can they be connected?

Technically: No direct connection — each service should not access another's database.

Why?

- It breaks the "database per service" rule in microservice architecture

- It couples the services too tightly

- It introduces security and deployment complexity

Instead, communication happens through APIs — one service calls another’s HTTP (or gRPC) endpoint.

# But don't they share data, especially about users?

Yes — and that’s very common, but handled like this:
Example:

Let’s say the Game service wants the display name of a player (user ID 42).

Instead of reading the user.sqlite file, it calls:

`GET http://user-service/api/users/42`

The User service looks up the name in its own DB and returns it.

So the Game service gets the info it needs, without coupling to the user's DB.
