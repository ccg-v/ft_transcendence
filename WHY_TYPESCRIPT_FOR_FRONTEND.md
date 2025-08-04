# WHY USE TYPESCRIPT FOR FRONTEND?

## Browsers and JavaScript vs. TypeScript

- **Browsers only understand JavaScript.** \
	If you give them TypeScript code directly, they won’t run it.

- TypeScript is like a **“super‑JavaScript.”** \
    You write in TypeScript, then a tool (the TypeScript compiler) turns it into plain JavaScript that the browser can run.

## Why use TypeScript

The key reasons are about **safety, clarity, and teamwork**:

### 1. Type safety

- In JavaScript, you can accidentally treat a number like a string and only discover the bug at runtime.

- TypeScript warns you right when you write the code.
    Example:

	```ts
		let age: number = 25;
		age = "twenty"; // ❌ Error in TypeScript, but JS would allow it until runtime
	```

### 2. Better autocomplete and hints

- Your editor (like VS Code) understands your data structures better with TypeScript.
- This saves tons of time, especially in big projects with many files.

### 3. Teamwork clarity

- With many students working together, having explicit types makes it easier to understand what a function expects and returns.

    Example:

	```ts
        function addFriend(userId: number, friendId: number): Promise<boolean> { ... }
	```
    Even if you’ve never seen the code, you already know what it does.

### 4. Scalability

- As the ft_transcendence project grows (with chat, tournaments, Pong/Breakout, etc.), TypeScript helps keep everything organized and less buggy.

## The workflow

This is what will happen in the project:

1. You write frontend code in TypeScript (`.ts` or `.tsx` files).
2. You run the TypeScript compiler (`tsc`) or a bundler (like **Vite** or **Webpack**) that does it for you.
3. The compiler produces JavaScript.
4. The browser runs the JavaScript, not the TypeScript.

So:
- Developers see TypeScript.
- Browsers see JavaScript.

