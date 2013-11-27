(function() {
  var heart, proto;

  heart = window.Heart = function( options ) {
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

  proto = heart.prototype;

  proto._tick = function() {
    var newScrollLeft, head;

    // increment the current scroll appropriately
    this._setScrollLeft( this.currentScrollLeft + this.distance );

    // if the current scrolling value is larger than the stored width
    // for the head of the list by a small buffer, move the out of view
    // head to the tail of the list
    if( this.currentScrollLeft > this.headWidth + 20 ) {
      this._moveHead();
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

  proto._head = function() {
    return this.scrollable.querySelector( "p" ); // TODO: Could be any element; should probably be configurable.
  };

  proto.start = function() {
    var self = this;
    this.intervalId = setInterval(function() {
      self._tick();
    }, this.interval );
  };
})();
