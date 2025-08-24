---
id: 22
title: 'Programatically Convert CSS named colors to RGB &#038; HEX'
date: '2010-10-05T16:00:18-07:00'
author: 'Daniel Buchner'
layout: post
guid: 'https://www.backalleycoder.com/?p=22'
permalink: /2010/10/05/converting-css-named-colors-to-rgb-and-hex/
dsq_thread_id:
    - '151598124'
image:
    - ''
embed:
    - 'This is the default text'
seo_follow:
    - 'false'
seo_noindex:
    - 'false'
categories:
    - Code
    - JavaScript
    - MooTools
---

Converting color values between different formats is commonplace on the web. Whether it is a JavaScript-assisted animation, color picker, or modifying a color's attributes, there are many circumstances where color manipulation is essential to front-end development. One color format particularly hard to work with is CSS named colors. Named colors are widely supported in A-grade browsers, here's a [list of common named colors](http://www.w3schools.com/css/css_colornames.asp) courtesy of w3schools.

### So what's the problem?

 The problem with named colors is the difficult lengths to which a developer must go to manipulate and use them practically. It is relatively easy to use them statically in style-sheets (though I prefer RGB or HEX, in that order), but more interesting uses are usually dynamic ones that result from user input. As developers, we think in RGB and HEX values because that is the world we are immersed in, users however are more likely to think in black and white as opposed to #000000 and #FFFFFF. What does that mean to you as a developer? Let's say you have a color picker that transitions a target element to and from colors based on user input, how do you allow a user to type in "purple" and effectively animate your element from #000000 to "purple" without a gigantic, pre-populated, name colors object? Furthermore, what developer would ever want to spend their time assembling and maintaining such a list? ### "Computed Styles, I've heard so much about you."

 Most developers are aware of computed styles, but just in case you are not, here's a definition to prime the pump: > Computed Styles methods provide [used values](https://developer.mozilla.org/en/CSS/used_value) for all CSS properties of an element in their most reduced format. Computed Styles is a somewhat costly operation as all the values must be calculated each time the method is called.

 One note on the above definition - the used values returned by computed styles methods are always reduced to a common format, this is most evident with the *transform* property, it is reduced to the common *matrix(a, b, c, x, y)* representation of the value regardless of which format (rotate, scale, skew, translate, etc.) the style was applied with. Now that we have a better understanding of computed styles, let's find out how we can use them to overcome the use of dumb, static named color tables. As it turns out, all browsers have internal methods for reducing named color values to HEX or RGB formats, some are just harder to access than others. Mozilla, Chrome, and Safari all have a common global method for retrieving computed styles - [window.getComputedStyles()](https://developer.mozilla.org/en/DOM/window.getComputedStyle) - that takes as an argument the element you are requesting the computed styles for. Opera uses the same mechanism as other non-IE browsers to report computed styles, however named colors are not converted to HEX or RGB values when retrieved with the computed styles method. Instead, Opera strangely chooses to reset the property in question on the style object of the element to the calculated HEX or RGB value of the named color. IE provides an object, currentStyles, that is accessible directly from the element. Unfortunately IE does not convert named colors to RGB or HEX through any sane means - even in IE9. It is possible to get to the calculated HEX and RGB values of named colors in IE, but as you'll see below, it isn't pretty. ### Bringing it all together

 So let's get smart about this! With the goods on computed styles I crossmedibrowsertated and came up with the String native methods "colorToHex()" and "colorToRgb()" with a little help from the sextacular MooTools javascript framework: <iframe src="http://jsfiddle.net/uFahP/1/embedded/" style="width: 100%; height: 300px"></iframe>