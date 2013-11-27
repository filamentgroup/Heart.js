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
})();
