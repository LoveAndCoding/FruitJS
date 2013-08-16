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
require it in a small JS script, and use the appropriate methods to add pages
to the site. After that, just tell it where you want your stuff, and let it
do the rest. In code, it looks something like this:

	npm install FruitJS

And then in your script

	var FruitJS = new (require('FruitJS'))("My Documentation");
	
	FruitJS.addPage('my.markdown');
	FruitJS.buildMenu().then(
		function () {
			FruitJS.compile();
		})
		.then(null,
		function (err) {
			// Error handling goes here
		});

Then you're site is all ready to go. By default we output your site to a folder
called output (wild, I know) right in that same folder. Still working on the
API to change that folder, but it is all coming in time. Speaking of, that
sounds like a great way to segway into our next question.

## But what about *X*?

That's a great question. I have a lot of plans to include many features I feel
people will find helpful. I've got plans for using a manifest to generate a
site, extra navigation categories, themes, etcetera, etcetera. I've got big
plans for what I hope this to be, and I hope to create them as quickly as I
can. That said, this is just the beginning. This is the ground floor we're
building on here. So there is still a lot of room to grow. If you'd like to
suggest features you'd love to see, let me know on the GitHub issue tracker.
Or, feel free to fork and go to town on your own.