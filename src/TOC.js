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

/**	Static Functions
  *	
  **/
TOC.MarkdownToMenu = function (mdObj, title, url, lvls) {
	var page = new TOCEntry(title, url),
		pageSub = new TOC(),
		entryStack = [pageSub],
		levelStack = [1],
		firstHeader = true;
	
	page.addSubMenu(pageSub);
	
	// Loop through and find all the headers.
	// Headers should be top level, so don't 
	// need to recurse
	for ( var i = 0, l = mdObj.length; i < l; i++ ) {
		if(mdObj[i].type == 'heading') {
			var heading = mdObj[i];
			
			if(firstHeader && heading.depth == 1 && title == heading.text) {
				page.setURL(url + '#' + $.MarkedToID(heading));
				firstHeader = false;
				continue;
			}
			firstHeader = false;
			
			if((typeof lvls != 'undefined' && lvls < heading.depth) || !heading.text)
				continue;
			
			// If the previous header was lower, make
			// this a submenu
			if( heading.depth > levelStack[0] ) {
				levelStack.unshift(heading.depth);
				
				// Check to make sure we have something to
				// be a child of
				if ( entryStack[0].get(-1) ) {
					var nextEntry = new TOC();
					entryStack[0].get(-1).addSubMenu(nextEntry);
					entryStack.unshift( nextEntry );
				} else {
					// If we don't, just go under the current
					// sub menu
					entryStack.unshift( entryStack[0] );
				}
			
			// If the previous header was higher, we're
			// done with at least one submenu. Back out
			// until siblings match or are lower
			} else if ( heading.depth < levelStack[0] ) {
				do {
					levelStack.shift();
					entryStack.shift();
				} while ( heading.depth < levelStack[0] );
			}
			// If they are equal, this should be a sibling
			// so we do nothing with sub menus
			
			// Get the contents of the item
			var name = marked.inlineLexer(_.escape(heading.text), []) || 'Unknown Section',
				id = $.MarkedToID(heading); // Assume ID already set
			
			// Add a new entry
			entryStack[0].addPage(name, url + '#' + id);
		}
		continue;
		
		if (/^h([1-6])$/.test(mdObj[i][0])) {
			var thisHeadLevel = +(mdObj[i][0].replace('h',''));
			
			// Check for filtering this out
			if(lvls && lvls < thisHeadLevel) continue;
			
			if(firstHead && mdObj[i][0] == 'h1' && title == $.JsonMLToString(mdObj[i]))
				continue;
			firstHead = false;
			
			// If the previous header was lower, make
			// this a submenu
			if( thisHeadLevel > levelStack[0] ) {
				levelStack.unshift(thisHeadLevel);
				
				// Check to make sure we have something to
				// be a child of
				if ( entryStack[0].get(-1) ) {
					var nextEntry = new TOC();
					entryStack[0].get(-1).addSubMenu(nextEntry);
					entryStack.unshift( nextEntry );
				} else {
					// If we don't, just go under the current
					// sub menu
					entryStack.unshift( entryStack[0] );
				}
			
			// If the previous header was higher, we're
			// done with at least one submenu. Back out
			// until siblings match or are lower
			} else if ( thisHeadLevel < levelStack[0] ) {
				do {
					levelStack.shift();
					entryStack.shift();
				} while ( thisHeadLevel < levelStack[0] );
			}
			// If they are equal, this should be a sibling
			// so we do nothing with sub menus
			
			// Get the contents of the item
			var name = $.JsonMLToString(mdObj[i]) || 'Unknown Section',
				id = mdObj[i][1].id; // Assume ID already set
			
			// Add a new entry
			entryStack[0].addPage(name, url + '#' + id);
		}
	}
	
	return page;
};

module.exports = TOC;