const {remote}                = require('electron');
const NotificationHelper      = require('./helpers/notification.js');
const SanitizeHelper          = require('./helpers/sanitizer.js');
const MailHelper          = require('./helpers/mailer.js');
const electronTitlebarWindows = require('./js/titlebar.js');

let titlebar = new electronTitlebarWindows({
    darkMode: false,
    color: 'rgb(220, 200, 200)',
    backgroundColor: '#1976D2',
    draggable: true,
    fullscreen: false
});

titlebar.appendTo(document.querySelector('#titlebar'));

titlebar.on('close', () => {
    console.info('close');

    remote.getCurrentWindow().close();
});

titlebar.on('minimize', () => {
    console.info('minimize');

    remote.getCurrentWindow().minimize();
});

$(document).ready(function() {
    $('#about').click(function() {
        $('#about-modal').modal('show');
    });
	
	$("#event-scroller").niceScroll({
		cursorwidth: '5px',
		cursorcolor: "#72DEFF",
		autohidemode: true,
		zindex: 999
	});
	
	//$("select:not(.ms)").selectpicker();
});

$(document).ready(function() {
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})
});

jQuery(function(){
    initSideNav();
});


function initSideNav() {
    jQuery('body').SideNav({
        hideOnClickOutside: true,
        menuActiveClass: 'nav-active',
        menuOpener: '.nav-opener, .open-panel',
        menuDrop: '.nav-drop'
    }).data('SideNav');
}

;(function($) {
    function SideNav(options) {
        this.options = $.extend({
            container: null,
            hideOnClickOutside: true,
            menuActiveClass: 'nav-active',
            menuOpener: '.nav-opener',
            menuDrop: '.nav-drop',
            toggleEvent: 'click',
            outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
        }, options);
        this.initStructure();
        this.attachEvents();
    }
    SideNav.prototype = {
        initStructure: function() {
            this.page = $('html');
            this.container = $(this.options.container);
            this.opener = this.container.find(this.options.menuOpener);
            this.drop = this.container.find(this.options.menuDrop);
        },
        attachEvents: function() {
            var self = this;

            if(activateResizeHandler) {
                activateResizeHandler();
                activateResizeHandler = null;
            }

            this.outsideClickHandler = function(e) {
                if(self.isOpened()) {
                    var target = $(e.target);
                    if(!target.closest(self.opener).length && !target.closest(self.drop).length) {
                        self.hide();
                    }
                }
            };

            this.openerClickHandler = function(e) {
                e.preventDefault();
                self.toggle();
            };

            this.opener.on(this.options.toggleEvent, this.openerClickHandler);
        },
        isOpened: function() {
            return this.container.hasClass(this.options.menuActiveClass);
        },
        show: function() {
            this.container.addClass(this.options.menuActiveClass);
            if(this.options.hideOnClickOutside) {
                this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
            }
        },
        hide: function() {
            this.container.removeClass(this.options.menuActiveClass);
            if(this.options.hideOnClickOutside) {
                this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
            }
        },
        toggle: function() {
            if(this.isOpened()) {
                this.hide();
            } else {
                this.show();
            }
        },
        destroy: function() {
            this.container.removeClass(this.options.menuActiveClass);
            this.opener.off(this.options.toggleEvent, this.clickHandler);
            this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
        }
    };

    var activateResizeHandler = function() {
        var win = $(window),
            doc = $('html'),
            resizeClass = 'resize-active',
            flag, timer;
        var removeClassHandler = function() {
            flag = false;
            doc.removeClass(resizeClass);
        };
        var resizeHandler = function() {
            if(!flag) {
                flag = true;
                doc.addClass(resizeClass);
            }
            clearTimeout(timer);
            timer = setTimeout(removeClassHandler, 500);
        };
        win.on('resize orientationchange', resizeHandler);
    };

    $.fn.SideNav = function(options) {
        return this.each(function() {
            var params = $.extend({}, options, {container: this}),
                instance = new SideNav(params);
            $.data(this, 'SideNav', instance);
        });
    };
}(jQuery));

$(document).ready(function() {
    if($.isFunction($.fn.bootstrapMaterialDatePicker)){    
        $('.new-datepicker, .edit-datepicker').bootstrapMaterialDatePicker({
            format: 'YYYY-MM-DD',
            weekStart:1,
            //startDate: '-3d',
            //color: 'red',
            time: false
        });  
    }
    
});
