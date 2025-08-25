---
title: 'The Oft-Overlooked Overflow and Underflow Events'
pubDatetime: 2013-03-14T10:26:54Z
author: 'Daniel Buchner'
tags:
  - CSS
  - JavaScript
  - DOM events
  - overflow
  - web development
description: Exploring the lesser-known overflow and underflow events in Firefox and WebKit browsers that detect changes in element scroll states.
---

## A Primer on Overflow and Underflow

To level-set, I'll define and describe what overflow and underflow are in the context of the web. Overflow is a rather simple concept you're probably familiar with: when an element's content takes up more space than it allows, given style or box model constraints, it causes a scrollbar to appear or the content to be cut off from view (if you set `overflow: hidden;`). Underflow is the less common case you probably don't think about: an element currently in an overflown state leaves that state as a result of the element growing in size or a reduction of the amount of content within it - visually, the scrollbars disappear and all content is visible within the element. As it turns out, Firefox and WebKit browsers offer events that alert you of changes between these two flow states. ![What if I told you](http://i.qkme.me/3tctfi.jpg)

## Let's Talk Flow Events, Boyee!

In Firefox there are two separate events, `overflow` and `underflow`. In WebKit browsers, there is a single event, `overflowchanged`. In using these events, it becomes painfully clear that WebKit's catch-all `overflowchanged` event is ill-conceived. Webkit's `overflowchanged` event forces you to compare three different event properties, `event.orient`, `event.verticalOverflow`, and `event.horizontalOverflow` to filter for various combinations of values in order do anything useful - needless to say, it's about as fun as a [bag of glass](http://www.nbc.com/saturday-night-live/video/irwin-mainway/1185611/ "Classic SNL - Bag o' Glass"). The bad news: as you've now come to expect, Internet Explorer doesn't support any variant of flow events, here's my surprised face --&gt; :|

## Unifying Flow Events

To make this flow event circus easier to deal with, let's distill them into one cross-browser method that allows us to discreetly listen for overflow and underflow state changes: ```

function addFlowListener(element, type, fn){
  var flow = type == 'over';
  element.addEventListener('OverflowEvent' in window ? 'overflowchanged' : type + 'flow', function(e){
    if (e.type == (type + 'flow') ||
      ((e.orient == 0 && e.horizontalOverflow == flow) || 
      (e.orient == 1 && e.verticalOverflow == flow) || 
      (e.orient == 2 && e.horizontalOverflow == flow && e.verticalOverflow == flow))) {
      return fn.call(this, e);
    }
  }, false);
}

// Example usage
addFlowListener(myElement, 'over', function(){ ... });
addFlowListener(myElement, 'under', function(){ ... });
```

## Look What I Can Do!

<iframe allowfullscreen="allowfullscreen" frameborder="0" src="http://jsfiddle.net/7yT2S/39/embedded/result,js,css,html/?clickable=true" style="width: 100%; height: 400px;"></iframe>