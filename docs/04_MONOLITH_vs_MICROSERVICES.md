# Microservices

In the context of ft_transcendence,

> A microservice is a containerized, independently runnable service that owns a specific business capability, has its own codebase, and communicates over HTTP/WebSocket with the rest of the system.

It doesn't need to be over-engineered — just reasonably modular and network-isolated. 

Microservices should represent independent business domains. If the answer to the question: _"Would it make sense to scale, develop, or deploy this separately someday?"_ is yes, it's a good candidate for a microservice.

# Microservices architecture

In a true microservices architecture, there is no single "backend" microservice. Instead, what we traditionally call "the backend" is split into multiple smaller services, each with its own responsibility and API.

In a monolithic architecture	                  | In microservices architecture
------------------------------------------------- | ---------------------------------------------------
One big backend project (Node.js/Express/Fastify) | Many small, focused backend services
Shared database	                                  | Each service owns its data (or schema)
Centralized business logic	                      | Distributed, isolated responsibilities
One container or process	                      | One container per service
One port/API	                                  | Many internal APIs (all routed by NGINX or similar)


Just to be crystal clear:
- There is no separate "Backend Service" in microservices.
- The "backend" becomes a network of services, each doing one part of the backend job.


# Good candidates for microservices in _ft_transcendence_

## 1. Auth Service

Handles login, signup, JWT token generation, OAuth (42 API), 2FA, etc.
- **Why**: Auth logic is distinct and often changes independently.
- **Pros**:
	+ Clear interface (/login, /register, /refresh)
	+ Reusable across apps (e.g., admin panel, mobile app)
- Bonus: You can secure all other services behind token validation.

## 2. Game Service 

Manages pong game sessions, scores, WebSockets, and real-time updates.
- **Why**: Game logic is computationally and conceptually distinct.
- **Pros**:
	+ Easier to scale independently (real-time = resource-intensive)
	+ Can be developed/tested without touching auth or chat
- Structure: Could expose /start, /move, /end, WebSocket room handling

## 3. Chat Service

Handles real-time messaging, message persistence, private/public channels.

- **Why**: Real-time chat has a different lifecycle and state model than games or auth.
- **Pros**:
	+ Easier to isolate via WebSockets
	+ Can use in-memory data + persistence layer (Redis + SQLite/Postgres)

## 4. User Profile Service

Manages avatars, usernames, rankings, stats.

- **Why**: CRUD-heavy[^1], fits classic REST model.
- **Pros**:
	+ Easily cacheable
	+ Doesn’t require real-time interaction
	+ Could be backed by a small DB of its own


[^1]: **CRUD** stands for **C**reate, **R**ead, **U**pdate and **D**elete.
  It's the basic set of operations for managing data in a database or through an API: add new data, retrieve data, modify existing data and remove data. \
  **CRUD-heavy** means the service is mainly focused on creating, reading, updating, and deleting data — lots of forms, database entries, and user input/output. \
  In the User Profile Service, most of the logic is creating or editing a user profile (fetching stats or rankings, udating avatars or language settings, deleting accounts, ...). It doesn’t involve complex real-time behavior or business logic, just structured data operations, which are ideal for REST APIs.
