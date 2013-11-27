(function() {
	var instance, constructor = window.Heart;

	module( "constructor", {
		setup: function() {
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
})();
