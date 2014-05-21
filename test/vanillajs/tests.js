(function() {
	var oldTransformSupport,instance, constructor = window.Heart;

	module( "constructor", {
		setup: function() {
			oldTransformSupport = constructor.prototype._transformSupport;
		},

		teardown: function() {
			constructor.prototype._transformSupport = oldTransformSupport;
		}
	});

	asyncTest( "start not called by default", function() {
		instance = new constructor({
			element: document.querySelector( ".heart" )
		});

		setTimeout(function() {
			ok( !instance.currentraf && !instance.intervalId );
			start();
		}, instance.interval + 10 );
	});

	asyncTest( "start called when the option is set", function() {
		instance = new constructor({
			element: document.querySelector( ".heart" ),
			start: true
		});

		setTimeout(function() {
			ok( instance.currentraf || instance.intervalId );
			start();
		}, instance.interval + 10 );

		instance.stop();
	});

	test( "transform support uses slide method", function() {
		constructor.prototype._transformSupport = function() {
			return true;
		};

		instance = new constructor({
			element: document.querySelector( ".heart" )
		});

		equal( instance._setOffset, constructor.prototype._setSlideLeft );
	});

	test( "transform support uses scroll method", function() {
		constructor.prototype._transformSupport = function() {
			return false;
		};

		instance = new constructor({
			element: document.querySelector( ".heart" )
		});

		equal( instance._setOffset, constructor.prototype._setScrollLeft );
	});

	module( "head", {
		setup: function() {
			instance = new constructor({
				element: document.querySelector( ".heart" )
			});
		}
	});

	test( "head skips text nodes", function() {
		var i = instance.scrollable.childNodes.length;

		while( i > 0 ) {
			equal(instance._head().nodeType, 1);
			instance._moveHead();
			i--;
		}
	});

	module( "ticks", {
		setup: function() {
			instance = new constructor({
				element: document.querySelector( ".heart" )
			});
		}
	});

	asyncTest( "each tick calls setOffset", function() {
		var count = 0;
		instance._setOffset = function() {
			count++;
		};

		instance.start();

		equal( count, 0 );

		setTimeout(function() {
			ok( count > 0 );
			instance.stop();
			start();
		}, 200);
	});

	asyncTest( "moves head to tail", function() {
		var head = instance._head();

		instance.currentScrollLeft = instance.headWidth*instance.bufferLength;

		equal(head, instance._head());

		instance._tick();

		// TODO this bothers me, the append is delayed.
		setTimeout(function() {
			ok( head !== instance._head());
			start();
		}, 200);
	});
})();
