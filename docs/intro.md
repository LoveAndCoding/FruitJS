# FruitJS

Welcome to the FruitJS Documentation. This is your resource for learning how
to use FruitJS, as well as your guide when you forget. And, of course, this
documentation is created with FruitJS.

## What is FruitJS?

FruitJS (pronounced Fruit Juice) is a documentation generator built in Node.
It is meant to be a simple way to write your documentation in Markdown, and
have it converted to a nice site easily. Markdown has a lot of niceties in
terms of displaying code snippets, and quick edits, but isn't easy for 
those who are just looking for some technical documentation. That's when a
nice API or documentation site is key, and that's where FruitJS comes in.
Simply create your pages in Markdown, tell FruitJS how to find it, and sit
back as your documentation becomes oh so sweet.

## How can I use FruitJS?

I'm glad you're so anxious to dive in. Or at least, I'm glad I could lead you
to that. Getting started is pretty simple. Just use `npm` to install FruitJS,
and run it from the command line. You also can require it in a JS file if
you'd like to generate things on your own in JS.

	npm install FruitJS

From the command line, you can then do the following:

	fruitjs manifest.json

Or, if you prefer a script file, something like the following would work best:

	var FruitJS = new (require('FruitJS'))("My Documentation");
	
	FruitJS.addPage('my.markdown');
	FruitJS.buildMenu().then(
		function () {
			FruitJS.render();
		})
		.then(null,
		function (err) {
			// Error handling goes here
		});

Then you're site is all ready to go. By default we output your site to a folder
called output (wild, I know) right in that same folder it was run in.

## But what about *X*?

That's a great question. I have a lot of plans to include many features I feel
people will find helpful. I've got plans for extra navigation categories, themes, 
and a few other things. I've got big plans for what I hope this to be, and I 
hope to create them as quickly as I can. That said, this is just the beginning. 
This is the ground floor we're building on here. So there is still a lot of room 
to grow. If you'd like to suggest features you'd love to see, let me know on the 
GitHub issue tracker. Or, feel free to fork and go to town on your own.