
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
