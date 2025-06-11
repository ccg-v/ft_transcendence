# BACKEND OR NO BACKEND?

When the subject says says _"You are free to develop the site, with or without a backend"_, it means we can either:
- Have a backend server that handles business logic, API requests, etc.
- Or build everything on the frontend side, interacting directly with external services (in what is called a pure frontend app, or a serverless approach).

## Path 1 — With Backend (traditional fullstack)

In this model, our app will have:

1. A frontend (TypeScript, Tailwind, BabylonJS, etc.)
2. A backend (PHP or Node.js) that:
	- Processes requests
	- Handles authentication
	- Talks to a database (SQLite)
	- Manages matchmaking, user profiles, rankings, chat messages, etc.
	- May also interact with blockchain (Avalanche)

The frontend communicates with the backend via REST API or WebSockets.

## Path 2 — Without Backend (frontend-only app)

In this approach, frontend directly communicates with:
- 3rd-party services (for authentication, storage, etc.)
- Blockchain directly from the client (Avalanche can be called directly via MetaMask or Web3 libraries)
- A public serverless database or cloud service (rare here, but technically possible)

The app should be fully written in TypeScript + BabylonJS + Tailwind, and everything run directly in the user's browser.

For *ft_transcendence* specifically, this might look like:
- Login: Use OAuth or direct Web3 wallet authentication.
- Game logic: BabylonJS directly in browser.
- Matchmaking: Possibly peer-to-peer or use browser APIs (WebRTC — complicated).
- Persistent storage: Use blockchain for state, or a 3rd-party API for rankings.
- No centralized server at all.

## Approaches pros and cons

Path 2 (no backend) is harder to pull off in *ft_transcendence* because:
- We'd need to reinvent several mechanisms (matchmaking, real-time gameplay, ranking system, etc.) on the frontend side.
- WebSockets (for real-time) are normally run through a backend.
- Blockchain is not sufficient for everything (chat, scores, etc.).

Anyway, the path is allowed in order to:
- Expose us to modern "serverless" concepts.
- Let us experiment with decentralized architectures.
- Force us to think critically about what work happens on the server, and what can happen in the browser.

But in practice, **the backend path is easier to control, easier to test and more familiar architecture for a full web app.**

---

# Project steps

✅ Start with a backend approach, even if minimal.\
✅ Build a PHP backend with a REST API and SQLite DB.\
✅ Use Node.js only if you enable the optional "Framework module" (which may allow you to use Express.js or NestJS).\
✅ Let the frontend consume your backend's API.

# Stack to begin with

| Layer	     | Tech	                              | Use
| ---------- | ---------------------------------- | ---
| Frontend   |	TypeScript + Tailwind + BabylonJS | UI, Game rendering
| Backend    |	PHP (pure)	                      | API for users, matches, ranking
| Database   |	SQLite	                          | Store users, games, scores
| Blockchain |	Avalanche	                      | Store important immutable game results
| Deployment |	Containerd	                      | Package your services
