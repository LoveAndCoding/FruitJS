/**	File Object
  *	
  *	Representation of a file we are going to export along with
  *	the markdown
  *	
  **/
var $ = require('./Utils.js');

function File(path) {
	this.__path = path,
	this.__name = $.GetFileName(this.__path),
	this.__outputPath = '';
}

File.prototype.copyTo = function (path) {
	return $.PromiseCopy(this.__path, path + $.sep + this.__name);
};

File.prototype.getName = function () {
	return this.__name;
};

File.prototype.setName = function (name) {
	this.__name = name;
	return this.__name;
};

File.prototype.getOutputPath = function () {
	return this.__outputPath ? this.__outputPath + '/' + this.__name : this.__name;
};

File.prototype.setOutputPath = function (path) {
	this.__outputPath = path;
	return this.getOutputPath();
};

File.prototype.getRelativePath = function () {
	return $.GetRelativePath(this.__path);
};

File.prototype.matches = function (filepath) {
	return this.__path == filepath;
};

module.exports = File;