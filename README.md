#FruitJS

[Take a look at our documentation][1]

FruitJS (pronounced Fruit Juice) is a simple yet powerful converter to turn markdown
into HTML pages. It was created for the purpose of writing technical documentation
and API information in Markdown, and then converting it to a live site. FruitJS is
built on Node.js and can be used as an include or as a command line tool.

## Getting Started

The simple steps to get started are install it via NPM, then use the command line
tool to compile your pages to HTML.

## Manifest File

The manifest file is used to tell the script which pieces should be compiled to HTML.
It is a JSON file that should look something like this:

```json
{
	name       : "Site Name",
	pages      : ["page1.md", "folder/page2.markdown"],
	css        : ["styles.css"],
	less       : ["otherstyles.less"],
	js         : ["Extra JS Code.js"],
	images     : ["example1.png", "example2.jpg"],
	imageTitle : "path/to/logo.jpg",
	singlePage : true,
	tocLevel   : 4
}
```

For more information, read the [documentation for the manifest][2].

 [1]: http://ktsashes.github.io/FruitJS
 [2]: http://ktsashes.github.io/FruitJS/index.html#manifest-file