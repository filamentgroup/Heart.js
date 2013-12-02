(function( w ) {
	"use strict";

	var doc = w.document;

	if( !("querySelectorAll" in doc ) ){
		return;
	}

	var heart, proto, transformSupport,
			raf = "requestAnimationFrame" in w && !!Function.prototype.bind;

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
		this.element = options.element;
		this.scrollable = options.scrollable || this.element.querySelector( "ul" );

		// store the value, less repainting
		this.currentScrollLeft = this.scrollable.scrollLeft;
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
		if( this.currentScrollLeft > this.headWidth + 20 ) {
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
		this.scrollable.appendChild( head );

		// make sure the scroll left accounts for the movement of the scrolling
		this._setOffset( this.currentScrollLeft - head.offsetWidth );

		// set the new head of the list
		this.headWidth = this._head().offsetWidth;
	};

	proto._setScrollLeft = function( value ) {
		this.currentScrollLeft = this.element.scrollLeft = value;
	};

	proto._setSlideLeft = function( value ) {
		var curr = ( this.scrollable.style.transform || "0" ).match(/([0-9])/); //TODO: There must be a better way of doing this.
		this.scrollable.style.webkitTransform = "translateX(" + -value + "px)";
		this.scrollable.style.MozTransform = "translateX(" + -value + "px)";
		this.scrollable.style.transform = "translateX(" + -value + "px)"; // TODO: This should probably loop.

		this.currentScrollLeft = curr = value;
	};

	proto._head = function() {
		var head = this.scrollable.childNodes[0];

		while( head.nodeType !== 1 ) {
			this.scrollable.removeChild( head );
			head = this.scrollable.childNodes[0];
		}

		return head;
	};

	proto._rafbeat = function(){
		this._tick();
		this.currentraf = w.requestAnimationFrame( this._rafbeat.bind(this) );
	};

	proto.bindEvents = function(){
		var self = this;
		var currentScrollLeft;
		this.element.addEventListener( "mouseover" , function(e){
			self.stop();
		});
		this.element.addEventListener( "mouseout" , function(e){
			self.start();
		});
		this.element.addEventListener( "mousedown", function(e){
			e.stopPropagation();
			currentScrollLeft = self.currentScrollLeft;
			w.mouseDrag(e);
		} );
		this.element.addEventListener( "mousemove", w.mouseDrag );
		this.element.addEventListener( "mouseup", w.mouseDrag );
		this.element.addEventListener( "dragmove", function(e){
			e.stopPropagation();
			var detail = e.detail, csl;

			if( currentScrollLeft ) {
				csl = currentScrollLeft;
			} else {
				csl = self.currentScrollLeft;
			}

			/* Set the scroll position to the current left position minus the movement amount, which may be positive or negative.
			A negative total would mean scrolling past the first item, so instead set the scroll to zero. This could be set to only 
			set a value when the total is greater than zero, but scrubbing back to the start of the ticker too quickly might cut 
			off part of the first item — setting the value to zero prevents that. */
			self._setOffset( csl - detail.deltaX < 0 ? 0 : csl - detail.deltaX );
		});
	};

	proto.start = function() {
		var self = this;
		if( raf ) {
			this.currentraf = w.requestAnimationFrame( this._rafbeat.bind(this) );
		} else {
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
})( this );
