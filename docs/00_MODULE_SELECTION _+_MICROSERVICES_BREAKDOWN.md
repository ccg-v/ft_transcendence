# Types of modules

Two kinds of “modules” in the subject:

## 1. Service-Oriented Modules

These modules represent functional components that naturally map to microservices, because they provide a focused, independent behavior:

- Live Chat: Real-time system, scoped logic
- 2FA + JWT Auth: Self-contained auth logic
- Remote Pong Game: WebSockets service with game engine
- User Profile: CRUD-style service [^1}]
- OAuth Login: Belongs in same auth container

## 2. Architectural/Strategic Modules

These are design choices or framework-level decisions that affect how services are built, but don’t represent a service themselves:

- Use Fastify (backend fw): Framework choice inside services
- Use SQLite: DB engine used by each service
- Design backend as microservices: Architecture strategy itself
- Responsive Design: UI/UX implementation in frontend
- Browser Compatibility: Styling and scripting on frontend
- Multilanguage support: Rendering strategy or i18n config

Some modules are deliverables (microservices = containers = code). \
Others are architectural conventions or technology picks (they live inside those microservices or frontend components, not as standalone services). \
That clarity will help to scope the containers cleanly and avoid overengineering!

---

# High-Level Microservices Architecture

```mermaid
graph TD;
    NGINX["`**NGINX**
    (_API Gateway_)`"]-->AUTH["`**Auth**`"]-->A[("database")];
    NGINX-->USER["`**User**`"]-->B[("database")];
   	NGINX-->GAME["`**Game**`"]-->C[(database)];
   	NGINX-->CHAT["`**Chat**`"]--> D[(database)];
    NGINX-->FRONT["`**Frontend**`"]-->E("static files / SSR");
```

# Microservices Breakdown

## 1. Auth Service

Responsibilities:

- Registration/login (form + Google OAuth)
- JWT generation & verification
- 2FA setup and validation

Tech:

- Node.js + Fastify + JWT + TOTP
- Google OAuth2 library
- Database: stores credentials, 2FA secrets, token history

## 2. User Service

Responsibilities:

- Profile CRUD (username, avatar, languages) [^1]
- User stats & ranking
- Tournament logic (user assignment across games)

Tech:

- Node.js + Fastify
- raw SQLite

## 3. Game Service

Responsibilities:

- Manage Pong sessions (1v1 and multiplayer)
- Real-time game state updates via WebSocket
- Game result persistence

Tech:

- Node.js + WebSocket + game engine logic
- Physics loop per room

## 4. Chat Service

Responsibilities:

- Live chat channels (public/private)
- Message history storage
- Real-time messaging (WS)

Tech:

- Node.js + WebSocket
- Simple message persistence in SQLite

## 5. Frontend (SPA)

Responsibilities:

- Responsive UI with Tailwind CSS
- Multi-language support (i18n)
- UI for auth, game, chat, and profiles

Tech:

- React/Vue + Tailwind CSS
- i18next or Vue-i18n
- Deployed as static files or via SSR (optional)

---

# Backend vs Frontend Responsibilities

## Backend:

- Auth validation, OAuth, JWT

- Game logic and synchronization

- Chat message broadcasting and storage

- User data: profiles, stats, avatars

- SQLite DB read/write

- 2FA setup/verification

## Frontend:

- UI/UX (responsive layout, Tailwind styling)

- Language switcher and translations

- WebSocket client handling (game, chat)

- OAuth login flow (Google pop-up)

- Display user stats, chat messages, and Pong game

[^1]: CRUD stands for
  Create – Add new data
  Read – Retrieve data
  Update – Modify existing data
  Delete – Remove data
  It's the basic set of operations for managing data in a database or through an API.