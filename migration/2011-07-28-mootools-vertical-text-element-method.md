---
id: 51
title: 'MooTools Vertical Text Element Method'
date: '2011-07-28T22:21:55-07:00'
author: 'Daniel Buchner'
layout: post
guid: 'https://www.backalleycoder.com/?p=51'
permalink: /2011/07/28/mootools-vertical-text-element-method/
image:
    - ''
embed:
    - 'This is the default text'
seo_follow:
    - 'false'
seo_noindex:
    - 'false'
dsq_thread_id:
    - '371273971'
categories:
    - JavaScript
    - MooTools
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

 As you can see, the CSS is rather simple, and the modification to the elements text content is quite benign (extreme corner cases aside). In case the output is hard to visualize, here is a jsFiddle example so you can see it in action: <iframe src="http://jsfiddle.net/9QhjL/14/embedded/?clickable=true" style="width: 100%; height: 300px"></iframe>