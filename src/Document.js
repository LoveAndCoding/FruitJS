/**	Document Object
  *	
  *	The base object for all generation
  *	
  **/

var $ = require('./Utils.js'),
	fs = require('fs'),
	_ = require('underscore'),
	rsvp = require('rsvp'),
	less = require('less'),
	Page = require('./Page.js'),
	DefaultTheme = require('./Theme.js'),
	TOC = require('./TOC.js');

function Doc (Name, Dir) {
	// init
	
	// Added content
	this.__less   = [],
	this.__css    = [],
	this.__js     = [],
	this.__images = [],
	this.__pages  = [],
	
	// Defaults
	this.__outputTo = Dir || 'output',
	this.__tocLevel = 2;
	
	this.__name = Name || 'Documentation';
	
	this.__theme = new DefaultTheme(this),
	this.__toc = new TOC();
}

Doc.prototype.buildMenu = function (tocLevel, singlePage) {
	// reset menu
	this.__toc = new TOC();
	
	if(typeof tocLevel != 'undefined')
		this.__tocLevel = tocLevel;
	
	var self = this,
		renderedMarkdown = [],
		promise = rsvp.Promise(function (res, rej) {
				for (var p in self.__pages) {
					renderedMarkdown.push(self.__pages[p].getMarkdown());
				}
				
				rsvp.all(renderedMarkdown).then(function (pagesMD) {
					for(var index in pagesMD) {
						// The index in the markdown array should be
						// 1 to 1 with the pages in __pages
						var page = self.__pages[index];
						self.__toc.addEntry(
									TOC.MarkdownToMenu( 
										pagesMD[index],
										page.getTitle(),
										singlePage ? '' : index == 0 ? 'index.html' : page.getTitle() + '.html',
										self.__tocLevel
									)
								);
					}
					
					// After the menu has finished adding all entries
					// we should resolve the promise with the menu
					res(self.__toc);
					
				// If there was an error, reject the promise
				}, rej);
			});
	
	return promise;
};

Doc.prototype.render = function (singlePage) {
	var head = '',
		nav = '',
		foot = '',
		self = this,
		copyCommands = [],
		otherRenders = [],
		pageRenders = [];
	
	// Copy over all of the necessary assets
	for (var c in this.__css) {
		var sheet = $.GetFileName(this.__css[c]);
		copyCommands.push(
			$.PromiseCopy(
					this.__css[c],
					this.__outputTo + $.sep + 'css' + $.sep + sheet
				)
			);
		this.__css[c] = 'css/' + sheet;
	}
	for (var l in this.__less) {
		// This one is nested deep :(
		// Need to clean this code up
		var promise;
		(function (lessFile) {
			promise = rsvp.Promise(function (lessRes, lessRej) {
					// Read in the less file
					$.PromiseReader(lessFile).then(
							function (lessContent) {
								// Render the less to CSS
								less.render(lessContent, function (e, css) {
										if(e)
											lessRej(e);
										// Write the CSS to disk in the new location
										$.PromiseWriter(
												self.__outputTo +
													$.sep + 'css' +
													$.sep + $.GetFileName(lessFile).replace(/\.[a-z]+$/,'') + '.css',
												css
											).then(lessRes, lessRej);
									});
							},
							lessRej
						);
				});
		})(this.__less[l]);
		
		this.__css.push('css/' + $.GetFileName(this.__less[l]).replace(/\.[a-z]+$/,'') + '.css');
		
		copyCommands.push(
				promise
			);
	}
	for (var j in this.__js) {
		var script = $.GetFileName(this.__js[j]);
		copyCommands.push(
			$.PromiseCopy(
					this.__js[j],
					this.__outputTo + $.sep + 'js' + $.sep + script
				)
			);
		this.__js[j] = 'js/' + script;
	}
	for (var i in this.__images) {
		var image = $.GetFileName(this.__images[i]);
		copyCommands.push(
			$.PromiseCopy(
					this.__images[i],
					this.__outputTo + $.sep + 'images' + $.sep + image
				)
			);
		this.__images[i] = 'images/' + image;
	}
	
	// We should only do the header, nav, and footer
	// once if we're making a single page
	if(singlePage) {
		otherRenders.push(
			this.__theme.renderHeader({
					Title       : this.__name,
					Stylesheets : this.__css
				})
		);
		
		// Next, we should render the nav, which we
		// assume has already been built
		otherRenders.push(
			this.__theme.renderNav({
					Logo  : this.__imageTitle || '',
					Title : this.__name,
					Menu  : this.__toc.toObject()
				})
		);
		
		// And finally, the footer content
		otherRenders.push(
			this.__theme.renderFooter({
				'Scripts' : this.__js
			})
		);
	}
	
	// Let's build a set of promises for each page
	// since everything in this code seems to be
	// based on async file operations
	for (var p in this.__pages) {
		// This will hold all of our individual promises
		var pagePromises = [];
		
		if(!singlePage) {
			// First, render the header
			pagePromises.push(
				this.__theme.renderHeader({
						Title       : this.__pages[p].getTitle() + ' - ' + this.__name,
						Stylesheets : this.__css
					})
			);
			
			// Next, we should render the nav, which we
			// assume has already been built
			pagePromises.push(
				this.__theme.renderNav({
						Logo  : this.__imageTitle || '',
						Title : this.__name,
						Menu  : this.__toc.toObject()
					})
			);
		}
		
		// Now let's actually render our content. We
		// have the markdown already, but we want to
		// throw it through our theme, in case extra
		// processing is used.
		pagePromises.push(
			this.__pages[p].getMarkdown()
				.then(function (md) {
					return self.__theme.renderContent(md);
				})
		);
		
		if(!singlePage) {
			// And finally, the footer content
			pagePromises.push(
				this.__theme.renderFooter({
					'Scripts' : this.__js
				})
			);
		}
				
		// Now that we're rendering each piece, let's
		// wrap it all up in a promise particular to
		// all of the rendering of this page
		pageRenders.push(
			rsvp.all(pagePromises)
				.then(function (pieces) {
					// Let's also wrap up all the pieces
					// into one so that no one else needs
					// to know these weird structure
					return rsvp.Promise(
							function (r) {
								r(pieces.length > 1 ? pieces.join('') : pieces[0]);
							}
						);
				})
		);
	}
	
	if(singlePage) {
		var writeOut = rsvp.all(otherRenders).then(
				function (pieces) {
					return rsvp.all(pageRenders).then(
						function (allPages) {
							var output = pieces[0] + pieces[1];
							for(var p in allPages) {
								output += allPages[p];
							}
							// Write out to the file
							return $.PromiseWriter(self.__outputTo + $.sep + 'index.html', output + pieces[2]);
						});
				}
			);
	} else {
		var writeOut = rsvp.all(pageRenders).then(
				function (allPages) {
					var allWrite = [];
					// allPages index should be a 1 to 1 with
					// this.__pages, so we can use that mapping
					for(var p in self.__pages) {
						// As in other places in the code, 0 is used
						// for the index page, all other pages will
						// use their title as the file name
						var filename = p == 0 ? 'index.html' : self.__pages[p].getTitle() + '.html';
						
						// Write out to the file
						allWrite.push(
								$.PromiseWriter(self.__outputTo + $.sep + filename, allPages[p])
							);
					}
					
					return rsvp.all(allWrite);
				}
			);
	}
	
	return rsvp.all([writeOut, rsvp.all(copyCommands)]);
};

Doc.prototype.addLESS = function (file) {
	this.__less.push(file);
	return this;
};

Doc.prototype.addCSS = function (file) {
	this.__css.push(file);
	return this;
};

Doc.prototype.addJS = function (file) {
	this.__js.push(file);
	return this;
};

Doc.prototype.addImage = function (file) {
	this.__images.push(file);
	return this;
};

Doc.prototype.addPage = function (file, title, isIndex) {
	if(isIndex)
		this.__pages.unshift( new Page(file, title) );
	else
		this.__pages.push( new Page(file, title) );
	return this;
};

Doc.prototype.setImageTitle = function (image) {
	this.__imageTitle = image;
	return this;
}

module.exports = Doc;