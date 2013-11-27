(function( w ) {
  "use strict";

  var doc = w.document;

  if( !("querySelectorAll" in doc ) ){
    return;
  }

  var heart, proto, transform3d, raf = "requestAnimationFrame" in w && !!Function.prototype.bind;

  heart = w.Heart = function( options ) {
    this.distance = options.distance || 1;
    this.interval = options.interval || 10;
    this.element = options.element;
    this.scrollable = options.scrollable || this.element.querySelector( "ul" );

    // store the value, less repainting
    this.currentScrollLeft = this.scrollable.scrollLeft;
    this.headWidth = this._head().offsetWidth;

    if( options.start ) {
      this.start();
    }
  };

  transform3d = (function() {
    var fakeBody,
      de = doc.documentElement,
      bod = doc.body || (function() {
        fakeBody = doc.createElement('body');
        return de.insertBefore( fakeBody, de.firstElementChild || de.firstChild);
      }()),
      el = doc.createElement( "div" ),
      prop = "transform-3d",
      vendors = [ "Webkit", "Moz", "O" ],
      mm = "matchMedia" in w,
      ret = false,
      transforms, t;

    if( mm ) {
      ret = w.matchMedia( "(-" + vendors.join( "-" + prop + "),(-" ) + "-" + prop + "),(" + prop + ")" ).matches;
    }

    if( !ret ) {
      transforms = {
        "MozTransform": "-moz-transform",
        "transform": "transform"
      };

      bod.appendChild( el );

      for ( t in transforms ) {
        if ( el.style[ t ] !== undefined ) {
          el.style[ t ] = "translate3d( 100px, 1px, 1px )";
          ret = w.getComputedStyle( el ).getPropertyValue( transforms[ t ] );
        }
      }
    }

    if( fakeBody ) {
      de.removeChild( fakeBody );
    }

    return ( !!ret && ret !== "none" );
  }());

  proto = heart.prototype;

  proto._tick = function() {
    var newScrollLeft, head;

    // increment the current scroll appropriately
    this[ "_set" + ( transform3d ? "Slide" : "Scroll" ) + "Left" ]( this.currentScrollLeft + this.distance );

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
    this.scrollable.appendChild(head);

    // make sure the scroll left accounts for the movement of the scrolling
    this._setScrollLeft( this.currentScrollLeft - head.offsetWidth );

    // set the new head of the list
    this.headWidth = this._head().offsetWidth;
  };

  proto._setScrollLeft = function( value ) {
    this.currentScrollLeft = this.element.scrollLeft = value;
  };

  proto._setSlideLeft = function( value ) {
    var curr = ( this.scrollable.style.webkitTransform || "0" ).match(/([0-9])/); //TODO: There must be a better way of doing this.
    this.scrollable.style.webkitTransform = "translateX(" + -value + "px)";

    this.currentScrollLeft = curr = value;
  };

  proto._head = function() {
    return this.scrollable.querySelector( "p" ); // TODO: Could be any element; should probably be configurable.
  };

  proto._bindScrubbingEvents = function(){
    var self = this;
    this.element.addEventListener( "mouseover" , function(e){
      self.stop();
    });
  };

  proto._rafbeat = function(){
    this._tick();
    this.currentraf = w.requestAnimationFrame( this._rafbeat.bind(this) );
  };

  proto.start = function() {
    var self = this, beat;
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
