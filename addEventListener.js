/* Adds AddEventListener to IE8 */
(function( w ) {
	"use strict";
	var Event = w.Event,
		Element = w.Element,
		doc = w.document,
		HTMLDocument = w.HTMLDocument;

	if (!Event.prototype.preventDefault) {
		Event.prototype.preventDefault=function() {
			this.returnValue=false;
		};
	}
	if (!Event.prototype.stopPropagation) {
		Event.prototype.stopPropagation=function() {
			this.cancelBubble=true;
		};
	}
	if (!Element.prototype.addEventListener) {
		var eventListeners=[];
		
		var addEventListener=function(type,listener /*, useCapture (will be ignored) */) {
			var self=this;
			var wrapper=function(e) {
				e.target=e.srcElement;
				e.currentTarget=self;
				if (listener.handleEvent) {
					listener.handleEvent(e);
				} else {
					listener.call(self,e);
				}
			};
			if (type=="DOMContentLoaded") {
				var wrapper2=function(e) {
					if (doc.readyState=="complete") {
						wrapper(e);
					}
				};
				doc.attachEvent("onreadystatechange",wrapper2);
				eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper2});
				
				if (doc.readyState=="complete") {
					var e=new Event();
					e.srcElement=w;
					wrapper2(e);
				}
			} else {
				this.attachEvent("on"+type,wrapper);
				eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
			}
		};
		var removeEventListener=function(type,listener /*, useCapture (will be ignored) */) {
			var counter=0;
			while (counter<eventListeners.length) {
				var eventListener=eventListeners[counter];
				if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
					if (type=="DOMContentLoaded") {
						this.detachEvent("onreadystatechange",eventListener.wrapper);
					} else {
						this.detachEvent("on"+type,eventListener.wrapper);
					}
					break;
				}
				++counter;
			}
		};
		Element.prototype.addEventListener=addEventListener;
		Element.prototype.removeEventListener=removeEventListener;
		if (HTMLDocument) {
			HTMLDocument.prototype.addEventListener=addEventListener;
			HTMLDocument.prototype.removeEventListener=removeEventListener;
		}
		if (w) {
			w.prototype.addEventListener=addEventListener;
			w.prototype.removeEventListener=removeEventListener;
		}
	}
})( this );
