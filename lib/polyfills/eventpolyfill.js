// Modification of EventListener | MIT/GPL2 | github.com/jonathantneal/EventListener,
// starting with https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener
(function( w ){
	"use strict";
	var doc = w.document,
		Window = w.Window,
		Event = w.Event,
		Element = w.Element,
		HTMLDocument = w.HTMLDocument;

	if (!Event.prototype.preventDefault) {
		Event.prototype.preventDefault=function() {
			this.returnValue=false;
		};
	}
	if (!Event.prototype.stopPropagation) {
		Event.prototype.stopPropagation=function() {
			this.cancelBubble=true;
		};
	}
	if (!Element.prototype.addEventListener) {
		var eventListeners=[];
		
		var addEventListener=function(type,listener /*, useCapture (will be ignored) */) {
			var target = this,
				listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
				typeListeners = listeners[type] = listeners[type] || [];

			// if no events exist, attach the listener
			if (!typeListeners.length) {
				target.attachEvent("on" + type, typeListeners.event = function (event) {
					var documentElement = target.document && target.document.documentElement || target.documentElement || { scrollLeft: 0, scrollTop: 0 };

					// polyfill w3c properties and methods
					event.currentTarget = target;
					event.pageX = event.clientX + documentElement.scrollLeft;
					event.pageY = event.clientY + documentElement.scrollTop;
					event.preventDefault = function () { event.returnValue = false; };
					event.relatedTarget = event.fromElement || null;
					event.stopImmediatePropagation = function () { immediatePropagation = false; event.cancelBubble = true; };
					event.stopPropagation = function () { event.cancelBubble = true; };
					event.target = event.srcElement || target;
					event.timeStamp = +new Date();

					// create an cached list of the master events list (to protect this loop from breaking when an event is removed)
					for (var i = 0, typeListenersCache = [].concat(typeListeners), typeListenerCache, immediatePropagation = true; immediatePropagation && (typeListenerCache = typeListenersCache[i]); ++i) {
						// check to see if the cached event still exists in the master events list
						for (var ii = 0, typeListener; typeListener = typeListeners[ii]; ++ii) {
							if (typeListener == typeListenerCache) {
								typeListener.call(target, event);

								break;
							}
						}
					}
				});
			}

			// add the event to the master event list
			typeListeners.push(listener);
		};
		var removeEventListener=function(type,listener /*, useCapture (will be ignored) */) {
			var target = this,
			listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
			typeListeners = listeners[type] = listeners[type] || [];

			// remove the newest matching event from the master event list
			for (var i = typeListeners.length - 1, typeListener; typeListener = typeListeners[i]; --i) {
				if (typeListener == listener) {
					typeListeners.splice(i, 1);

					break;
				}
			}

			// if no events exist, detach the listener
			if (!typeListeners.length && typeListeners.event) {
				target.detachEvent("on" + type, typeListeners.event);
			}
		};
		var dispatchEvent = function(eventObject){
			var target = this,
			type = eventObject.type,
			listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
			typeListeners = listeners[type] = listeners[type] || [];

			try {
				return target.fireEvent("on" + type, eventObject);
			} catch (error) {
				if (typeListeners.event) {
					typeListeners.event(eventObject);
				}
				return;
			}

		};
		Element.prototype.addEventListener=addEventListener;
		Element.prototype.removeEventListener=removeEventListener;
		Element.prototype.dispatchEvent=dispatchEvent;
		if (HTMLDocument) {
			HTMLDocument.prototype.addEventListener=addEventListener;
			HTMLDocument.prototype.removeEventListener=removeEventListener;
			HTMLDocument.prototype.dispatchEvent=dispatchEvent;
		}
		if (Window) {
			Window.prototype.addEventListener=addEventListener;
			Window.prototype.removeEventListener=removeEventListener;
			Window.prototype.dispatchEvent=dispatchEvent;
		}
	}

	// CustomEvent
	Object.defineProperty(Window.prototype, "CustomEvent", {
		get: function () {
			var self = this;

			return function CustomEvent(type, eventInitDict) {
				var event = self.document.createEventObject(), key;

				event.type = type;
				for (key in eventInitDict) {
					if (key == 'cancelable'){
						event.returnValue = !eventInitDict.cancelable;
					} else if (key == 'bubbles'){
						event.cancelBubble = !eventInitDict.bubbles;
					} else if (key == 'detail'){
						event.detail = eventInitDict.detail;
					}
				}
				return event;
			};
		}
	});
	// ready
	function ready(event) {
		if (ready.interval && doc.body) {
			ready.interval = w.clearInterval(ready.interval);

			doc.dispatchEvent(new w.CustomEvent("DOMContentLoaded"));
		}
	}

	ready.interval = w.setInterval(ready, 1);

	w.addEventListener("load", ready);

}( this ));
