---
id: 200
title: 'Demythstifying Web Components'
date: '2016-08-26T13:58:26-07:00'
author: 'Daniel Buchner'
layout: post
guid: 'https://www.backalleycoder.com/?p=200'
permalink: /2016/08/26/demythstifying-web-components/
enclosure:
    - "http://i.imgur.com/ActMjlB.mp4\r\n1997279\r\nvideo/mp4\r\n"
ao_post_optimize:
    - 'a:6:{s:16:"ao_post_optimize";s:2:"on";s:19:"ao_post_js_optimize";s:2:"on";s:20:"ao_post_css_optimize";s:2:"on";s:12:"ao_post_ccss";s:2:"on";s:16:"ao_post_lazyload";s:2:"on";s:15:"ao_post_preload";s:0:"";}'
categories:
    - Code
    - JavaScript
    - Web
    - 'Web Components'
---

The following is an attempt to stomp out the seemingly endless FUD that circulates about Web Components, most of which is purely manufactured by attacking tangential, opinionated choices of frameworks that happen to use Web Components in a way that differs from the opinions of other frameworks.

### Level Setting

Don't let me catch you claiming a Web Component is anything but the following, or I'll send Kam Chancellor to lay you out: > Web Components are an amalgam of APIs from two W3C specs (Custom Elements and Shadow DOM) that enable the creation of encapsulated, declarative, custom elements, which serve as standard, reusable, interoperable vehicles of discrete, stateless functionality.

<video controls="controls" height="150" loop="loop" src="http://i.imgur.com/ActMjlB.mp4" style="display: block; margin: 0 auto; max-width: 80%; height: 15em;" width="300"></video>## Myth 1: "Web Components are at odds with Framework X"

This is probably the most fallacious statement about Web Components. As long as a framework writes to the DOM (which all major ones do), there is no reason it can't include Web Components or update a Custom Element with data and state changes (as opposed to an amorphous tree of rando divs). Let's say I have a single page React app that's a clock, where you select a timezone and the clock UI reflects the right time - here's what I would do: Write the actual clock element as a Web Component. All this `<x-clock>` element needs to do is understand one attribute, for example `data-zone`, that specifies which timezone to display, and print out a clock UI showing the correct time. It shouldn't be aware of anything else about the app - this shit just tells time, yo. From here you can Reactify the living hell out of everything else (your route handling, how you save the state of the selected timezone, etc.) without ever having to hard-bind the `<x-clock>` element's definition code to a framework. When you follow this pattern, you end up with elements of discrete functionality that can survive a change in framework, data/change management library, storage adapter, etc., and still develop your app with the framework or library of your choosing. Oh, and you also get to feel like a good Web Citizen, because that `<x-clock>` component you made is now available for use across the entire web, without requiring someone to have advanced programming experience or worship at the Church of Framework X. ## Myth 2: "If I want to use Web Components, I have to use HTML Imports"

I'm not going to spend much time on this because it's so blatantly false. HTML Imports is a proposed standard for importing an HTML document and its includes into a parent context. If you want to bundle your JS and CSS files into an HTML Import, go ahead, but Web Components are just JS and CSS files that have no dependency on how you include them in an app. ## Myth 3: "Web Components require me to change my packaging system"

As previously stated: Web Components simply provide you two JS APIs (Custom Elements and Shadow DOM) with which you can define new elements and register them for use in your app. This means all a Web Component requires is a JS and CSS file; for multiple components you can concatenate them together, like you would any other includes (note: if you choose write your CSS in JS, you obviously wouldn't need a CSS file) Because this is just regular ol' JS and CSS, don't go chasing new packaging waterfalls on account of Web Components, you can stick to the packaging rivers and lakes that you're used to. ## Myth 4: "Web Components aren't declarative"

This is perhaps the most mythstifying of all, given Web Components literally enable the end user to write declarative HTML markup extended with Custom Element tags. Frameworks like React (w/ JSX) are great if you prefer them, but in terms of categorization, something like JSX is a non-native, pseudo-declarative DSL with embedded logic hooks, vs the native, purely declarative markup of Custom Element tags written in regular ol' HTML. ## Myth 5: "Web Components aren't compatible with JSX, they only accept string values!"

If you're using a DSL markup layer like JSX, there's no technical reason why a system like that can't interoperate with Web Components. A conversation on Twitter with various folks in the ecosystem prompted me to address this myth. During the conversation someone noted the basic flow of JSX to React imperative code and asked how it would look with a Web Component. Here's the pure JSX/React we started with: ```
// This JSX Markup:


// Turns into this imperative React code:
React.createElement(Foo, { bar: 1 }),
```

The question was how the above code would look if JSX was to support and interoperate with Web Components. The key requirement is any object type must be able to be passed to a Web Component. This isn't an issue, as Web Components (and HTML elements in general) natively support methods and getters/setters, in addition to attributes. This means that you could route any type of an object to a Web Component from a JSX context as follows: ```
// This JSX Markup:


// Turns into this imperative code:
var foo = document.createElement('x-foo');
foo.bar = 1;
```

Whether or not JSX is already written to detect and reflect data to Web Components via setters/methods is immaterial - the point is: it should be trivial to detect a Custom Element token in the JSX parser and pass data to its corresponding instance. I have inquired about where in the React/JSX lib code this data relay takes place, and I am willing to help modify the code so Web Components can be seamlessly included. ## Myth Status: BUSTED

So now that we've got all that straight, I encourage you to never utter these myths again.