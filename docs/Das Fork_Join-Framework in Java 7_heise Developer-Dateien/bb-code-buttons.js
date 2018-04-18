/*global forum */

$(document).ready(function() {
    'use strict';

    if (window.bb_code_buttons_initialized) {
        return;
    }
    window.bb_code_buttons_initialized = true;

    function insert_bbcode_tag (element, start, end) {
        var s = element.getSelection();
        var selStart = s.start;
        var selLength = s.length;

        // Markierung ersetzen
        element.replaceSelection(start + s.text + end);

        // Auswahlposition korrigieren
        if ( 'selectionStart' in element[0] ) {
            element[0].selectionStart = selStart + start.length;
            element[0].selectionEnd   = element[0].selectionStart + selLength;
        }

        // Fokus auf Body setzen
        return element.focus();
    }

    var handledEvents = {};

    $(document).on('click', '.bb_buttons span, .bb_buttons .smilies ul li img', function(event) {
        event.preventDefault();
        if (handledEvents[event.timeStamp]) {
            return;
        }
        handledEvents[event.timeStamp] = 1;

        var code_language = $(event.target).attr('data-language');
        if ( code_language ) {
            insert_bbcode_tag(
                $('#msg_body'),
                '[code lang=' + code_language + ']' + "\n",
                "\n" + '[/code]'
            );
            return;
        }

        var variant = $(this).attr('id').substr(5, $(this).attr('id').length - 5);

        if (variant === 'split_quote') {
            forum.splitQuote($('textarea#msg_body'));
            $('textarea#msg_body').focus();
            return;
        }

        var s = $('#msg_body').getSelection();
        var selStart = s.start;
        var selLength = s.length;
        var code_o = '';
        var code_c = '';
        var perParagraph = false;

        switch(variant){
            case 'bold':
                code_o = '[b]';
                code_c = '[/b]';
                perParagraph = true;
                break;
            case 'italic':
                code_o = '[i]';
                code_c = '[/i]';
                perParagraph = true;
                break;
            case 'uline':
                code_o = '[u]';
                code_c = '[/u]';
                perParagraph = true;
                break;
            case 'strikethrough':
                code_o = '[s]';
                code_c = '[/s]';
                perParagraph = true;
                break;
            case 'code':
                code_o = '[code]';
                code_c = '[/code]';
                break;
            case 'quote':
                code_o = '[quote]';
                code_c = '[/quote]';
                break;
            case 'link':
                code_o = '[';
                code_c = ']';
                break;
            case 'img':
                code_o = '[img]';
                code_c = '[/img]';
                break;
            case 'youtube':
                code_o = '[youtube]';
                code_c = '[/youtube]';
                break;
            case 'grin':
                code_o = ':-)';
                break;
            case 'laugh':
                code_o = ':-D';
                break;
            case 'think':
                code_o = ':-|';
                break;
            case 'fear':
                code_o = ':-O';
                break;
            case 'angry':
                code_o = ':-@';
                break;
            case 'twinkle':
                code_o = ';-)';
                break;
            case 'sad':
                code_o = ':-(';
                break;
            case 'cool':
                code_o = 'B-)';
                break;
            case 'sick':
                code_o = '+o(';
                break;
            case 'holy':
                code_o = 'O:-)';
                break;
            case 'cry':
                code_o = ":'(";
                break;
            case 'tongue':
                code_o = ':-P';
                break;
            case 'fish':
                code_o = '<°>>><';
                break;
        }
        // Bei Link-Auswahl wird ueberprueft, ob der User das Protokoll voran geschrieben hat
        if(variant == 'link') {
            var isUrl = s.text.substring(0,8) == 'https://' ||
                        s.text.substring(0,7) == 'http://';

            if (isUrl) {
                // Keine Aenderung noetig
                // s.text = s.text;
            } else {
                var url = window.prompt('Link-Ziel:', 'http://');
                if (!url) {
                    return;
                }
                s.text = url + ' ' + s.text;
            }
        }

        if (perParagraph) {
            var paragraphs = s.text.replace(/(\n{2,})/, code_c + "$1" + code_o );
            $('#msg_body').replaceSelection(code_o + paragraphs + code_c);
        } else {
            $('#msg_body').replaceSelection(code_o+s.text+code_c);
        }

        // Fokus auf Body setzen
        $('#msg_body').focus();

        // Textauswahl korrigieren, wenn vom Browser unterstuetzt
        var body = $('#msg_body')[0];
        if ( 'selectionStart' in body ) {
        body.selectionStart = selStart + code_o.length;
        body.selectionEnd   = body.selectionStart + selLength;
        }
        return;
    });

    /*jslint browser: true*/
    /*jslint jquery: true*/

    /*
     * jQuery Hotkeys Plugin
     * Copyright 2010, John Resig
     * Dual licensed under the MIT or GPL Version 2 licenses.
     *
     * Based upon the plugin by Tzury Bar Yochay:
     * http://github.com/tzuryby/hotkeys
     *
     * Original idea by:
     * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
     */

    /*
     * One small change is: now keys are passed by object { keys: '...' }
     * Might be useful, when you want to pass some other data to your handler
     */

    (function(jQuery) {

        jQuery.hotkeys = {
            version: "0.8",

            specialKeys: {
                8: "backspace",
                9: "tab",
                10: "return",
                13: "return",
                16: "shift",
                17: "ctrl",
                18: "alt",
                19: "pause",
                20: "capslock",
                27: "esc",
                32: "space",
                33: "pageup",
                34: "pagedown",
                35: "end",
                36: "home",
                37: "left",
                38: "up",
                39: "right",
                40: "down",
                45: "insert",
                46: "del",
                59: ";",
                61: "=",
                96: "0",
                97: "1",
                98: "2",
                99: "3",
                100: "4",
                101: "5",
                102: "6",
                103: "7",
                104: "8",
                105: "9",
                106: "*",
                107: "+",
                109: "-",
                110: ".",
                111: "/",
                112: "f1",
                113: "f2",
                114: "f3",
                115: "f4",
                116: "f5",
                117: "f6",
                118: "f7",
                119: "f8",
                120: "f9",
                121: "f10",
                122: "f11",
                123: "f12",
                144: "numlock",
                145: "scroll",
                173: "-",
                186: ";",
                187: "=",
                188: ",",
                189: "-",
                190: ".",
                191: "/",
                192: "`",
                219: "[",
                220: "\\",
                221: "]",
                222: "'"
            },

            shiftNums: {
                "`": "~",
                "1": "!",
                "2": "@",
                "3": "#",
                "4": "$",
                "5": "%",
                "6": "^",
                "7": "&",
                "8": "*",
                "9": "(",
                "0": ")",
                "-": "_",
                "=": "+",
                ";": ": ",
                "'": "\"",
                ",": "<",
                ".": ">",
                "/": "?",
                "\\": "|"
            },

            // excludes: button, checkbox, file, hidden, image, password, radio, reset, search, submit, url
            textAcceptingInputTypes: [
                "text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime",
                "datetime-local", "search", "color", "tel"],

            // default input types not to bind to unless bound directly
            textInputTypes: /textarea|input|select/i,

            options: {
                filterInputAcceptingElements: true,
                filterTextInputs: true,
                filterContentEditable: true
            }
        };

        function keyHandler(handleObj) {
            if (typeof handleObj.data === "string") {
                handleObj.data = {
                    keys: handleObj.data
                };
            }

            // Only care when a possible input has been specified
            if (!handleObj.data || !handleObj.data.keys || typeof handleObj.data.keys !== "string") {
                return;
            }

            var origHandler = handleObj.handler,
                keys = handleObj.data.keys.toLowerCase().split(" ");

            handleObj.handler = function(event) {
                //      Don't fire in text-accepting inputs that we didn't directly bind to
                if (this !== event.target &&
                    (jQuery.hotkeys.options.filterInputAcceptingElements &&
                     jQuery.hotkeys.textInputTypes.test(event.target.nodeName) ||
                     (jQuery.hotkeys.options.filterContentEditable && jQuery(event.target).attr('contenteditable')) ||
                     (jQuery.hotkeys.options.filterTextInputs &&
                      jQuery.inArray(event.target.type, jQuery.hotkeys.textAcceptingInputTypes) > -1))) {
                    return;
                }

                var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[event.which],
                    character = String.fromCharCode(event.which).toLowerCase(),
                    modif = "",
                    possible = {};

                jQuery.each(["alt", "ctrl", "shift"], function(index, specialKey) {

                    if (event[specialKey + 'Key'] && special !== specialKey) {
                        modif += specialKey + '+';
                    }
                });

                // metaKey is triggered off ctrlKey erronously
                if (event.metaKey && !event.ctrlKey && special !== "meta") {
                    modif += "meta+";
                }

                if (event.metaKey && special !== "meta" && modif.indexOf("alt+ctrl+shift+") > -1) {
                    modif = modif.replace("alt+ctrl+shift+", "hyper+");
                }

                if (special) {
                    possible[modif + special] = true;
                }
                else {
                    possible[modif + character] = true;
                    possible[modif + jQuery.hotkeys.shiftNums[character]] = true;

                    // "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
                    if (modif === "shift+") {
                        possible[jQuery.hotkeys.shiftNums[character]] = true;
                    }
                }

                for (var i = 0, l = keys.length; i < l; i++) {
                    if (possible[keys[i]]) {
                        return origHandler.apply(this, arguments);
                    }
                }
            };
        }

        jQuery.each(["keydown", "keyup", "keypress"], function() {
            jQuery.event.special[this] = {
                add: keyHandler
            };
        });

    })(jQuery || this.jQuery || window.jQuery);

    $("[data-shortcut]").each( function (index, element) {
        var button = $(element);
        $('#msg_body').on('keydown', null, button.attr('data-shortcut'), function (event) {
            event.preventDefault();
            if (button.hasClass('disabled')) {
                return;
            }
            button.click();
        });
    });

});


