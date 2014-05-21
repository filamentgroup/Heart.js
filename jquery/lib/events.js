/*
 * responsive-carousel touch drag extension
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function($, w) {
	var origin,
		data = {},
		deltaY,
		xPerc,
		yPerc,
		emitEvents = function( e ){
			var touches = e.touches || e.originalEvent.touches,
				$elem = $( e.target );
			e.stopPropagation();

			if( e.type === "touchstart" ){
				origin = {
					x : touches[ 0 ].pageX,
					y: touches[ 0 ].pageY
				};
			}

			if( touches[ 0 ] && touches[ 0 ].pageX ){
				data.touches = touches;
				data.deltaX = touches[ 0 ].pageX - origin.x;
				data.deltaY = touches[ 0 ].pageY - origin.y;
				data.w = $elem.first().width();
				data.h = $elem.first().height();
				data.xPercent = data.deltaX / data.w;
				data.yPercent = data.deltaY / data.h;
				data.srcEvent = e;
			}

			$elem.trigger( "drag" + e.type.split( "touch" )[ 1 ], [data] );
			return false;
		};

		w.touchEvents = emitEvents;

 }(jQuery, this));

(function($, w){
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

			$( this ).trigger( "dragmove", [data] );
		}
		if( e.type == "mouseup" ) {
			clicked = false;
		}
		if( e.type == "mouseout" ) {
			var moveTo = e.toElement || e.relatedTarget,
				contains = function( el, parent ) {
				if( parent ) {
					while( ( parent = parent.parentNode ) ) {
						if( parent === el ) {
							return true;
						}
					}
				}
				return false;
			};

			if( !contains( this, moveTo ) ) {
				clicked = false;
			}
		}
	};

}(jQuery, this));
