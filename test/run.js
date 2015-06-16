var execFile = require('child_process').execFile,
	assert = require('assert'),
	fs = require('fs-extra'),
	path = require('path'),
	
	FruitJS = require('../fruit.js'),
	OutputFolder = path.resolve(__dirname, 'test-output'),
	
	testManifestFiles = [
		"Generation/Headers/uniqueid.manifest.json"
		, "Links/crosspage.multipage.manifest.json"
		, "Links/crosspage.singlepage.manifest.json"
		, "Menu/post.array.manifest.json"
		, "Menu/pre.array.manifest.json"
		, "Menu/post.object.manifest.json"
		, "Menu/pre.object.manifest.json"
		, "Menu/post.object.sub.manifest.json"
		, "Menu/pre.object.sub.manifest.json"
		, "Resources/automated.gathering.manifest.json"
		, "Resources/folder.gathering.manifest.json"
	];

describe('FruitJS Clean Execution', function () {
	// For now we are simply going to run each and make sure we compile it properly without error.
	// We are not doing any output checking at the moment
	for(var t = 0, l = testManifestFiles.length; t < l; t++) {
		describe(testManifestFiles[t], (function (testFile, output) {
			
			before(function (done) {
				if(fs.existsSync(output))
					fs.removeSync(output);
				
				var manifestFile = path.resolve(__dirname, testFile),
					manifest = JSON.parse(fs.readFileSync(manifestFile, {encoding:'utf8'})),
					
					fruit = new FruitJS(manifest, manifestFile);
				
				return fruit.render(output).then(function () {
					done();
				}, done);
			});
			
			it('should have the proper output folder', function () {
				assert(fs.existsSync(output));
			});
			
			after(function () {
				fs.removeSync(output);
			});
			
		}).bind(this, testManifestFiles[t], OutputFolder + '-' + t));
		
	}
	
});