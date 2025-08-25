---
title: 'MooTools Vertical Text Element Method'
pubDatetime: 2011-07-29T05:21:55Z
author: 'Daniel Buchner'
tags:
  - MooTools
  - JavaScript
  - CSS
  - vertical text
  - web development
description: A MooTools Element extension for creating vertical text using CSS and DOM manipulation when browser-native solutions aren't sufficient.
---

Vertical text is one of those things that you need occasionally in designing web sites and apps. Sadly, such a seemingly simple tweak on presentation is not easily accomplished. Vertical text can however be achieved with a simple mixture of CSS and subtle manipulation of the text content in elements. For added convenience, I wrapped up this method as a MooTools Element extension, let's check out how it's done:

```javascript
Element.implement('vertical', function(){
    return this.setStyles({
        'float': 'left',
        'text-align': 'center',
        'line-height': '100%',
        'white-space': 'pre-line'
    }).set('text', this.get('text').split('').join('\n'));  
});
```

As you can see, the CSS is rather simple, and the modification to the elements text content is quite benign (extreme corner cases aside). In case the output is hard to visualize, here is a jsFiddle example so you can see it in action:
 
<iframe src="http://jsfiddle.net/9QhjL/14/embedded/?clickable=true" style="width: 100%; height: 300px"></iframe>