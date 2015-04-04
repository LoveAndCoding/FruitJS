# Code API

## `FruitJS` Constructor

	new FruitJS ( Title[, OutputDir[, RelativeLocation]] )

Creates a new `FruitJS` object. This object is the primary object for creating and 
rendering documentation sites.

### Parameters

Name | Required | Type | Description
--- | --- | --- | ---
Title | Yes | `String` | The title of the documentation. This will be used as the title in the browser window and on the page.
OutputDir | No | `String` | Directory to output to. Relative to current running directory. Default is `output`
RelativeLocation | No | `String` | Relative location from which to pull files. Default is current working directory

### Returns

New `FruitJS` object

### Examples

	var FruitJS = require('FruitJS');
	var docs = new FruitJS("My Documentation Site")

## `addAsset`

	.addAsset( FilePath )

Adds a file to the output. This file will be copied over to an asset folder in the output
directory.

### Parameters

Name | Required | Type | Description
--- | --- | --- | ---
FilePath | Yes | `String` | The path to the file, relative to `RelativeLocation`

### Returns

Returns `FruitJS` object after adding script to allow chainability.

### Examples

	docs.addCSS('myStyles.css');

## `addCSS`

	.addCSS( FilePath )

Adds a CSS file to the output. This file will be copied over to a css folder in the output
directory and will be included on every page.

### Parameters

Name | Required | Type | Description
--- | --- | --- | ---
FilePath | Yes | `String` | The path to the file, relative to `RelativeLocation`

### Returns

Returns `FruitJS` object after adding script to allow chainability.

### Examples

	docs.addCSS('myStyles.css');

## `addImage`

	.addImage( FilePath )

Adds an image file to the output. This file will be copied over to a images folder in 
the output directory. To use this image in your script, simply use it the same as you
would in standard markup, but refer to the image in the images directory.

### Parameters

Name | Required | Type | Description
--- | --- | --- | ---
FilePath | Yes | `String` | The path to the file, relative to `RelativeLocation`

### Returns

Returns `FruitJS` object after adding script to allow chainability.

### Examples

	docs.addImage('myLogo.png');

In Markdown, you can place this image now using

	![My Companies Name](images/myLogo.png)

## `addJS`

	.addJS( FilePath )

Adds a JS file to the output. This file will be copied over to a js folder in the output
directory and will be included on every page.

### Parameters

Name | Required | Type | Description
--- | --- | --- | ---
FilePath | Yes | `String` | The path to the file, relative to `RelativeLocation`

### Returns

Returns `FruitJS` object after adding script to allow chainability.

### Examples

	docs.addJS('myStyles.css');

## `addLESS`

	.addLESS( FilePath )

Compiles a LESS file and adds it to the list of CSS for each page to use. This file
will be copied over to a css folder in the output directory. **Note: The name for
this file will have the same name as the LESS file, except it will change the
extension to .css if it is not already. This means you should note try to include
a LESS file and CSS file that have the same name.**

### Parameters

Name | Required | Type | Description
--- | --- | --- | ---
FilePath | Yes | `String` | The path to the file, relative to `RelativeLocation`

### Returns

Returns `FruitJS` object after adding script to allow chainability.

### Examples

	docs.addLESS('myLESSStyles.less');

## `addPage`

	.addPage( FilePath, Title[, IsHomepage] )

Adds a markdown page. This page will be added to automatic page menu building, and
headings in this file will be parsed into submenu entries. The optional last
parameter is used for marking a page as the homepage. If more than 1 page is marked
as the homepage, the last one marked will become the homepage. If no homepage is
provided, the first page added will be used. The order in the menu will be the order
that the pages are added in.

### Parameters

Name | Required | Type | Description
--- | --- | --- | ---
FilePath | Yes | `String` | The path to the file, relative to `RelativeLocation`
Title | Yes | `String` | The title of the page. This will be used when building the menu, and in the window title
IsHomepage | No | `Boolean` | `TRUE` if this page should be used as the homepage. Defaults to `FALSE`

### Returns

Returns `FruitJS` object after adding script to allow chainability.

### Examples

	docs.addPage('intro.md', 'Getting Started', true)
		.addPage('section1.md', 'REST API');

## `buildMenu`

This will use all current pages, and build an automatic menu from them. This will
parse through each page to determine the header levels, and build submenus based
on the headers of each page. This will override any previously created menus.

Submenus will be created based on the heading level of the current and the previous
heading. That is to say, if the current heading is an `h3`, and the last heading
was an `h2`, we will put the `h3` heading as a submenu under the `h2` heading.

**Note: This process is asynchronous. A [promise][2] is returned that will resolve when
the menu has finished being created. [Rendering][1] should be done after this is
complete.**

### Parameters

<table>
	<tr>
		<th>Required</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>No</td>
		<td><code>Integer</code></td>
		<td>
			The level of headings to include in a submenu. For example, a value of 
			<code>2</code> will include <code>h1</code> and <code>h2</code> tags, 
			but will not include <code>h3</code> or above in the menu generation
		</td>
	</tr>
</table>

### Returns

A [`Promise` object][2]. Promise will be resolved upon completion of the task, or
rejected if we encounter an error.

### Examples

	docs.buildMenu(3)
		.then( function () {
			console.log('Menu was created');
		});

## `render`

This compiles all of the markdown, and writes the files to a folder `output` in the
directory where the script is being run.

**Note: This process is asynchronous. A [promise][2] is returned that will resolve when
the markdown has finished being written out.**

### Parameters

<table>
	<tr>
		<th>Required</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td colspan="3">
			NONE
		</td>
	</tr>
</table>

### Returns

A [`Promise` object][2]. Promise will be resolved upon completion of the task, or
rejected if we encounter an error.

### Examples

	docs.render()
		.then( function () {
			console.log('Our documentation has come into existence!');
		});

## `setImageTitle`

Allows you to set a specific image that has been added to be displayed as a logo in
the navigation area (with the default theme). This image will be used instead of your
title on the main page (though the original title set will still be used on for the
window title). The `alt` text will be your original title text as well.

### Parameters

<table>
	<tr>
		<th>Required</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>Yes</td>
		<td><code>String</code></td>
		<td>Name of the image that was added previous to use as a logo</td>
	</tr>
</table>

### Returns

Returns `FruitJS` object after adding script to allow chainability.

### Examples

	docs.addImage('folder/myLogo.png')
		.setImageTitle('myLogo.png');

 [1]: #render
 [2]: https://github.com/tildeio/rsvp.js