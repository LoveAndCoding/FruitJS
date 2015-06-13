/**	Marked Renderer Overrides
  *	
  **/
var marked = require('marked'),
	fs = require('fs'),
	renderer = new marked.Renderer(),
	idRegex = /id="([^"]+)"/,
	externalRegex = /^(\w+:\/\/|\/\/|\/)/;

renderer.setDoc = function (Doc) {
	this.doc = Doc;
};

renderer.setPage = function (page) {
	this.page = page;
};

renderer.heading = function (text, level) {
	var content = marked.Renderer.prototype.heading.apply(this, arguments),
		id = content.match(idRegex);
	
	if(id && id.length >= 2) {
		id = id[1]; // our matched ID
		
		if(renderer.doc.hasId(id)) {
			// We already used this ID in the document
			// Make a new unique ID
			var ucount = 1;
			while(renderer.doc.hasId(id + ucount)) {
				ucount++;
			}
			content = content.replace(id, id + ucount);
			id = id + ucount;
		}
		renderer.doc.addId(id);
		
		if(renderer.doc.__tocLevel >= level) {
			renderer.doc.__tocbuilder.addPage(text, '#'+id, level);
		}
		
	} // else: We created a new heading, but it doesn't have an id?!
	
	if(renderer.page) {
		if(!renderer.page.getTitle()) {
			renderer.page.setTitle(text);
		}
	}
	
	return content;
};

renderer.link = function (href, title, text) {
	// If the link starts with *://, //, or /, we don't want to touch it.
	// We'll assume URLs like this are not relative to our current folder
	// location and are intentionally that way. No modifications!
	if(renderer.doc.isExtractionEnabled() && !(externalRegex.test(href) || href[0] == '#')) {
		var filename = decodeURI(href.split('?')[0].split('#')[0]), // Chop off anything after a ? or #
			pfile = renderer.doc.getAbsolutePathFromRelative(filename);
		if(fs.existsSync(pfile) && fs.statSync(pfile).isFile()) {
			var page = renderer.doc.getPage(pfile);
			if(page) {
				// A cross page link. Replace
				if(renderer.doc.isSinglePage()) {
					if(href.indexOf('#') < 0) {
						// We're not linking to a specific ID, so link to the section
						var pagename = '#page-' + page.getID();
					}
				} else {
					var pagename = page.getOutputFile();
					if(pagename == 'index.html')
						pagename = './';
					pagename = href.replace(encodeURI(filename), pagename);
				}
				href = pagename;
			} else {
				// A non page link
				var asset = renderer.doc.addAsset(filename);
				href = encodeURI(asset.getOutputPath());
			}
		}
	
	}
	
	return marked.Renderer.prototype.link.apply(this, arguments);
};

renderer.image = function (href, title, text) {
	// If the link starts with *://, //, or /, we don't want to touch it.
	// We'll assume URLs like this are not relative to our current folder
	// location and are intentionally that way. No modifications!
	if((!renderer.doc.isExtractionEnabled()) || externalRegex.test(href)) {
		return marked.Renderer.prototype.image.apply(this, arguments);
	}
	
	// Else, we've got a URL we might need to tweak and make relative
	var img = renderer.doc.addImage(href);
	href = img.getOutputPath();
	return marked.Renderer.prototype.image.apply(this, arguments);
};

module.exports = renderer;