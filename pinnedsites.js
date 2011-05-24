/*!
* Pinned Sites
* https://github.com/jamie-altizer/PinnedSites
*
* Copyright 2011, Jamie Altizer
* Licensed under the MIT
* https://github.com/jamie-altizer/PinnedSites/blob/master/LICENSE
*
* Date: Tues May 24 8:30:00 2011 -0500
*/

//If something does not seem to be functioning, please check the Debugging Console of your browser
//  for potential information as to why not.
window.Pinned = function () {
    function hasFuncitonality() {
        return typeof window.external.msAddSiteMode != 'undefined';
    }
    function writeToConsole(text) {
        if (typeof console != 'undefined' &&
            typeof console.log != 'undefined') {
            console.log(text);
        }
    }

    //Window Unload cleanup
    var unloadCallbacks = [];
    function windowUnload() {
        for (var item = 0; item < unloadCallbacks.length; ++item) {
            unloadCallbacks[item]();
        }
    }
    window.onunload = windowUnload;

    return {

        isPinned: function () {
            if (hasFuncitonality()) {
                return window.external.msIsSiteMode();
            }
            return false;
        },

        Taskbar: function () {
            function flash() {
                window.external.msSiteModeActivate();
            }

            return {
                flash: function (intervalInSeconds) {
                    if (hasFuncitonality()) {
                        if (intervalInSeconds == undefined) {
                            intervalInSeconds = 3;
                        }

                        setInterval(flash, 1000 * intervalInSeconds);
                    }
                }
            };
        } (),

        Overlay: function () {
            var blinkiconUri = '';
            var blinkDuration = 0;

            function add(iconUri) {
                if (hasFuncitonality()) {
                    writeToConsole('If your icon does not showup, this is because the taskbar ' +
                        'has to be set to display "large icons"');

                    window.external.msSiteModeSetIconOverlay(iconUri);

                    //Add clear() to window.unload callback list
                    unloadCallbacks.push(clear);
                }

                if (blinkDuration != 0) {
                    setInterval(clear, 1000 * blinkDuration);
                }
            }

            function clear() {
                if (hasFuncitonality()) {
                    window.external.msSiteModeClearIconOverlay();
                }
            }

            return {
                add: function (iconUri) {
                    if (iconUri == undefined) {
                        iconUri = blinkiconUri;
                    }

                    add(iconUri);
                },

                clear: function () {
                    clear();
                },

                removeAfter: function (iconUri, durationInSeconds) {
                    if (hasFuncitonality()) {
                        add(iconUri);
                    }

					if (durationInSeconds == undefined) {
                        durationInSeconds = 5;
                    }

                    setInterval(this.clear, 1000 * durationInSeconds);
                },

                blink: function (iconUri, startTimeInSeconds, durationInSeconds) {
                    if (hasFuncitonality()) {
                        if (startTimeInSeconds == undefined) {
                            startTimeInSeconds = 5;
                        }
                        blinkiconUri = iconUri;

                        if (durationInSeconds == undefined) {
                            durationInSeconds = 3;
                        }
                        blinkDuration = durationInSeconds;

                        setInterval(this.add, 1000 * startTimeInSeconds);
                    }
                }
            };
        } (),

        Jumplist: function () {
            var listMax = 20;           //Maximum Windows supports at this time
            var listPsuedoMax = 10;     //Number of items to suggest limiting the JumpList to

            function sanityCheck(list) {
                if (list.length > listMax - 1) {
                    writeToConsole('The JumpList have a maximum total of ' + listMax + ' viewable items, ' +
                        'typically users only have their environment setup to view only ' + listPsuedoMax + '.');
                } else if (list.length > listPsuedoMax - 1) {
                    writeToConsole('The JumpList should stay at ' + listPsuedoMax + ' items or less, typically ' +
                        'users only have their environment setup to view only 10.');
                }
            }

            return {

                build: function (object) {
                    if (hasFuncitonality()) {

                        window.external.msSiteModeCreateJumplist(object.name);

                        sanityCheck(object.items);

                        for (var item = 0; item < object.items.length; ++item) {
                            window.external.msSiteModeAddJumpListItem(object.items[item].name,
                                object.items[item].action,
                                object.items[item].icon);
                        }

                        window.external.msSiteModeShowJumplist();
                    }
                },

                clear: function () {
                    if (hasFuncitonality()) {
                        window.external.msSiteModeClearJumplist();
                    }
                },

            };
        } (),

        ThumbBar: function () {
            var buttons = [];
            var buttonMax = 7;

            function bindEvent(el, eventName, eventHandler) {
                if (el.addEventListener) {
                    el.addEventListener(eventName, eventHandler, false);
                }
                else if (el.attachEvent) {
                    el.attachEvent('on' + eventName, eventHandler);
                }
            }
            function buttonListener(e) {
                for (var item = 0; item <= buttons.length; ++item) {
                    if (e.buttonID - 1 == item) {
                        buttons[item].callback();
                        return;
                    }
                }
            }

            function add(name, iconUri, eventCallback) {
                if (hasFuncitonality()) {
                    if (buttons.length >= buttonMax - 1) {
                        writeToConsole('The ThumbBar should not have more than ' + buttonMax + ' buttons.');
                        return;
                    }

                    var button = window.external.msSiteModeAddThumbBarButton(iconUri, name);

                    buttons.push({ 'id': button, 'callback': eventCallback });
                }
            }

            function updateThumbBar() {
                for (var item = 0; item < buttons.length; ++item) {
                    window.external.msSiteModeUpdateThumbBarButton(buttons[item].id, true, true);
                }
            }

            function hideButton(buttonId) {
                window.external.msSiteModeUpdateThumbBarButton(buttonId, false, false);
            }

            return {

                build: function (object) {
                    if (hasFuncitonality()) {
                        if (object.keepOnUnload == undefined || object.keepOnUnload !== true) {
                            //Set unload to cleanup resources only valid to mysite
                            unloadCallbacks.push(this.hideAll);
                        }

                        //Had an issue where IE9 would not support addEventListener
                        bindEvent(document, 'msthumbnailclick', buttonListener);

                        for (var item = 0; item < object.items.length; ++item) {
                            var button = object.items[item];
                            add(button.name, button.icon, button.callback);
                        }

                        window.external.msSiteModeShowThumbBar();
                        updateThumbBar();

                    }
                },

                hideAll: function () {
                    for (var item = 0; item < buttons.length; ++item) {
                        hideButton(buttons[item].id);
                    }
                }

            };
        } ()
    };
} ();
