# What is an API

**API** stands for _Application Programming Interface_. Its fundamental role is to allow communication between two or more elements or systems.

There are different types of APIs. One of the best known is the API offered by Windows to access the resources of the operating siystem and build applications on it. Another type of API and the focus of our attention is the type of data transport between systems, being widely used today.

# API Architectures for Data Transport

Given their wide use, data transport APIs can be organized or implemented in different ways. Differences among them lay on  data formatting and the way the communication rules are defined. Let's see some types of API architecture for data transport:

1. **REST** (_Representational State Transfer_), is currently the most used architecture, uses the http protocol as a basis for the transport of data, each request or operation is independent and performs a complete task, i.e. there is no dependence between operations.

2. **GraphQL**

3. **Websocket**. It is an architecture based on the concept of socket, which through the TCP protocol, creates a direct connection between 2 points and keeps it open, so that any operation is executed in the shortest possible time. It is suitable for cases where communication must be done in real time.

4. **Webhook**

5. **RPC** and **gRPC**

6. **Soap**

https://blog.postman.com/different-types-of-apis/

# Protocols in ft_transcendence

All the backend services in ft_transcendence can (and probably will) use Node.js, but with some differences:

Service	     | Primary protocol	       | Why
------------ | ----------------------- | ---------------------------------------------------------------
Auth	     | HTTP/REST (via Fastify) | Traditional CRUD[^1]: login, register, tokens, etc.
User Profile | HTTP/REST	           | Simple data endpoints (e.g., GET /user/:id)
Chat	     | WebSockets (WS)	       | Real-time communication: new messages, typing, channel presence
Game	     | WebSockets (WS)	       | Real-time game state: paddle positions, ball movement, etc.

### Why use WebSockets for Chat and Game?

Because these are real-time, bidirectional communication systems, where:

- The client needs to receive push updates from the server (not just request/response).
- You want low-latency, persistent connections.
- REST is inefficient for this kind of interaction.

Example differences:

Action	               | REST (Fastify)	         | WebSocket
---------------------- | ----------------------- | -----------------
Send login credentials | ✅ POST /login	        | ❌ Not necessary
Fetch user stats	   | ✅ GET /user/123	    | ❌ Not ideal
Receive new chat msg   | ❌ polling or long-poll	| ✅ push instantly
Move player paddle	   | ❌ not real-time	    | ✅ 60fps updates

### So how does this affect the *ft_transcendence* architecture?

- The _Auth_, _User_, and similar services expose Fastify-based HTTP APIs.
- The _Chat_ and _Game_ services expose WebSocket servers (still in Node.js, possibly using libraries like ws, socket.io, or Fastify’s WS plugin).

**But all of them are still built with Node.js — they just expose different types of endpoints.**

[^1]: **CRUD** stands for **C**reate, **R**ead, **U**pdate and **D**elete. It's the basic set of operations for managing data in a database or through an API: add new data, retrieve data, modify existing data and remove data.