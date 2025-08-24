---
id: 77
title: 'I Want a DAMNodeInserted Event!'
date: '2012-04-25T22:38:09-07:00'
author: 'Daniel Buchner'
layout: post
guid: 'https://www.backalleycoder.com/?p=77'
permalink: /2012/04/25/i-want-a-damnodeinserted/
image:
    - ''
embed:
    - 'This is the default text'
seo_follow:
    - 'false'
seo_noindex:
    - 'false'
dsq_thread_id:
    - '664128352'
categories:
    - Code
    - JavaScript
    - Web
---

## Have DOM Level 3 Mutation Events got you down?

 There's a long, sordid history behind DOM Level 3 Mutation Events. They're basically the DOM Event equivalent of crack for developers: a ridiculous high of programmatic, dynamic handling of DOM manipulation, with a crash of endless, unavoidable, performance-destroying event evaluation. John Resig detailed the plight of DOM Mutation Events in a mailing list thread, circa 2009: > Yes, DOM mutation events already exist (in Firefox and Opera - fairly reliably - and dicey in Safari). They have a huge problem, though: They absolutely cripple DOM performance on any page which they're enabled. Firefox, for example, when it realizes that a mutation event has been turned on, instantly goes into an incredibly-slow code path where it has to fire events at every single DOM modification. This means that doing something like .innerHTML = "foo" where it wipes out 1000 elements would fire, at least 1000 + 1 events (1000 removal events, 1 addition event).

 Mutation Events have since been deprecated, and browsers have not implemented any sort of replacement...but unknowingly, they actually have ;) ## But wait! An epic hack emerges!

 What I'm going to present below is a hack in the truest sense of the word, *but damn*, is it cool. The method I've devised provides the same functionality DOMNodeInserted offered, without requiring you to annihilate browser performance in the process - and it is *very* likely to work for a long, long time. ### The Description

 Basically what we're going to do is setup a CSS `keyframe` sequence that targets (via your choice of CSS selector) whatever DOM elements you want to receive a DOM node insertion event for. <del datetime="2014-03-04T18:26:24+00:00">I used a relatively benign and little used css property, `clip`</del> I use `outline-color` in an attempt to avoid messing with intended page styles - the code once targeted the `clip` property, but it is no longer animatable in IE as of version 11. That said, any property that can be animated will work, choose whichever one you like. Next I added a document-wide `animationstart` listener that I use as a delegate to process the node insertions. The animation event has a property called `animationName` on it that tells you which keyframe sequence kicked off the animation. Just make sure the `animationName` property is the same as the keyframe sequence name you added for node insertions and you're good to go. ### The Demo

 That's about it, pretty simple huh? Let's see it in action - notice that the text in the divs isn't added until their insertion into the DOM is detected: <iframe allowfullscreen="allowfullscreen" frameborder="0" src="http://jsfiddle.net/Zzw2M/103/embedded/?clickable=true" style="width: 100%; height: 300px"></iframe>## Party time, excellent!

 There you have it folks, a scope-able, performant, relatively simple method for DOM node insertion listeners in all browsers that support CSS3 Animations. In related news: I will be accepting donations in the form of Jamba Juice gift cards, or pure gold bullion if you're feeling especially generous. 