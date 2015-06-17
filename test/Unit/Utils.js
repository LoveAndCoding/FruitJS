var Utils = require('../../src/Utils.js'),
	assert = require('assert'),
	fs = require('fs'),
	path = require('path');

var UTF8_FILE_STRING = 'ᚠᛇᚻ᛫ᛒᛦᚦ᛫ᚠᚱᚩᚠᚢᚱ᛫ᚠᛁᚱᚪ᛫ᚷᛖᚻᚹᛦᛚᚳᚢᛗ',
	ASCII_FILE_STRING = 'test',
	
	UTF8_FILE = path.resolve(__dirname,'files/utf8.txt'),
	ASCII_FILE = path.resolve(__dirname,'files/ascii.txt'),
	DOES_NOT_EXIST_FILE = path.resolve(__dirname,'files/does not exist.txt');

describe('Utils', function () {
	
	describe('#PromiseReader', function () {
		
		it('should read a file that exists in UTF8 by default', function (done) {
			Utils.PromiseReader(UTF8_FILE).then(function (result) {
				assert.equal(result, UTF8_FILE_STRING, 'File not correctly parsed as utf8');
			}).then(function () {
				done();
			}, done);
		});
		
		it('should read a file that exists in ASCII explicitly', function (done) {
			Utils.PromiseReader(ASCII_FILE, 'ascii').then(function (result) {
				assert.equal(result, ASCII_FILE_STRING, 'File not correctly parsed as ascii');
			}).then(function () {
				done();
			}, done);
		});
		
		it('should be unable to read a UTF8 file\'s contents in ASCII', function (done) {
			Utils.PromiseReader(UTF8_FILE, 'ascii').then(function (result) {
				assert.notEqual(result, UTF8_FILE_STRING, 'File not correctly parsed as ascii');
			}).then(function () {
				done();
			}, done);
		});
		
		it('should fail when reading a file that does not exist', function (done) {
			Utils.PromiseReader(DOES_NOT_EXIST_FILE).then(function (result) {
				done(new Error('Reader did not indicate a failure for a file that did not exist'));
			}, function () {
				done();
			});
		});
		
	});
	
	describe('#PromiseWriter', function () {
		var testWriteFile = path.resolve(__dirname,'files/writerFile.txt');
		
		beforeEach(function () {
			if(fs.existsSync(testWriteFile))
				fs.unlinkSync(testWriteFile);
		});
		
		it('should write out a new UTF8 file', function (done) {
			Utils.PromiseWriter(testWriteFile, UTF8_FILE_STRING).then(function () {
				assert(fs.existsSync(testWriteFile), 'File does not exist');
				assert.equal(fs.readFileSync(testWriteFile, 'utf8'), UTF8_FILE_STRING, 'File contents not correct when writing file');
			}).then(function () {
				done();
			}, done);
		});
		
		it('should write out a new ASCII file', function (done) {
			Utils.PromiseWriter(testWriteFile, ASCII_FILE_STRING, 'ascii').then(function () {
				assert(fs.existsSync(testWriteFile), 'File does not exist');
				assert.equal(fs.readFileSync(testWriteFile, 'ascii'), ASCII_FILE_STRING, 'File contents not correct when writing file');
			}).then(function () {
				done();
			}, done);
		});
		
		it('should overwrite an existing file', function (done) {
			fs.writeFileSync(testWriteFile, 'FAIL', 'utf8');
			Utils.PromiseWriter(testWriteFile, ASCII_FILE_STRING).then(function () {
				assert.equal(fs.readFileSync(testWriteFile), ASCII_FILE_STRING, 'File contents were not overridden');
			}).then(function () {
				done();
			}, done);
		});
		
		it('should fail to write to a read only file');
		
		afterEach(function () {
			if(fs.existsSync(testWriteFile))
				fs.unlinkSync(testWriteFile);
		});
		
	});
	
	describe('#PromiseCopy', function () {
		var testCopyFile = path.resolve(__dirname, 'files/copyFile.txt');
		
		beforeEach(function () {
			if(fs.existsSync(testCopyFile))
				fs.unlinkSync(testCopyFile);
		});
		
		it('should copy over a UTF8 file', function (done) {
			Utils.PromiseCopy(UTF8_FILE, testCopyFile).then(function () {
				assert(fs.existsSync(testCopyFile), 'File does not exist');
				assert.equal(fs.readFileSync(testCopyFile), UTF8_FILE_STRING, 'File contents were copied correctly');
			}).then(function () {
				done();
			}, done);
		});
		
		it('should copy over a ASCII file', function (done) {
			Utils.PromiseCopy(ASCII_FILE, testCopyFile).then(function () {
				assert(fs.existsSync(testCopyFile), 'File does not exist');
				assert.equal(fs.readFileSync(testCopyFile), ASCII_FILE_STRING, 'File contents were copied correctly');
			}).then(function () {
				done();
			}, done);
		});
		
		it('should fail to copy a file that does not exist', function (done) {
			Utils.PromiseCopy(DOES_NOT_EXIST_FILE, testCopyFile).then(function (result) {
				done(new Error('Copy did not indicate a failure for a file that did not exist'));
			}, function () {
				done();
			});
		});
		
		afterEach(function () {
			if(fs.existsSync(testCopyFile))
				fs.unlinkSync(testCopyFile);
		});
		
	});
	
	describe('#GetFileName', function () {
		
		it('should return undefined when passed an empty string', function () {
			assert.equal(typeof Utils.GetFileName(''), 'undefined', 'Does not return undefined');
		});
		
	});
	
	describe('#GetRelativePath', function () {
		
		it('should return absolute path if it is absolute');
		
	});
	
});