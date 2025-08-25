---
title: 'Link element load event support for CSS Style Sheet includes, finally!'
pubDatetime: 2011-03-21T03:36:31Z
author: 'Daniel Buchner'
tags:
  - CSS
  - JavaScript
  - web development
  - link elements
  - load events
description: A solution for detecting when CSS stylesheets loaded via LINK tags have finished loading, addressing the long-standing lack of reliable load event support across browsers.
---

In the long history of developer attempts at creating a method of loading CSS Style Sheets via LINK tags with load event support, there has been a lot of FAIL and almost no WINNING! Oddly enough, Internet Explorer has supported a load event on LINK tags for as long as I can remember, but Firefox and the Webkit bunch...not so much. What are people doing currently to service this need? Well here's an [example of half-baked solutions](http://stackoverflow.com/questions/2635814/javascript-capturing-load-event-on-link) that have surfaced over the last couple of years on Stack Overflow (I have added my solution to the list, so up-vote it!). Most developer have been reduced to loops that look for the new sheet in the StyleSheet object at short intervals or even loading the link tag in an iframe and using the frame's onload event, two methods that cause me to puke on my shoes on principle.

## The Solution

 Well web devs, today is the day. Yup, CSS Style Sheet loading via LINK tags with pretty damn legit load event support is a reality:
 
 ```javascript
var loadCSS = function(url, callback){
  var link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;

  document.getElementsByTagName('head')[0].appendChild(link);

  var img = document.createElement('img');
      img.onerror = function(){
          if(callback) callback(link);
      }
      img.src = url;
}

```

 The code above creates a LINK tag for your CSS file and inject it into the head of the document, there's certainly nothing odd about that. Next comes the interesting part, it creates an IMG tag and adds your CSS file location as src parameter of the element then injects it into the page. The browser parser downloads the file and attempts to parse it, which predictably fails as it is the wrong MIME type. That failure triggers the error event on the image element. We know the file is present at that point, so the load event you pass to the function is fired from inside the image element error event, the image element is then deleted from the document. Whether cached or not, this method will fire your load event for any CSS file you include, when the file is in the cache it is called immediately - which is a huge benefit.

## Try it out!

 Here it is a live demo, I have added an alert as the load event default for example sake: <iframe src="http://jsfiddle.net/VvEQv/96/embedded/" style="width: 100%; height: 300px"></iframe>