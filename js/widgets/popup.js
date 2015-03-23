define(function (require) {
    var $ = require('jquery'),
		nunjucks = require('nunjucks'),
		templateHTML = require('text!popup.html');
	
	var template = new nunjucks.Template(templateHTML);

	var Popup = function () {};
	
	Popup.prototype.init = function (opts) {
	
		var self = this;
		
		_.defaults(opts, {
			title: 'Title',
			body: 'Body',
			openFlag: false
		});

		_.extend(this, opts, {
			domNode: null,
			maskNode: null
		});

		self.render();

	};

	Popup.prototype.render = function () {
	
		var self = this;

		var context = {
			title: self.title,
			body: self.body
		};
				
		var html = template.render(context);		
		var popup_id = _.uniqueId('popup_');
		var popup_mask_id = _.uniqueId('popup_mask_');
		
		$('body').append('<div class="popup" id="'+popup_id+'"></div><div class="popup-mask" id="'+popup_mask_id+'"></div>');
		self.domNode = document.getElementById(popup_id);
		self.maskNode = document.getElementById(popup_mask_id);		
		$(this.domNode).html(html);

		self._postRender();
	};

	Popup.prototype.show = function () {
	
		var self = this;
		
		$(self.domNode).addClass('shown');
		$('body').addClass('popup-on');
		self.openFlag = true;
	};

	Popup.prototype.close = function () {
	
		var self = this;
		
		$(self.domNode).removeClass('shown');
		$('body').removeClass('popup-on');
		self.openFlag = false;
	
	};

	
	Popup.prototype._postRender = function () {
	
		var self = this;
		
		popupDialog = $('.popup-content', self.domNode);
		
		$('.popup-close', self.domNode).on('click', function(e) {
			e.preventDefault();
			self.close();
		})
		popupDialog.hover(function(e) {
			console.log('hover')
			$(this).addClass('hover');
		}, function(e) {
			$(this).removeClass('hover');
		});
		$('.popup-cont').on('click', function(e) {
			e.preventDefault();
			
			if (!popupDialog.hasClass('hover')) {
				self.close();				
			}
		});
	
		
		$(document).keyup(function(e) {
			
			console.log(e.keyCode)
			
			//close dialog on escape and return and space
			if (self.openFlag) {
				if (e.keyCode == 13 || e.keyCode == 27 || e.keyCode == 32) {
					self.close();
				}		
			}	
		});
		//$('.modal', this.domNode).modal('show');
	
	};

	return Popup;

});	