Heart.js
========

Get it? It’s a ticker. “Heart,” “ticker?” Eh, eh?

### Repo Setup

```
$ npm install
$ grunt
```

Check out `vanillajs/index.html` or `jquery/index.html` to see the pure JavaScript and jQuery versions, respectively.

### Invoking the plugin

#### Vanilla JS

```
document.addEventListener( "DOMContentLoaded", function( e ){
    var heart = document.querySelector( ".heart" );

    window.h = new window.Heart({
        element: heart
    });

    window.h.bindEvents();
});
```

#### jQuery

```
jQuery(function( $ ){
    var heart = $( ".heart" );

    var h = new window.Heart({
        element: heart
    });

    h.bindEvents();
});
```

#### Configuration Options

Defaults shown below.

```
document.addEventListener( "DOMContentLoaded", function( e ){
    var heart = document.querySelector( ".heart" );
    window.h = new window.Heart({
        element: heart, // Required.
        scrollable: this.element.querySelector( "ul" ), // The element to be scrolled.
        distance: 1, // The distance scrolled per “tick”
        interval: 10, // The time between “ticks” (in ms). This setting only applies in browsers where `requestAnimationFrame` is unsupported, as rAF will allow the browser to decide the most efficient interval.
        bufferLength: 2, // The buffer, in individual ticker item widths, before items are removed from the front of the stack and appended to the end of the ticker.
        snapback: true // Adds a snapping effect when the user attempts to scrub backwards beyond the first ticker item, rather than just halting.
    });
    window.h.bindEvents();
});
```

### Test Suites

Test suites for both versions of the plugin are available at <a href="http://filamentgroup.github.io/Heart.js/test/vanillajs/">test/vanillajs</a> and <a href="http://filamentgroup.github.io/Heart.js/test/jquery">test/jquery</a>
