---
id: 84
title: 'CSS Selector Listeners'
date: '2012-08-06T17:02:41-07:00'
author: 'Daniel Buchner'
layout: post
guid: 'https://www.backalleycoder.com/?p=84'
permalink: /2012/08/06/css-selector-listeners/
image:
    - ''
embed:
    - 'This is the default text'
seo_follow:
    - 'false'
seo_noindex:
    - 'false'
dsq_thread_id:
    - '794837617'
categories:
    - Code
    - JavaScript
    - Web
---

The following article explores a new event mechanism that I like to call *CSS Selector Listeners*. Selector listeners are completely bad ass, and sufficiently indistinguishable from magic, as you will soon find out.

## Rise of the Mutants

 Developers recently were empowered with a new way to listen for changes in the DOM: [DOM Level 4 Mutation Observers](https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/). Mutation Observers emit fairly general events that tell you basic things, like when a new element has entered the DOM, or an attribute has changed on an element or subtree you are observing. As a result of their relatively low detail resolution, developers have created libraries to help make Mutation Observers more useful for developers. Rafael Weinstein of Google recently introduced a library called [Mutation Summary](http://code.google.com/p/mutation-summary/wiki/Tutorial), which lets you watch the DOM through the lens of a limited subset of CSS selectors using a combination of Mutation Observers and its own custom logic layer to filter and interpret mutation events. The concept of listening to selector matches is intriguing because selectors inherently require the parser to quickly assess complex DOM conditions and perform selector-related logic to check for matches. Having the ability to listen for when selector states become active would be a powerful tool indeed! ## A Hidden World of Events

 Mutation Summary is pretty cool, but what if I told you there was a hidden world of arcane CSS selector event magic living in your browser that offered unlimited, detailed insight into the state of the DOM? Well there is, and technically there always was, in every style sheet you've ever written. All we needed was the right key to access this world...well, a *Keyframe*, to be exact. ## Piggybacking the Parser, with Keyframes

 I recently [posted a method](https://www.backalleycoder.com/2012/04/25/i-want-a-damnodeinserted/) for using CSS Animation Keyframes to detect node insertions via the animationstart event of a dummy keyframe animation. Now let's take a second to realize what this hack really is at its core: the ability to listen for any selector-based matches the CSS parser makes anywhere in the DOM. The Selector Listener code I've developed provides two methods, `addSelectorListener` and `removeSelectorListener`. These methods are available at both document and element level, and allow you to listen for *any* selector match, *regardless of complexity*. Once the parser detects a matched selector, the event bubbles up the DOM from the matched target element to the element or document the selector listener is attached to. Here's what it looks like in action: ```

// Some action to perform when a match occurs
var sequenceMatch = function(){
  alert("Selector listeners, they're easy as A, B, C!");
};

// Attaching your selector listener to the document or an element
document.addSelectorListener('.one + .two + .three', sequenceMatch);

// Remove the selector listener when it is no longer needed
document.removeSelectorListener('.one + .two + .three', sequenceMatch);
```

## The Goods: Code &amp; Demo

 The code that provides all this new hotness, as well as more examples of what's possible, is available on Github here: [SelectorListener Code Repo](https://github.com/csuwildcat/SelectorListener) You can also play around a bit with this demo page: [SelectorListener Demo](http://csuwildcat.github.com/SelectorListener/)