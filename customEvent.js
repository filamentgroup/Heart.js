// Custom event polyfill for IE9/10
(function ( w ) {
	"use strict";

	var doc = w.document;

	var CustomEvent = function( e, params ) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = doc.createEvent( 'CustomEvent' );
		evt.initCustomEvent( e, params.bubbles, params.cancelable, params.detail );
		return evt;
	};

	CustomEvent.prototype = w.CustomEvent.prototype;

	w.CustomEvent = CustomEvent;

}(this));
