## 1. Why passwords are hashed

A hash is like a fingerprint of the password:

    Same input → always same output.

    Irreversible (you can’t get the password back from the hash).

Example with a toy hash function:

    "hunter2" → a94f...

    "hunter3" → 9b4c...

Why this is good

    If your database leaks, hackers can’t see the original passwords.

    When the user logs in:

        They type their password.

        Your server hashes it.

        You compare the hash with the one in the DB.

    You never need the original password again after hashing.

👉 Rule: You don’t need to read the password, just to check it matches.

⚠️ Important: use a slow, salted hash like bcrypt or Argon2, not plain SHA256.

    Salt = random string added before hashing so that identical passwords don’t have identical hashes.

## 2. Why 2FA secrets are encrypted

A 2FA secret is not like a password:

    You do need the original value to generate the one-time codes and validate them.

    So hashing won’t work — because you’d lose the ability to generate codes.

Instead:

    You encrypt it in the DB.

    When needed, you decrypt it to check codes.

👉 Rule: If you need to recover the exact value later, encrypt.
👉 If you only need to verify a match, hash.

## 3. Quick analogy

    Passwords: like a PIN number. You don’t need to remember the actual number, just check the hash matches when entered.

    2FA secrets: like a secret recipe. You need the real recipe each time to cook the dish, so you keep it in a locked box (encryption).

## 4. Why not hash 2FA secrets?

Because the server must regenerate the same temporary code the user sees in their Authenticator app.

    To do that, it needs the real secret.

    Hashing destroys the original, so you couldn’t generate the right code anymore.

## TL;DR

    Passwords → Hash (irreversible): you never need the original.
	

    2FA secrets → Encrypt (reversible): you must recover the original each time to generate codes.

# HASHING A PASSWORD


## 1. The naive (and unsafe) way

If you just stored the raw password:

nickname   | password
-----------+---------
carlos     | hunter2

    ❌ If someone steals your database → they have every password.

    ❌ Admins could see user passwords (bad trust issue).

That’s why we never do this.


## 2. Basic hashing

Instead of storing the password, you store its hash:

nickname   | password_hash
-----------+------------------------------
carlos     | a94f5374fce5edbc... (SHA-256)

When Carlos logs in:

    He types hunter2.

    Server applies SHA‑256 → a94f5374fce5edbc....

    Compare with stored hash.

    If they match → login successful.

Now, even if the DB leaks, the raw password isn’t visible.


## 3. The rainbow table problem 🌈

Hackers can precompute common hashes:

    123456 → 8d969eef6ecad3c29a3a629280e686cf...

    password → 5f4dcc3b5aa765d61d8327deb882cf99

So they just look up the hash in a “rainbow table”.
Oops — now your “secure” hash is cracked instantly.


## 4. Adding a Salt (the secret ingredient 🧂)

A salt is a random string added to each password before hashing.

Example:

    Password: hunter2

    Salt: X9f!2k

    Hash: SHA‑256(hunter2X9f!2k) → 9a6b...

Now, even if two people use hunter2, their hashes will differ, because each salt is unique.

    You store the salt alongside the hash (it’s not secret).

    Rainbow tables become useless, since they’d need one for every possible salt.


## 5. Making it slow 🐢

Modern CPUs can compute billions of SHA‑256 hashes per second.
So we use slow hashing algorithms designed for passwords:

    bcrypt

    Argon2 (modern and recommended)

    PBKDF2

They:

    Repeat hashing many times.

    Consume memory.

    Make brute‑force attacks painfully slow.


## 6. What the DB finally stores

Example (conceptually):

nickname   | password_hash
-----------+----------------------------------------------------------
carlos     | $argon2id$v=19$m=65536,t=3,p=4$Z3l7dGhKVm...$lk53fC2...

This string contains:

    Algorithm used

    Salt

    Number of iterations

    Final hash

So when you check a login, the library reads all that info and does the same steps.


## ✅ The rule

    Never invent your own hash function.

    Always use a proven library (bcrypt, argon2, pbkdf2).

⚡So, hashing a password =
Hash( password + salt, using a slow algorithm )
→ Store result in DB
→ On login, repeat and compare