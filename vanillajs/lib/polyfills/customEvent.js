// Custom event polyfill for IE9/10
(function ( w ) {
	"use strict";

	try {
		var c = new w.CustomEvent("t");
	} catch(e) {
		var doc = w.document, CustomEvent;

		if( w.CustomEvent ){
			CustomEvent = function( e, params ) {
				params = params || { bubbles: false, cancelable: false, detail: undefined };
				var evt = doc.createEvent( 'CustomEvent' );
				evt.initCustomEvent( e, params.bubbles, params.cancelable, params.detail );
				return evt;
			};

			CustomEvent.prototype = w.CustomEvent.prototype;
		} else {

			CustomEvent = function( e, params ){
				params = params || { bubbles: true, cancelable: true, detail: undefined };
				var evt = doc.createEvent( 'Event' );
				evt.initEvent( e, params.bubbles, params.cancelable );
				evt.detail = params.detail;
				return evt;
			};

			CustomEvent.prototype = w.Event.prototype;
		}

		w.CustomEvent = CustomEvent;
	}

}(this));
