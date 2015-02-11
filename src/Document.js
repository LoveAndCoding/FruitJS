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
	TOC = require('./Menu.js'),
	AssetFile = require('./File.js'),
	
	// Globals
	CSSFolder = 'css',
	JSFolder = 'js',
	ImageFolder = 'images',
	AssetsFolder = 'assets';

function Doc (Name, Dir, Origin) {
	// init
	
	// Added content
	this.__less   = [],
	this.__css    = [],
	this.__js     = [],
	this.__images = [],
	this.__assets = [],
	this.__pages  = [],
	
	this.__outputStructure = {},
	
	// Defaults
	this.__outputTo = Dir || 'output',
	this.__manifest = Origin,
	this.__tocLevel = 2;
	this.__singlePage = false;
	this.__extract = true;
	
	this.__name = Name || 'Documentation';
	
	this.__theme = new DefaultTheme(this),
	this.__tocbuilder = new TOC.Builder(),
	this.__toc = this.__tocbuilder.getTOC();
	
	this.idMap = {};
}

Doc.prototype.getAbsolutePathFromRelative = function (filepath) {
	return $.GetRelativePath(this.__manifest, filepath);
};

Doc.prototype.setTOCLevel = function (level) {
	this.__tocLevel = level;
	return this;
};

Doc.prototype.setSinglePage = function (singlePage) {
	this.__singlePage = !!singlePage;
	return this;
};

Doc.prototype.isSinglePage = function () {
	return this.__singlePage;
};

Doc.prototype.render = function (singlePage) {
	if(typeof singlePage != 'undefined')
		this.setSinglePage(singlePage);
	
	var self = this,
		copyCommands = [],
		otherRenders = [],
		pageRenders = [],
		pageRenderPromises = [],
		pageCompiles = [];
	
	// We need to render all the pages first, so it can extract links
	// and assets, and build the TOC
	for (var p in this.__pages) {
		if(pageRenderPromises.length) {
			// Wait for the previous page render to finish
			// so we can do our menus more reliably
			pageRenderPromises.push(
				pageRenderPromises[pageRenderPromises.length - 1].then((function (page) {
						return page.getMarkdown()
							.then((function (page, md) {
								if(!self.__singlePage)
									self.__tocbuilder.setIdPage(page.getOutputFile());
								return self.__theme.renderContent(md, page);
							}).bind(self, page)).then(function (html) {
								self.__tocbuilder.hardCut();
								pageRenders.push(html);
							});
					}).bind(self, this.__pages[p]))
			);
		} else {
			pageRenderPromises.push(
				this.__pages[p].getMarkdown()
					.then((function (page, md) {
						if(!self.__singlePage)
							self.__tocbuilder.setIdPage('./');
						return self.__theme.renderContent(md, page);
					}).bind(self, this.__pages[p])).then(function (html) {
						self.__tocbuilder.hardCut();
						pageRenders.push(html);
					})
			);
		}
	}
	
	return rsvp.all(pageRenderPromises).then((function () {
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
			copyCommands.push(
					this.__images[i].copyTo( this.__outputTo + $.sep + ImageFolder )
				);
		}
		
		for (var a in this.__assets) {
			copyCommands.push(
					this.__assets[a].copyTo( this.__outputTo + $.sep + AssetsFolder )
				);
		}
		
		// We should only do the header, nav, and footer
		// once if we're making a single page
		if(this.__singlePage) {
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
			
			if(!this.__singlePage) {
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
			
			if(!this.__singlePage) {
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
			pageCompiles.push(
				rsvp.all(pagePromises)
					.then((function (p, pieces) {
						// Let's also wrap up all the pieces
						// into one so that no one else needs
						// to know these weird structure
						pieces.splice(this.__singlePage ? 0 : 2, 0, pageRenders[p]);
						return rsvp.Promise(
								function (r) {
									r(pieces.length > 1 ? pieces.join('') : pieces[0]);
								}
							);
					}).bind(this, p))
			);
		}
		
		if(this.__singlePage) {
			var writeOut = rsvp.all(otherRenders).then(
					function (pieces) {
						return rsvp.all(pageCompiles).then(
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
			var writeOut = rsvp.all(pageCompiles).then(
					function (allPages) {
						var allWrite = [];
						// allPages index should be a 1 to 1 with
						// this.__pages, so we can use that mapping
						for(var p in self.__pages) {
							// As in other places in the code, 0 is used
							// for the index page, all other pages will
							// use their title as the file name
							var filename = self.__pages[p].getOutputFile();
							
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
		
	}).bind(this));
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
	file = this.getAbsolutePathFromRelative(file);
	for(var i in this.__images) {
		// check if we already have this file
		if(this.__images[i].matches(file)) {
			return this.__images[i];
		}
	}
	
	var obj = new AssetFile(file);
	this.setUniqueFileName( ImageFolder, obj );
	this.__images.push( obj );
	return obj;
};

Doc.prototype.addAsset = function (file) {
	file = this.getAbsolutePathFromRelative(file);
	for(var i in this.__assets) {
		// check if we already have this file
		if(this.__assets[i].matches(file)) {
			return this.__assets[i];
		}
	}
	
	var obj = new AssetFile(file);
	this.setUniqueFileName( AssetsFolder, obj );
	this.__assets.push( obj );
	return obj;
};

Doc.prototype.addPage = function (file, title, isIndex) {
	if(isIndex) {
		this.__pages.unshift( new Page(file, title) );
		this.__pages[0].setOutputFile('index.html');
		if(this.__pages[1])
			this.__pages[1].setOutputFile();
	} else {
		this.__pages.push( new Page(file, title) );
		if(this.__pages.length == 1)
			this.__pages[0].setOutputFile('index.html');
	}
	
	return this;
};

Doc.prototype.getPage = function (file) {
	for(var p in this.__pages) {
		if( this.__pages[p].getFile() == file )
			return this.__pages[p];
	}
};

Doc.prototype.setUniqueFileName = function ( folder, file ) {
	if(!this.__outputStructure[folder]) {
		this.__outputStructure[folder] = [];
	}
	var flist = this.__outputStructure[folder],
		name = file.getName(),
		basename = name.split('.'),
		ext = '.' + basename.splice(-1, 1)[0],
		i = 1;
	basename.join('.');
	
	while( flist.indexOf(name) >= 0 ) {
		name = basename + i + ext;
		i++;
	}
	
	flist.push( name );
	file.setName( name );
	file.setOutputPath( folder );
	
	return file;
};

Doc.prototype.setImageTitle = function (image) {
	this.__imageTitle = image;
	return this;
};

Doc.prototype.hasId = function (id) {
	return !!this.idMap[id];
};

Doc.prototype.addId = function (id) {
	this.idMap[id] = true;
	return this;
};

Doc.prototype.enableExtraction = function () {
	this.__extract = true;
	return this;
};

Doc.prototype.disableExtraction = function () {
	this.__extract = false;
	return this;
};

Doc.prototype.extractionEnabled = function () {
	return this.__extract;
};

module.exports = Doc;