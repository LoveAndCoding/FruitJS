/**	Fruit.js
  *	
  *	Documentation generator from Markdown files
  *	
  *	Dependencies:
  *		- markdown-js
  *		- RSVP
  *		- LESS
  *	
  **/

var Document = require('./src/Document.js'),
	$ = require('./src/Utils.js'),
	path = require('path'),
	fs = require('fs');

function FruitJS (options, relativePath) {
	this.options = options;
	this.path = relativePath;
	this.document = new Document(options, relativePath);
	
	var doc = this.document,
		addTreeFn = function (arr, fn) {
				for(var a in arr) {
					addItemFn(arr[a], fn);
				}
			},
		addItemFn = function (itm, fn) {
				if(!fs.existsSync(itm)) {
					console.error('File not found.', itm);
					process.exit();
				} else if(fs.statSync(itm).isDirectory()) {
					var sub = fs.readdirSync(itm);
					for(var s in sub)
						sub[s] = itm + path.sep + sub[s];
					addTreeFn(sub,fn);
				} else {
					fn(itm);
				}
			};
	
	addTreeFn(options.css, doc.addCSS.bind(doc));
	addTreeFn(options.less, doc.addLESS.bind(doc));
	addTreeFn(options.js, doc.addJS.bind(doc));
	addTreeFn(options.images, doc.addImage.bind(doc));
	addTreeFn(options.assets, doc.addAsset.bind(doc));
	
	if(options.imageTitle) {
		doc.addImage(options.imageTitle);
		doc.setImageTitle(path.basename(options.imageTitle));
	}
	
	if(options.noExtraction) {
		doc.disableExtraction();
	}
	
	if(options.preMenu) {
		if(options.preMenu instanceof Array) {
			for(var p in options.preMenu) {
				doc.addBeforeMenu(options.preMenu[p]);
			}
		} else {
			doc.addBeforeMenu(options.preMenu);
		}
	}
	if(options.postMenu) {
		if(options.postMenu instanceof Array) {
			for(var p in options.postMenu) {
				doc.addAfterMenu(options.postMenu[p]);
			}
		} else {
			doc.addAfterMenu(options.postMenu);
		}
	}
	
	for(var p in options.pages)
		doc.addPage($.GetRelativePath(this.path, options.pages[p]));
	
}

FruitJS.prototype.render = function(folder) {
	return this.document.render(folder, this.options.singlePage);
}

module.exports = FruitJS;