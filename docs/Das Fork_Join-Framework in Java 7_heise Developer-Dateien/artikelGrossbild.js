(function($) {

'use strict';

var css_path  = '/js/plugins/jquery.colorbox/example3/colorbox.css',
    cbox_path = '/js/plugins/jquery.colorbox/jquery.colorbox-min.js';

function reloadTracking() {
    var _reload = function() {
        Heise.TrackingReload.reloadAll( function() {
            // wt.sendinfo() (Webtrekk) mit bestimmten Argumenten aufrufen:
            return {
                reloadWebtrekk: {
                    contentId: this.wt.contentId + '.inlinebild',
                    contentGroup: this.wt.contentGroup
                }
            };
        });
    };

    if ( typeof Heise === 'undefined' || typeof Heise.TrackingReload === 'undefined' ) {
        $.getScript('/js/ho/tracking-reload.min.js', _reload);
    }
    else {
        _reload();
    }
}

function applyColorbox(arrayOfLinkItems, group) {
        arrayOfLinkItems.colorbox({
            "href" : function() {
                return $(this).data("grossbildsrc")
            },
            "photo" : true,
            "rel"  : group,
            "current" : "Bild {current} von {total}",
            "previous" : "voriges",
            "next" : "nächstes",
            "close" : "schließen",
            "maxHeight" : "95%",
            "maxWidth" : "95%",
            "transition" : "none",
            "title" : function() {
                var figureElement = $(this).parents('figure');
                var $bu = figureElement.find('figcaption').clone();
                if ($bu.length > 0) {
                    $bu.find('a.grossbild').remove();
                    $bu.find("span").css({display: "inline"});
                    return $bu;
                } else if ($(this).is('a') && typeof $(this).attr('title') === 'string' && $(this).attr('title').length > 0) {
                    $bu = decodeURIComponent($(this).attr('title').trim());
                    return $bu;
                } else {
                    return false;
                }
            }
        });
}

$(function($) {

    if (document.createStyleSheet) {
        document.createStyleSheet(css_path);
    } else {
        $('head').append('<link rel="stylesheet" type="text/css" href="' + css_path + '" />');
    }

    $.getScript(cbox_path, function() {

        var candidatesImageLink = $('a.cbox_gallery, .heise_inline_gallery');
        var candidatesIconLink  = $('a.cbox_gallery_icon');
        applyColorbox(candidatesImageLink,'group1');
        applyColorbox(candidatesIconLink,'group2');

        // iFrames
        $('a.cbox_iframe').colorbox({
            iframe : true,
            width: "95%",
            height: "95%",
            transition: "none",
        });

    });

    $(document).on('cbox_complete', function() {
        try {
            reloadTracking();
        } catch (e) {}
    });
});
})(jQuery);