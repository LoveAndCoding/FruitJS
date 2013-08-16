/**	Command Line Interface
  *	
  **/

var FruitJS = require('./fruit.js'),
	$ = require('./src/Utils.js'),
	path = require('path'),
	argv = require('optimist')
			.options({
				'o':{
						'alias':'output',
						'default':'./output/'
					},
				's':{
						'alias':'singlePage',
						'boolean':true,
						'description':'Flag indicating that all markdown should be exported to a single page'
					}
			})
			.argv;

var manifest = argv._[0];

function getRelativePath(file) {
	return path.resolve(path.dirname(manifest)+path.sep+file);
}

$.PromiseReader(manifest).then(function (fest) {
	json = JSON.parse(fest);
	try{
	var doc = new FruitJS(json.name || "Docs");
	
	for(var c in json.css)
		doc.addCSS(getRelativePath(json.css[c]));
	
	for(var l in json.less)
		doc.addLESS(getRelativePath(json.less[l]));
	
	for(var i in json.images)
		doc.addImage(getRelativePath(json.images[i]));
	if(json.imageTitle)
		doc.addImage(getRelativePath(json.imageTitle)).setImageTitle(path.basename(json.imageTitle));
	
	for(var p in json.pages)
		doc.addPage(getRelativePath(json.pages[p]));
	
	doc.buildMenu(json.tocLevel || 6, argv.s).then(function () {
				return doc.render(argv.s);
			})
		.then(function () {
				console.log('Rendered');
			},
			function (err) {
				console.error(err);
			});
	}catch(e){console.error(e);}
}, function (err) {
	console.error('Unable to read file '+manifest);
	console.error(err);
});