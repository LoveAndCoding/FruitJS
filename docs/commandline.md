# Command Line Interface

The command line interface is likely the primary interface
in which you will work with. It is meant to be as straight-
forward as possible, only needing a small json file, and 
some optional flags and parameters for modifying behavior.

## Use

	fruitjs <Manifest File> <Options>

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

### `-disableExtraction` or `-x`

Flag to *disable* the automated extraction of files, images
and links to include all referenced local files into the
export

#### Format

	-s
