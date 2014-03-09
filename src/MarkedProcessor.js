/**	Marked Renderer Overrides
  *	
  **/

var marked = require('marked'),
	renderer = marked.Renderer.prototype,
	idRegex = /id="[([^"]+)]"/;

function MarkedProcessor (Document) {
	this.doc = Document;
	
	this.options.headerPrefix = 'h';
}

MarkedProcessor.prototype = Object.create(renderer);

MarkedProcessor.heading = function (text, level) {
	var content = renderer.heading.apply(this, arguments),
		id = content.match(idRegex);
	
	if(id && id.length >= 2) {
		id = id[1]; // our matched ID
		
		if(this.doc.hasId(id)) {
			// We already used this ID in the document
			// Make a new unique ID
			var ucount = 1;
			while(this.doc.hasId(id + ucount)) {
				ucount++;
			}
			content.replace(id, id + ucount);
			id = id + ucount;
		}
		
		if(this.doc.options.tocLevel >= level)
			this.doc.menu.addItem(text, level, id);
		
	} // else: We created a new heading, but it doesn't have an id?!
	
	return content;
}

module.exports = MarkedProcessor;