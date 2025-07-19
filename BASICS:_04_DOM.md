# DOM (Document Object Model)

## What is the DOM

**DOM** stands for _Document Object Model_. It's a live representation of the structure and content of a web page, like a tree made of all the elements in the HTML.

We can think of the DOM as a JavaScript-accessible model of the HTML structure of the page:

- Te actual HTML file is like a blueprint.

- The browser reads this HTML and builds a DOM tree in memory — like assembling Lego bricks based on the blueprint.

- JavaScript can then:

	+ Create new bricks (elements)

	+ Change existing bricks (like text, color, position)

	+ Remove bricks

**The DOM is not the HTML file. It’s a live structure the browser creates and updates.**

## Example

Let's say we have this _index.html_ file:

```html
<body>
  <div id="gameZone"></div>
  <p id="instructions">Press Space to start</p>
</body>
```

The DOM tree looks like:

```less
Document
└── html
    └── body
        ├── div#gameZone
        └── p#instructions
```

We can access and manipulate these elements with JavaScript:

```js
const instructions = document.getElementById("instructions");
instructions.textContent = "Level 2!";
instructions.style.color = "red";
```

We are not changing the HTML file on disk, **we are changing the DOM in memory**, and the browser reflects that instantly on screen.

## DOM is Live and Dynamic

We can:

- `createElement()`: Make new DOM nodes

- `appendChild()`: Insert them into the tree

- `removeChild()`: Delete them

- `setAttribute()` or `style`: Change how they look or behave

## DOM is a Browser API

The browser gives us a special object called document. This is our entry point to the DOM.

```js
document.querySelector("div");       // get first div
document.createElement("div");       // create a new div
document.body.appendChild(myDiv);    // add it to the body
```

## Summary

Term	     | Meaning
------------ | -------------------------------------------------------------------
**DOM**	     | A live tree structure of your web page built from the HTML
`document`   | The JavaScript object that gives access to the DOM
`element`    | Any single HTML item in the DOM (like a div or p)
Modify DOM   | Using JS to create, change, or delete parts of the page dynamically