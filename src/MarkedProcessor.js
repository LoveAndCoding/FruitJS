/**	Marked Renderer Overrides
  *	
  **/
var marked = require('marked'),
	renderer = new marked.Renderer(),
	idRegex = /id="([^"]+)"/;

renderer.setDoc = function (Doc) {
	this.doc = Doc;
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
	
	return content;
};

module.exports = renderer;