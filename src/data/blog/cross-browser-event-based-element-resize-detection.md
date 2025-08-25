---
title: 'Cross-Browser, Event-based, Element Resize Detection'
pubDatetime: 2013-03-18T22:25:20Z
author: 'Daniel Buchner'
tags:
  - JavaScript
  - DOM
  - resize detection
  - cross-browser
  - events
description: A cross-browser solution for detecting element resize events using hidden object elements, enabling responsive behavior beyond window resize events.
---

**UPDATE:** This post has seen a significant change from the first version of the code. It now relies on a much simpler method: a hidden `object` element that relays its resize event to your listeners.

## DOM Elements! Y U No Resize Event?

During your coding adventures, you may have run into occasions where you wanted to know when an element in your document changed dimensions - basically the window resize event, but on regular elements. Element size changes can occur for many reasons: modifications to CSS width, height, padding, as a response to changes to a parent element's size, and many more. Before today, you probably thought this was mere unicorn lore, an impossible feat - well buckle up folks, we're about to throw down the gauntlet.

## Eye of Newt, and Toe of Frog

The following is the script provides two methods that take care of everything. To enable our resize listening magic, we inject an object element into the target element, set a list of special styles to hide it from view, and monitor it for resize - it acts as a trigger for alerting us when the target element parent is resized. The first method the script provides is `addResizeListener`, it manages all your listeners and monitors the element for resize using the injected `object` element. The other method is `removeResizeListener`, and it ensures that your listeners are properly detached when you want them removed.

```javascript
(function(){
  var attachEvent = document.attachEvent;
  var isIE = navigator.userAgent.match(/Trident/);
  console.log(isIE);
  var requestFrame = (function(){
    var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function(fn){ return window.setTimeout(fn, 20); };
    return function(fn){ return raf(fn); };
  })();
  
  var cancelFrame = (function(){
    var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
           window.clearTimeout;
    return function(id){ return cancel(id); };
  })();
  
  function resizeListener(e){
    var win = e.target || e.srcElement;
    if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
    win.__resizeRAF__ = requestFrame(function(){
      var trigger = win.__resizeTrigger__;
      trigger.__resizeListeners__.forEach(function(fn){
        fn.call(trigger, e);
      });
    });
  }
  
  function objectLoad(e){
    this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
    this.contentDocument.defaultView.addEventListener('resize', resizeListener);
  }
  
  window.addResizeListener = function(element, fn){
    if (!element.__resizeListeners__) {
      element.__resizeListeners__ = [];
      if (attachEvent) {
        element.__resizeTrigger__ = element;
        element.attachEvent('onresize', resizeListener);
      }
      else {
        if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
        var obj = element.__resizeTrigger__ = document.createElement('object'); 
        obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
        obj.__resizeElement__ = element;
        obj.onload = objectLoad;
        obj.type = 'text/html';
        if (isIE) element.appendChild(obj);
        obj.data = 'about:blank';
        if (!isIE) element.appendChild(obj);
      }
    }
    element.__resizeListeners__.push(fn);
  };
  
  window.removeResizeListener = function(element, fn){
    element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
    if (!element.__resizeListeners__.length) {
      if (attachEvent) element.detachEvent('onresize', resizeListener);
      else {
        element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
        element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
      }
    }
  }
})();
```

## Demo-licious!

Here's a pseudo code usage of the method.

```javascript
var myElement = document.getElementById('my_element'),
    myResizeFn = function(){
        /* do something on resize */
    };
addResizeListener(myElement, myResizeFn);
removeResizeListener(myElement, myResizeFn);
```

Cut to the chase, let's see this resize thang in action: [Demo of resize listeners](https://www.backalleycoder.com/resize-demo.html)## Resize ALL The Things!

Now that we're equipped with a nifty, cross-browser element resize event, what would it be good for? Here's a few possible uses: - Resize-proof Web Component UI development
- Per-element responsive design
- Size-based loading of content
- Anything you can imagine!