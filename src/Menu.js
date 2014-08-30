/**	TOC Object
  *	
  *	The Table of Contents object, representing the menu hierarchy
  *	
  **/
var $ = require('./Utils.js'),
	marked = require('marked'),
	_ = require('underscore');

function TOC () {
	this.__entries = [];
}
TOC.prototype.addPage = function (title, url, submenu) {
	var entry = new TOCEntry(title, url);
	this.__entries.push(entry);
	if(submenu)
		entry.addSubMenu(submenu);
	return entry;
};
TOC.prototype.addEntry = function (tree) {
	this.__entries.push(tree);
	return this;
};
TOC.prototype.toObject = function () {
	var menu = [];
	for(var e in this.__entries)
		menu.push(this.__entries[e].toObject());
	return menu;
};
TOC.prototype.get = function (index) {
	if ( index < 0 )
		return this.__entries[ this.__entries.length + index ];
	else
		return this.__entries[ index ];
};

/**	TOCEntry Object
  *	
  *	The Table of Contents Entry object, representing a menu item
  *	
  **/
function TOCEntry (Title, URL) {
	this.__title = Title,
	this.__url = URL,
	this.__submenu;
};
TOCEntry.prototype.toObject = function () {
	var obj = {'Name':this.__title};
	if(this.__url)
		obj.URL = this.__url;
	if(this.__submenu)
		obj.SubMenu = this.__submenu.toObject();
	return obj;
};
TOCEntry.prototype.addSubMenu = function (menu) {
	this.__submenu = menu;
	return this;
};
TOCEntry.prototype.setURL = function (url) {
	this.__url = url;
	return this;
};

/**	TOCBuilder Object
  *	
  *	Table of Contents Builder object, containing convenience
  *	methods for building on the fly.
  *	
  **/
function TOCBuilder () {
	this.__toc = new TOC();
	this.__idPrefix = '';
	this.hardCut();
}
TOCBuilder.prototype.addPage = function (title, url, level) {
	if(level > this.__lvl && this.__lvl != -1) {
		// This should be a sub menu
		this.__lvlStk.push(level);
		var rpl = new TOC();
		this.__curr.get(-1).addSubMenu(rpl);
		this.__curr = rpl;
		this.__tocStack.push(rpl);
	} else if (level < this.__lvl) {
		// Go back up until we're at the right spot
		while(level < this.__lvl && this.__lvlStk.length) {
			this.__lvl = this.__lvlStk.pop();
			this.__curr = this.__tocStack.pop();
		}
		this.__lvlStk.push(level);
		this.__tocStack.push(this.__curr);
	}
	
	if(url[0] == '#')
		url = this.__idPrefix + url;
	this.__curr.addPage(title, url);
	this.__lvl = level;
	return this;
};
TOCBuilder.prototype.setIdPage = function (prefix) {
	// If we're setting just an id, we may want to specify a page
	this.__idPrefix = prefix;
	return this;
};
TOCBuilder.prototype.hardCut = function () {
	this.__lvl = -1;
	this.__lvlStk = [1];
	this.__curr = this.__toc;
	this.__tocStack = [this.__toc];
	return this;
}
TOCBuilder.prototype.getTOC = function () {
	return this.__toc;
}

TOC.Builder = TOCBuilder;

module.exports = TOC;