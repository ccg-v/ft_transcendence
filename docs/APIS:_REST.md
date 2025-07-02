# REST API

## What is a REST API

**REST** (_REpresentational State Transfer_) is a set of conventions on how to structure web APIs using HTTP. \
It is not a library or tool, it’s a **design pattern** for how services communicate over HTTP. \
That means:

- You use HTTP methods like `GET`, `POST`, `PUT`, `DELETE`
- You use URLs that represent resources, like `/api/users/42`
- You exchange data in `JSON` format (usually)

## Building a REST API

To build a REST API, you typically:

1. On the **backend**:

	Install a framework that helps expose HTTP endpoints:

	+ Fastify (recommended)
	+ Express.js
	+ NestJS
	+ ...

	Example with Fastify:
	```js
	fastify.get('/api/users/:id', async (req, res) => {
		const user = await getUser(req.params.id);
		res.send(user);
	});
		```
2.  On the **client** (frontend or other service):

	You call REST endpoints using:

	- `fetch()` in JavaScript
	- `axios`, `curl`, or `http.request()`
	- Or using another backend service (e.g., Fastify calls another REST API)

## Summary

Task                       | Requires installation? | Notes
-------------------------- | ---------------------- | --------------------------------
Use REST principles	       |   ❌ No	               | REST is a convention, not a tool
Create REST endpoints	   |   ✅ Yes (framework)   | Fastify, Express, etc.
Consume REST from frontend |   ❌ No	               | Use fetch() or similar
Consume REST from backend  |   ✅ Optional	       | Use built-in http or axios