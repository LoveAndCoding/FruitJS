# Manifest File

The manifest file is the way to tell what pages you want to
compile into your HTML site. It will list pages, assets,
images, any extra CSS or JS, and whatever else you want to
include. The format is a simple JSON file included somewhere
in your folder structure. **Any file references in the JSON
file should be relative to the manifest files location on
disk.**

## Properties

Name | Type | Default | Description |
-- | -- | --
`name` | String | `''` | The name of your site
`pages` | Array | `[]` | An array of markdown pages that will be compiled into HTML. The order of the pages will be preserved as the order in the navigation, with the first item being the homepage.
`css` | Array | `[]` | An array of additional CSS files or folders you'd like to include on your pages. All of the CSS files will be added to each page.
`less` | Array | `[]` | An array of additional LESS files or folders you'd like to include on your pages. Files will be compiled to CSS and added to each page.
`js` | Array | `[]` | An array of additional JS files or folders you'd like to include on your pages. All of the JS files will be added to each page.
`images` | Array | `[]` | An array of extra image files or folders you'd like to include in your export. Files will be put in the `images` folder, and can be referred to in your markdown from that folder
`assets` | Array | `[]` | An array of extra files or folders you'd like to include in your export. Files will be put in the `images` folder, and can be referred to in your markdown from that folder
`imageTitle` | FilePath | `null` | A file path to an image or logo you'd like to display instead of your site name on each page
`singlePage` | Boolean | `false` | A flag for if all the markdown should be compiled to a single page.
`tocLevel` | Number | `6` | Number of heading levels to use in the automatically generated menu
`preMenu` | Array or Object | `null` | Menu items you'd like to add before the generated menu
`postMenu` | Array or Object | `null` | Menu items you'd like to add after the generated menu

## Additional Menu Items

Sometimes you want to add additional menu items for navigation
to other locations, files, or examples. You can do this through
the `preMenu` and `postMenu` options in the manifest. These can
be either a single object, or an array of objects of the format
below.

	{
		"Name" : <STRING> Display name of link
		"URL" : <STRING> URL to link to (Optional)
		"SubMenu" : <ARRAY> Array of SubMenu items (Optional)
	}

## Images & Links

Unless disabled, links and images referenced in your markdown
pages is automatically gathered up and placed in the appropriate
folder. You can use the `images` and `assets` properties in the
manifest file to add any additional items you'd like to include
in your exported folder, but are not referenced in your pages.