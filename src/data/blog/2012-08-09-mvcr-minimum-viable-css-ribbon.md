---
title: 'MVCR – Minimum Viable CSS Ribbon'
pubDatetime: 2012-08-10T01:36:23Z
author: 'Daniel Buchner'
tags:
  - CSS
  - web development
  - design
  - ribbon
description: A minimal CSS snippet using pseudo-elements to create UI ribbons that work in IE8+ and support dynamic content modification via JavaScript.
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