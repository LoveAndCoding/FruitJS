/**	Page Object
  *	
  *	The Page object, representing a page
  *	
  **/
var $ = require('./Utils.js'),
	rsvp = require('rsvp'),
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
		// Go until we find a heading
		for(var m = 0, l = md.length; m < l && !this.getTitle(); m++) {
			if(md[m] && md[m].type == 'heading' && md[m].depth == 1 && md[m].text)
				this.setTitle(md[m].text);
		}
	}
	
	return md;
};

module.exports = Page;