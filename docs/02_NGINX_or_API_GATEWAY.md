
# What is an API Gateway

It's not essential to have a full-fledged API gateway like NGINX, but it's very common and highly recommended in production[^1]. So, what is an **API Gateway**, really?

An **API gateway** is not _a specific technology_ — it's a **pattern**: just a concept, a general abstract idea. The API Gateway pattern solves the problem of exposing multiple internal services to external clients via a single entry point.
- It sits between the client and your backend services.
- It routes, filters, modifies, and secures traffic.
- Advanced gateways (like Kong, API Gateway from AWS, etc.) can also:
	- Rate-limit requests
    - Authenticate users
    - Aggregate multiple APIs
    - Transform data formats

	But those features are not required — they're just common variations of the pattern.

# Using an API Gateway in *ft_transcendence_*
In our ft_transcendence, **we can run Node.js standalone**, directly on port 80 or 444. It will still work, but it won't handle:
- SSL
- Load balancing
- Static files
- Fine-grained request control

Alternatively, we can **add NGINX just as a reverse proxy** without any “gateway” features.
- Just forwards requests, nothing more.
- Still not technically a “gateway”.

Or we can **configure NGINX to behave like a _real_ API gateway**.
- Add routing rules, security headers, rate limits, etc.
- Now it's functioning as a gateway.

There are alternatives to NGINX, all of them with their own pros and cons. The choice depends on use case, team experience and deployment needs:

Feature/Tool                     | NGINX                           | Apache [^2]                    | Caddy                       | Traefik                      | Node.js alone
-------------------------------- | ------------------------------- | ------------------------------ | --------------------------- | ---------------------------- | -------------
Ease of setup                    | 🟡 Medium                       | 🔴 Harder                      | 🟢 Very easy                | 🟡 Medium	                 | 🟢 Very easy
Performance	                     | 🟢 Excellent                    | 🟡 Decent                      | 🟢 Excellent	              | 🟢 Excellent                 | 🟡 Good
Reverse proxy                    | 🟢 Yes	                       | 🟢 Yes	                        | 🟢 Yes	                  | 🟢 Built-in + dynamic	     | 🟢 Possible, but minimal
SSL support	                     | 🟡 Manual + Certbot	           | 🔴 Manual + modules            | 🟢 Built-in with auto-renew | 🟢 Built-in (Let's Encrypt)  | 🔴 Manual and risky
Configuration format             | Text config files               | Text config files              | Minimal, human-friendly     | TOML/YAML                    | Code (JS/TS)
Dynamic routing (auto-discovery) | 🔴 No	                       | 🔴 No	                        | 🔴 No	                      | 🟢 Yes (Docker, K8s)	     | 🔴 No
Static file serving	             | 🟢 Yes	                       | 🟢 Yes	                        | 🟢 Yes	                  | ⚠️ Not main goal	          | ⚠️ Basic
Best for...	                     | High performance reverse proxy,<br>static + dynamic sites | Legacy setups,<br>PHP-heavy sites | Personal projects, fast SSL | Microservices, dynamic infra | Dev/testing, internal tools

[^1]: _Production_ is the live environment where your application is used by real users, doing real work, with real consequences. It is the last phase in the sofware creation process:
  development -> testing -> staging ("final dress rehearsal") -> production.
  Since its the actual deployed app that people use, it needs to be fast, secure, and stable.

[^2]: **Apache** and NGINX can both act as reverse proxies. But **Apache** is a _web server first_, and **NGINX** is a _reverse proxy first_. For modern setups, NGINX is the cleaner, lighter, and more focused tool.