---
id: 80
title: 'A Modal Cure in Pure CSS &#8211; No Wrappers, no JavaScript, no BS'
date: '2012-05-31T15:43:19-07:00'
author: 'Daniel Buchner'
layout: post
guid: 'https://www.backalleycoder.com/?p=80'
permalink: /2012/05/31/a-modal-cure-in-pure-css-no-wrappers-no-javascript-no-bs/
image:
    - ''
embed:
    - 'This is the default text'
seo_follow:
    - 'false'
seo_noindex:
    - 'false'
dsq_thread_id:
    - '709640113'
categories:
    - JavaScript
    - Web
---

Modals. They've been the subject of countless hacks over the years (I did a cross-browser one a while ago [here](https://www.backalleycoder.com/2011/11/16/best-damn-modal-method-period%E2%84%A2/)), but due to cross-browser considerations, they usually are less than elegant in their implementation. Well, if you don't care about IE much, much easier. This little trick is so simple it's going to make you cry, in fact it's so easy, it may cause you to audibly curse IE louder and more passionately than you ever have:

```

<div id="modal">
    
</div>
```

 ```

#modal {
    display: block;
    position: fixed;
    top: 50%;
    left: 50%;
    box-sizing: border-box;
    transform: translate(-50%, -50%);
}
```

 Here's a fiddle so you can see it in action: <iframe allowfullscreen="allowfullscreen" frameborder="0" src="http://jsfiddle.net/HUZYN/9/embedded/result,css,html/?clickable=true" style="height: 500px"></iframe> Yeah I know, all those hours wasted on wrapper divs, tables, crazy CSS, and performance-robbing JS, all to get hoodwinked by some top/left positioning and a transform property, go figure.