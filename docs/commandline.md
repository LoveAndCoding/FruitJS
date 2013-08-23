# Command Line Interface

The command line interface is likely the primary interface
in which you will work with. It is meant to be as straight-
forward as possible, only needing a small json file, and 
some optional flags and parameters for modifying behavior.

## Manifest File

The manifest file is the way to tell what pages you want to
compile into your HTML site. It will list pages, assets,
images, any extra CSS or JS, and whatever else you want to
include. The format is a simple JSON file included somewhere
in your folder structure. **Any file references in the JSON
file should be relative to the manifest files location on
disk.**

### Properties

Name | Type | Default | Description |
-- | -- | --
`name` | String | `''` | The name of your site
`pages` | Array | `[]` | An array of markdown pages that will be compiled into HTML. The order of the pages will be preserved as the order in the navigation, with the first item being the homepage.
`css` | Array | `[]` | An array of additional CSS files you'd like to include on your pages. All of the CSS files will be added to each page.
`less` | Array | `[]` | An array of additional LESS files you'd like to include on your pages. Files will be compiled to CSS and added to each page.
`js` | Array | `[]` | An array of additional JS files you'd like to include on your pages. All of the JS files will be added to each page.
`images` | Array | `[]` | An array of image files you'd like to include on your pages. Files will be put in the `images` folder, and can be referred to in your markdown from that folder
`imageTitle` | FilePath | `null` | A file path to an image or logo you'd like to display instead of your site name on each page
`singlePage` | Boolean | `false` | A flag for if all the markdown should be compiled to a single page.
`tocLevel` | Number | `6` | Number of heading levels to use in the automatically generated menu

## Command Line Arguments

### `-output FILEPATH` or `-o FILEPATH`

Folder that rendered HTML should be placed into. File path
should be absolute or relative to where the script is being
run at.

#### Format

	-o export/to/this/folder/
	-output "also/works/like this"

### `-singlePage` or `-s`

Flag that can be set to indicate that output should be on
a single page.

#### Format

	-s
