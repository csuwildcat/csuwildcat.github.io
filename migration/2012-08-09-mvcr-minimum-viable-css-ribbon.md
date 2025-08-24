---
id: 87
title: 'MVCR &#8211; Minimum Viable CSS Ribbon'
date: '2012-08-09T18:36:23-07:00'
author: 'Daniel Buchner'
layout: post
guid: 'https://www.backalleycoder.com/?p=87'
permalink: /2012/08/09/mvcr-minimum-viable-css-ribbon/
image:
    - ''
embed:
    - 'This is the default text'
seo_follow:
    - 'false'
seo_noindex:
    - 'false'
dsq_thread_id:
    - '799161424'
categories:
    - Uncategorized
tags:
    - Uncategorized
---

I thought I'd jot down a snippet of CSS I came up with recently that I use to generate UI ribbons. The code uses `:before/:after` pseudo elements, which means it works in IE8+ and all the other not-shitty browsers. To ensure the content of the ribbon can be modified dynamically using JavaScript, I've set the pseudo element's `content` property with the value `attr(ribbon)`. The `attr()` content function grabs the parent element's ribbon HTML attribute string (example: `ribbon="SomeText"`) and uses it for the ribbon's content. I'm pretty sure this is one of, if not *the*, shortest bit of code required to create CSS ribbons, but perhaps you all can improve upon it:

```

.ribbon:before {
	display: block;
	content: attr(ribbon);
	background: #eee;
}
	
.ribbon:after {
	display: block;
	content: " ";
	border-left: 5px dotted transparent;
	border-top: 5px solid #ccc;
	height: 0;
	width: 0;
}
```

 <iframe allowfullscreen="allowfullscreen" frameborder="0" src="http://jsfiddle.net/mCjcy/18/embedded/result,css,html/?clickable=true" style="height: 300px"></iframe>