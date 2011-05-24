#Pinned Sites

Pinned Sites is a small api providing most all functionality for doing IE9+ site pinning. Functionality still missing and will update soon is style support within Thumbnail ThumbBar, currently it does basic buttons without ability to toggle icons/purpose.

## Taskbar API

flash(intervalInSeconds) - Will flash the taskbar button at the interval provided, when the window is not active. Default interval is 3.

	Pinned.Taskbar.flash(5); //will flash the taskbar every 5 seconds


## Overlay API

This library will automatically remove all overlay icons when leaving the page.

add(iconUri) - Will add an overlay icon to the taskbar button where iconUri is the path to the icon file.  These icons should be 16x16 and the taskbar properties cannot be set to "small icons"

	Pinned.Overlay.add('http://domain/overlay.ico');

blink(iconUri, startTimeInSeconds, durationInSeconds) - Will add the icon after the startTimeInSeconds has elapsed and clear the icon after the durationInSeconds. Default startTimeInSeconds is 5 and durationInSeconds is 3.

	Pinned.Overlay.blink('http://domain/overlay.ico', 5, 3);


removeAfter(iconUri, durationInSeconds) - Will add the icon and clear it after the specified duration. Default durationInSeconds is 5.

	Pinned.Overlay.removeAfter('http://domain/overlay.ico', 5);

clear() - Will clear the overlay icon from the taskbar.

	Pinned.Overlay.clear();
	
## Jumplist API

build(object) - Will build the dynamic jumplist from the JSON object passed in as input. It will also write to the console log when enough jumplist items have been added to go beyond the "typical" (10 items) maximum viewable or beyond the maximum supported by Windows (20 items). 

	Pinned.Jumplist.clear();
    Pinned.Jumplist.build({ 'name': 'Jumplist Example', 
        'items': [
            { 'name': 'Item 1', 'action': 'http://domain', 'icon': 'http://domain/example.ico' },
            { 'name': 'Item 2', 'action': 'http://domain', 'icon': 'http://domain/example.ico' },
            { 'name': 'Item 3', 'action': 'http://domain', 'icon': 'http://domain/example.ico' },
            { 'name': 'Item 4', 'action': 'http://domain', 'icon': 'http://domain/example.ico' },
            { 'name': 'Item 5', 'action': 'http://domain', 'icon': 'http://domain/example.ico' },
            { 'name': 'Item 6', 'action': 'http://domain', 'icon': 'http://domain/example.ico' },
            { 'name': 'Item 7', 'action': 'http://domain', 'icon': 'http://domain/example.ico' },
            { 'name': 'Item 8', 'action': 'http://domain', 'icon': 'http://domain/example.ico' },
            { 'name': 'Item 9', 'action': 'http://domain', 'icon': 'http://domain/example.ico' },
            { 'name': 'Item 10', 'action': 'http://domain', 'icon': 'http://domain/example.ico' }]
    });

Important notes: 

* the dynamic jumplist acts as a stack when adding items... the first item added shows at the bottom
* most users can only see 10 jumplist items (unless they modify their taskbar settings) and the Tasks for pinned sites make up part of the total viewable

clear() - Will clear the dynamic jumplist.

## Thumbnail ThumbBar

build(object) - Will build the thumbbar and show it. If not specified with keepOnUnload = true, the thumbbar will be cleared upon leaving the window.

    Pinned.ThumbBar.build({ 'items':
        [{ 'name': 'Button1', 'icon': 'http://localhost/jamie/pinnedsites/style1.ico', 'callback': LocalEx.button1 },
         { 'name': 'Button2', 'icon': 'http://localhost/jamie/pinnedsites/style2.ico', 'callback': LocalEx.button2}],
        'keepOnUnload': false
    });

hideAll() - Will hide all buttons on the thumbbar.

	Pinned.ThumbBar.hideAll();
