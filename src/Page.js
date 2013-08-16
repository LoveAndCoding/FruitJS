/**	Page Object
  *	
  *	The Page object, representing a page
  *	
  **/
var $ = require('./Utils.js'),
	rsvp = require('RSVP'),
	util = require('util'),
	marked = require('marked');

marked.setOptions({
		gfm: true,
		tables: true
	});

function Page (File, Title) {
	this.__file = File,
	this.__title = Title,
	this.__ids = [];
	
	var self = this;
	this.__retrievePromise = rsvp.Promise(function (res, rej) {
			$.PromiseReader(self.__file).then(function (md) {
					var luthor = new marked.Lexer();
					self.__procContent = self.preProcessPage(luthor.lex(md));
					res(self.__procContent);
				}, rej);
		});
}

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
		if(md[0] && md[0].type == 'heading' && md[0].depth == 1 && md[0].text)
			this.setTitle(md[0].text);
	}
	
	return md;
};

module.exports = Page;