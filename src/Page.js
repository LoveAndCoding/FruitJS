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

Page.prototype.getOutputFile = function () {
	return this.__htmlName;
};

Page.prototype.setOutputFile = function (filename) {
	if(!filename)
		filename = path.basename(this.__file).replace(/(\.md|\.markdown)$/, '') + '.html';
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

Page.prototype.getIDs = function () {
	return this.__ids;
};

Page.prototype.getMarkdown = function () {
	return this.__retrievePromise;
};

function findUniqueID (existing, id) {
	if(!existing || !util.isArray(existing) || !existing[id])
		return id;
	
	var add = 1;
	while ( existing[id + '-' + add] )
		add++;
	return id + '-' + add;
}

Page.prototype.preProcessPage = function (md) {
	
	if(!this.getTitle()) {
		// Go until we find a heading
		for(var m = 0, l = md.length; m < l && !this.getTitle(); m++) {
			if(md[m] && md[m].type == 'heading' && md[m].depth == 1 && md[m].text)
				this.setTitle(md[m].text);
		}
	}
	
	return md;
};

module.exports = Page;