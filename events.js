// Custom event polyfill for IE9/10
(function ( w ) {
	"use strict";

	if( !("CustomEvent" in w ) ){
		var doc = w.document;

		var CustomEvent = function( event, params ) {
			params = params || { bubbles: false, cancelable: false, detail: undefined };
			var evt = doc.createEvent( 'CustomEvent' );
			evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
			return evt;
		};

		CustomEvent.prototype = w.CustomEvent.prototype;

		w.CustomEvent = CustomEvent;
	}
}(this));

(function(w){
	"use strict";
	var doc = w.document;

	var clicked,
	origin;
	w.mouseDrag = function( e ) {
		var data = {};
		if( e.type == "mousedown" ) {
			clicked = true;
			origin = {
				x : e.pageX,
				e : e
			};
			data.srcEvent = origin.e;
			e.preventDefault();
		}
		if( ( e.type == "mousedown" || e.type == "mousemove" ) && clicked ) {
			data.deltaX = e.pageX - origin.x;
			data.srcEvent = origin.e;

			if( e.type == "mousemove" ) {
				data.moveEvent = e;
			}

			var ev = new w.CustomEvent("dragmove", { detail: data });
			this.dispatchEvent( ev );
		}
		if( e.type == "mouseup" ) {
			clicked = false;
		}
	};

}(this));
