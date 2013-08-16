var fs = require('fs'),
	util = require('util'),
	rsvp = require('RSVP'),
	path = require('path');

function PromiseReader ( file, encoding ) {
	var encoding = typeof encoding != 'undefined' ? encoding : 'utf8';
	var promise = rsvp.Promise(function (res, rej) {
		fs.readFile(file, encoding, function (e, d) {
			if(e)
				rej(e);
			else
				res(d);
		});
	});
	return promise;
}

function PromiseWriter ( file, content, encoding ) {
	var encoding = typeof encoding != 'undefined' ? encoding : 'utf8';
	var promise = rsvp.Promise(function (res, rej) {
		fs.writeFile(file, content, encoding, function (e, d) {
			if(e)
				rej(e);
			else
				res(d);
		});
	});
	return promise;
}

function PromiseCopy (original, copyLocation ) {
	return rsvp.Promise(function (res, rej) {
			PromiseReader(original, {encoding:null}).then(
					function (contents) {
						fs.writeFile(copyLocation, contents, function (err, data) {
								if(err)
									rej(err);
								else
									res();
							});
					},
					rej
				);
		});
}

function GetFileName (location) {
	if (!location)
		return;
	
	return path.basename(location);
}
function MarkedToID ( obj ) {
	return obj.text.toLowerCase().replace(/[^\w]+/g, '-');
}

module.exports = {
		
		// Helper Functions
		PromiseReader  : PromiseReader,
		PromiseWriter  : PromiseWriter,
		PromiseCopy    : PromiseCopy,
		GetFileName    : GetFileName,
		MarkedToID : MarkedToID,
		
		sep : path.sep
		
	};