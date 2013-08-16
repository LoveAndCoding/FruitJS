/**	MarkDocTheme Object
  *	
  *	The Theme object which handles retrieval of theme pieces
  *	
  **/
var $ = require('./Utils.js'),
	rsvp = require('RSVP'),
	_ = require('underscore'),
	path = require('path'),
	marked = require('marked');

function MarkDocTheme (Doc) {
	// DEFAULT VALUES
	this.__header = 'themes/default/header.html';
	this.__nav = 'themes/default/nav.html';
	this.__footer = 'themes/default/footer.html';
	
	// Add Styles
	this.addContent(Doc);
}
MarkDocTheme.prototype.addContent = function (Doc) {
	console.log(__dirname);
	Doc.addLESS(path.resolve('themes/default/css/styles.less'));
	Doc.addJS(path.resolve('themes/default/js/script.js'));
};
MarkDocTheme.prototype.renderHeader = function (opts) {
	return this.__render(this.__header, opts);
};
MarkDocTheme.prototype.renderNav = function (opts) {
	return this.__render(this.__nav, opts);
};
MarkDocTheme.prototype.renderContent = function (md) {
	if(this.__content)
		return this.__render(this.__content, {'Content':marked.parser(md)});
	else
		return rsvp.Promise(function (res) {
				res("\t\t<article>\n\t\t\t"+marked.parser(md)+"\n\t\t</article>");
			});
};
MarkDocTheme.prototype.renderFooter = function (opts) {
	return this.__render(this.__footer, opts);
};
MarkDocTheme.prototype.__render = function (file, opts) {
	return rsvp.Promise(function (res, rej) {
			$.PromiseReader(file).then(function (tmpl) {
				res( _.template(tmpl)(opts) );
			}, rej);
		});
};

module.exports = MarkDocTheme;