# FruitJS

Welcome to the FruitJS Documentation. This is your resource for learning how
to use FruitJS, as well as your guide when you forget. And, of course, this
documentation is created with FruitJS.

FruitJS (pronounced Fruit Juice) is a documentation generator built in NodeJS.
It is meant to be a simple way to write your documentation in Markdown, and
have it converted to a nice site easily. Markdown has a lot of niceties in
terms of displaying code snippets, and quick edits, but isn't easy for 
those who are just looking for some technical documentation. That's when a
nice API or documentation site is key, and that's where FruitJS comes in.
Simply create your pages in Markdown, tell FruitJS how to find it, and sit
back as your documentation becomes oh so sweet.

## Features

 - Renders all your markdown straight to HTML
 - Generates menu based on headers in markdown files
 - Automatically converts links between markdown pages
 - Grabs images and local files referenced and adds them to the export
 - Customizable with your own CSS, JS, and LESS files
 - Can render to a single HTML file, or split the rendering up

## Usage

You can use `npm` to install FruitJS, and run it from the command line.
You also can require it in a JS file if you'd like to generate things
on your own in JS.

	npm install fruitjs -g

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

## Contributing

FruitJS is available under the MIT license for anyone to use as they please. If
you'd like to help out, feel free to [fork us][1], and check out our [issues][2]
for current tasks and planned features.

 [1]: https://github.com/ktsashes/FruitJS
 [2]: https://github.com/ktsashes/FruitJS/issues