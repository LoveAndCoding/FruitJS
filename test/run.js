var execFile = require('child_process').execFile,
	assert = require('assert'),
	vows = require('vows'),
	fs = require('fs-extra'),
	path = require('path'),
	
	FruitJSFile = path.resolve(__dirname, '../bin/cli'),
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
		// , "Resources/folder.gathering.manifest.json" -- Failing; see issue #30
	];

var execSuite = vows.describe('FruitJS Clean Execution');

function addTestFile(testFile, output) {
	var testObj = {};
	
	testObj['Running FruitJS against '+testFile] = {
		topic: function () {
			if(fs.existsSync(output))
				fs.removeSync(output);
			execFile('node', [FruitJSFile, testFile, '-o', output], {cwd: __dirname, timeout: 5000}, this.callback);
		},
		'we should report success' : function (err, stdout) {
			assert.include(stdout.toString(), 'success');
		},
		'we should have the proper output folder': function () {
			assert(fs.existsSync(output));
		},
		'we should have nothing in stderr': function (err, stdout, stderr) {
			assert.isEmpty(stderr.toString());
		},
		teardown: function () {
			fs.removeSync(output);
		}
	};
	
	execSuite.addBatch(testObj);
}

// For now we are simply going to run each and make sure we compile it properly without error.
// We are not doing any output checking at the moment
for(var t = 0, l = testManifestFiles.length; t < l; t++) {
	addTestFile(testManifestFiles[t], OutputFolder + '-' + t);
}

execSuite.export(module);