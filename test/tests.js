(function() {
	var instance, constructor = window.Heart;

	module( "constructor", {
		setup: function() {
			instance = new constructor({
				element: document.querySelector( ".heart" )
			});
		}
	});

	asyncTest( "start not called by default", function() {
		setTimeout(function() {
			ok( !instance.current && !instance.intervalId );
			start();
		}, instance.interval + 10 );
	});
})();
