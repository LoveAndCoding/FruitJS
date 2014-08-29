/**	Marked Renderer Overrides
  *	
  **/
var marked = require('marked'),
	renderer = new marked.Renderer(),
	idRegex = /id="([^"]+)"/;

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
			content.replace(id, id + ucount);
			id = id + ucount;
		} else {
			renderer.doc.addId(id);
		}
		
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

renderer.image = function (href, title, text) {
	// If the link starts with *://, //, or /, we don't want to touch it.
	// We'll assume URLs like this are not relative to our current folder
	// location and are intentionally that way. No modifications!
	if(/^(\w+:\/\/|\/\/|\/)/.test(href)) {
		return marked.Renderer.prototype.image.apply(this, arguments);
	}
	
	// Else, we've got a URL we might need to tweak and make relative
	var img = renderer.doc.addImage(href);
	href = img.getOutputPath();
	return marked.Renderer.prototype.image.apply(this, arguments);
};

module.exports = renderer;