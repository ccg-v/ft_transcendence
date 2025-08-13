# CORS

**CORS** stands for _Cross-Origin Resource Sharing_. It’s basically the “international travel visa” system of the web. \

By default, web browsers are strict. A page loaded from **one origin** (e.g., `http://localhost:5173`) is not allowed to make AJAX/fetch requests to a **different origin** (e.g., `http://localhost:3000`) unless the server **explicitly** says “Yes, I allow this origin to talk to me.” \

This is for **security reasons**, so a malicious site can’t secretly make requests to your private backend and read sensitive data.

## What is an origin?

Origin:
```js
scheme://hostname:port
```
Example:

- `http://localhost:5173` → scheme = `http`, hostname = `localhost`, port = `5173`

- `https://mydomain.com` → scheme = `https`, hostname = `mydomain.com`, port = default 443

If any of these three differ, the browser considers it a **different origin**.

## Generic vs. specific origin

When we configure:

```js
origin: '*'
```

We are saying that we allow requests from **any website** to call my API. \

Pros: 
- Works instantly for all frontends.
- No CORS headaches in development.

Cons:
- In production, this means **any site** on the internet could make requests to your backend (if they know your API and it doesn’t require authentication).

Instead:

```js
origin: 'http://localhost:5173'
```
or in production:

```js
origin: 'http://myfrontend.com'
```

This means: "Only my frontend (and only from this specific URL) can call me." \

For local development, ```origin: '*'``` is commonly used to avoid constant CORS errors. But in production it should be replaced with ```origin: 'https://your-frontend-domain.com``` to prevent unwanted requests from random sites.