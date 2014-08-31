/**	Page Object
  *	
  *	The Page object, representing a page
  *	
  **/
var $ = require('./Utils.js'),
	rsvp = require('rsvp'),
	util = require('util'),
	path = require('path');

function Page (File, Title) {
	this.__file = File,
	this.__title = Title,
	this.__ids = [];
	
	this.setOutputFile();
	var self = this;
	this.__retrievePromise = $.PromiseReader(self.__file);
}

Page.prototype.getFile = function () {
	return this.__file;
};

Page.prototype.getOutputFile = function () {
	return this.__htmlName;
};

Page.prototype.setOutputFile = function (filename) {
	if(!filename)
		filename = path.basename(this.__file).replace(/(\.md|\.markdown|\.mdown|\.mkdn)$/, '') + '.html';
	this.__htmlName = filename;
	return this;
};

Page.prototype.getTitle = function () {
	return this.__title;
};

Page.prototype.setTitle = function (title) {
	this.__title = title;
	return this;
};

Page.prototype.getID = function () {
	return this.__htmlName.toLowerCase().replace(/\.html$/, '').replace(/[^\w]+/g,'-');
};

Page.prototype.getIDs = function () {
	return this.__ids;
};

Page.prototype.getMarkdown = function () {
	return this.__retrievePromise;
};

module.exports = Page;