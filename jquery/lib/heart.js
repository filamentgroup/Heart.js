(function( $, w ) {
	"use strict";

	var doc = w.document;

	var heart, proto, transformSupport,
			raf = "requestAnimationFrame" in w && !!Function.prototype.bind,
			pxInEm;


	pxInEm = (function(){
		var ret,
			div = doc.createElement('div'),
			body = doc.body,
			docElem = doc.documentElement,
			originalHTMLFontSize = docElem.style.fontSize,
			originalBodyFontSize = body && body.style.fontSize,
			fakeUsed = false;

		div.style.cssText = "position:absolute;font-size:1em;width:1em";

		if( !body ){
			body = fakeUsed = doc.createElement( "body" );
			body.style.background = "none";
		}

		// 1em in a media query is the value of the default font size of the browser
		// reset docElem and body to ensure the correct value is returned
		docElem.style.fontSize = "100%";
		body.style.fontSize = "100%";

		body.appendChild( div );

		if( fakeUsed ){
			docElem.insertBefore( body, docElem.firstChild );
		}

		ret = div.offsetWidth;

		if( fakeUsed ){
			docElem.removeChild( body );
		}
		else {
			body.removeChild( div );
		}

		// restore the original values
		docElem.style.fontSize = originalHTMLFontSize;
		if( originalBodyFontSize ) {
			body.style.fontSize = originalBodyFontSize;
		}


		//also update eminpx before returning
		ret = parseFloat(ret);

		return ret;
	}());

	transformSupport = (function() {
		var fakeBody,
			de = doc.documentElement,
			bod = doc.body || (function() {
				fakeBody = doc.createElement('body');
				return de.insertBefore( fakeBody, de.firstElementChild || de.firstChild);
			}()),
			el = doc.createElement( "div" ),
			ret = false,
			transforms = {
				"webkitTransform": "-webkit-transform",
				"MozTransform": "-moz-transform",
				"transform": "transform"
			};

		bod.appendChild( el );

		for ( var t in transforms ) {
			if ( el.style[ t ] !== undefined ) {
				el.style[ t ] = "scale(1)";
				ret = w.getComputedStyle( el ).getPropertyValue( transforms[ t ] );
			}
		}

		if( fakeBody ) {
			de.removeChild( fakeBody );
		}
		return !!ret;
	}());

	heart = w.Heart = function( options ) {
		this.distance = options.distance || 1;
		this.interval = options.interval || 10;
		this.bufferLength = options.bufferLength || 2;
		this.element = options.element;
		this.scrollable = options.scrollable || this.element.find( "ul" );
		this.snapback = options.snapback === false ? false : true;

		// store the value, less repainting
		this.currentScrollLeft = this.scrollable.scrollLeft();
		this.headWidth = this._head().offsetWidth;

		this._setOffset = this[ "_set" + ( this._transformSupport() ? "Slide" : "Scroll" ) + "Left" ];

		if( options.start ) {
			this.start();
		}
	};

	proto = heart.prototype;

	proto._transformSupport = function() {
		return transformSupport;
	};

	proto._tick = function() {
		var newScrollLeft, head;

		// increment the current scroll appropriately
		this._setOffset( this.currentScrollLeft + this.distance );

		// if the current scrolling value is larger than the stored width
		// for the head of the list by a small buffer, move the out of view
		// head to the tail of the list
		if( this.currentScrollLeft > this.headWidth*this.bufferLength ) {
			if( raf ) {
				this.currentraf = w.requestAnimationFrame( this._moveHead.bind(this) );
			} else {
				this._moveHead();
			}
		}
	};

	proto._moveHead = function( head ) {
		head = this._head();

		// move the head to the tail
		this.scrollable.append( head );

		// make sure the scroll left accounts for the movement of the scrolling
		this._setOffset( this.currentScrollLeft - head.offsetWidth - pxInEm );

		// set the new head of the list
		this.headWidth = this._head().offsetWidth;
	};

	proto._setScrollLeft = function( value ) {
		this.currentScrollLeft = this.element[0].scrollLeft = value;
	};

	proto._setSlideLeft = function( value ) {
		var curr = ( ( this.scrollable.css( "transform" ) || "0" ).match(/([0-9])/)); //TODO: There must be a better way of doing this.
		this.scrollable.css("webkitTransform", "translateX(" + -value + "px)" );
		this.scrollable.css( "MozTransform", "translateX(" + -value + "px)" );
		this.scrollable.css( "transform", "translateX(" + -value + "px)" ); // TODO: This should probably loop.

		this.currentScrollLeft = curr = value;
	};

	proto._head = function() {
		var head = this.scrollable[0].childNodes[0];

		while( head.nodeType !== 1 ) {
			this.scrollable[0].removeChild( head );
			head = this.scrollable[0].childNodes[0];
		}

		return head;
	};

	proto._rafbeat = function(){
		this._tick();
		this.currentraf = w.requestAnimationFrame( this._rafbeat.bind(this) );
	};

	proto._snapBack = function(){
		var scroller = this.scrollable,
			snapEnd = function( e ) {
				var el = $( e.target ),
					type = e.originalEvent.propertyName.indexOf("webkit") > -1 ? "webkitTransitionEnd" : e.type;

				el.css( "webkitTransition", "" );
				el.css( "transition", "" );

				el.off( type, snapEnd );
			};

		// TODO: Should non-transition browsers get an animated snap, or just immediately reset?
		scroller.on( "webkitTransitionEnd", snapEnd );
		scroller.on( "transitionend", snapEnd );

		scroller.css( "webkitTransition", "-webkit-transform linear .1s" );
		scroller.css( "transition", "transform linear .1s" );

		this._setOffset( -1 );
	};

	proto.bindEvents = function(){
		var self = this;
		var el = $( this.element );
		var currentScrollLeft;
		el
			.on( "mouseover dragstart" , function(e){
				self.stop();
			})
			.on( "mouseout dragend" , function(e){
				self.start();
			})
			.on( "mousedown dragstart", function(e){
				e.stopPropagation();
				currentScrollLeft = self.currentScrollLeft;
				w.mouseDrag(e);
			})
			.on( "mousemove", w.mouseDrag )
			.on( "mouseup dragend", function(e){
				e.stopPropagation();
				var csl = self.currentScrollLeft;

				if( csl < 0 && self.snapback ) {
					self._snapBack();
				}
				w.mouseDrag.call( this, e );
			})
			.on( "dragmove", function(e, detail){
				e.stopPropagation();
				var csl;

				if( currentScrollLeft !== undefined ) {
					csl = currentScrollLeft;
				} else {
					csl = self.currentScrollLeft;
				}

				if( self.snapback ){
					self._setOffset( csl - detail.deltaX );
				} else {
					/* Set the scroll position to the current left position minus the movement amount, which may be positive or negative.
					A negative total would mean scrolling past the first item, so instead set the scroll to zero. This could be set to only
					set a value when the total is greater than zero, but scrubbing back to the start of the ticker too quickly might cut
					off part of the first item — setting the value to zero prevents that. */
					self._setOffset( csl - detail.deltaX < 0 ? 0 : csl - detail.deltaX );
				}
			});

		el
			.on( "touchstart touchend", w.touchEvents )
			.on( "touchmove", function( e ){
				w.touchEvents( e );
				e.stopPropagation();
			} );
	};

	proto.start = function() {
		var self = this;
		if( raf ) {
			this.currentraf = w.requestAnimationFrame( this._rafbeat.bind(this) );
		} else {
			w.clearInterval( this.intervalId );
			this.intervalId = w.setInterval(function() {
				self._tick();
			}, this.interval );
		}
	};

	proto.stop = function() {
		if( raf ){
			w.cancelAnimationFrame( this.currentraf );
		} else {
			w.clearInterval( this.intervalId );
		}
	};
})( jQuery, this );
