var fs = require('fs'),
	util = require('util'),
	rsvp = require('rsvp'),
	path = require('path'),
	mkdirp = require('mkdirp');

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
		mkdirp(path.dirname(file), function (err) {
			if(err)
				rej(err);
			else
				fs.writeFile(file, content, encoding, function (e) {
					if(e)
						rej(e);
					else
						res();
				});
		});
	});
	return promise;
}

function PromiseCopy (original, copyLocation ) {
	return rsvp.Promise(function (res, rej) {
			PromiseReader(original, {encoding:null}).then(
					function (contents) {
						PromiseWriter( copyLocation, contents, {encoding:null} ).then( res, rej );
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

function GetRelativePath(origin, file) {
	return path.resolve(path.dirname(origin)+path.sep+file);
}

function MarkedToID ( obj, ids ) {
	var baseid = obj.text.toLowerCase().replace(/[^\w]+/g, '-');
	
	if(baseid[0] == '-')
		baseid = 'id'+baseid;
	
	if(ids && ids.indexOf(baseid) >= 0) {
		var uid = 0;
		do {
			uid++;
		} while(ids.indexOf(baseid+uid) >= 0);
		baseid += uid;
	}
	
	return baseid;
}

module.exports = {
		
		// Helper Functions
		PromiseReader   : PromiseReader,
		PromiseWriter   : PromiseWriter,
		PromiseCopy     : PromiseCopy,
		GetFileName     : GetFileName,
		GetRelativePath : GetRelativePath,
		MarkedToID      : MarkedToID,
		
		sep : path.sep
		
	};