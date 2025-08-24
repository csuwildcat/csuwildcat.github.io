---
title: 'The Best Damn Modal Method Period™'
pubDatetime: 2011-11-16T10:12:51Z
author: 'Daniel Buchner'
tags:
  - JavaScript
  - modals
  - web development
  - UI
description: A comprehensive cross-browser modal implementation method that handles all the edge cases and browser quirks for creating robust modal dialogs.
---

### The Gist

 In the long annals of web history there have been many attempts at creating modal dialog boxes. As far as I'm aware, all methods to date use hard-coded element heights and heavy-handed JavaScript logic to center the modal in the viewport (not to mention the complex measurement of elements and resetting of styles they do on window resize). There are a number of ways to vertically center things with HTML and CSS, Douglas Heriot details most of them in the following post: [Vertical Centering with CSS](http://blog.themeforest.net/tutorials/vertical-centering-with-css/) via ThemeForest's Lost In the Woods blog. ### Thinking Outside the Box...Literally

 The other day, I threw an off-the-shelf lightbox script into a new project that I had used previously. Quickly, old frustrations returned as I looked over the mess of code and calculations required to do something as simple as positioning an element in the center of a page. I thought "Holy expletive outburst Batman, there has to be a better way than this!". Turns out there was. I've devised a method for centering modal content that is radically easier than any that have come before it. There are two types of modals you can create with this method that I'll be discussing in this post. The first is a basic single element modal. The second is a modal with a header, footer, and even more dynamic height functionality. Both varieties automatically resize and recenter the modal in response to changes in size or content. The two methods work in IE7+, Firefox 2+, Chrome, and Safari 3+ (IE6 support requires fixed position fakery, but that is par for the course). Here is a diagram so you can visualize the basic HTML and CSS that forms the foundational for both variations of the method: ![](https://www.backalleycoder.com/wp-content/uploads/2011/11/best-damn-modal.png)#### A Simple Modal

 Start with the following simple HTML structure: ```html
<table id="modal">
  <tbody id="modal-tbody">
    <tr id="modal-tr">
      <td id="modal-td">
        <div id="modal-box">
          <div id="modal-body"> 
              
          </div>
        </div>
      </td>
    </tr>
  </tbody>
</table>

```

 "Nooo, a table!", I can hear it now, sigh. You want a simple, non-JS, vertically centered modal or not buddy? Yeah, that's what I thought. Here's a preview of what you're about to think in 10 seconds: "Just when I was about to light this guy up for simply nesting crap in a table (big wup), he throws down this sweet CSS and totally redeems himself!". Here's why you're about to think that: (I have commented next to the property values that can be optionally user-specified using any CSS unit you'd like) ```css
html, body
{
    height: 100%; /* root and body MUST be height 100% */
}

#modal
{
    position: fixed;
    top: 0;
    left: -100%;
    height: 100%;
    width: 100%;
}

#modal-tbody, #modal-tr, #modal-td
{
    height: 100%; /* All table elements should be height 100% */
}

#modal-td
{
    vertical-align: middle;
}

#modal-content
{
    position: relative;
    left: 100%;
    height: auto; /* HEIGHT optional, any unit */
    width: 50%; /* WIDTH optional, any unit */    
    max-height: 80%; /* MAX-HEIGHT optional, if height auto, must be % */
    min-height: 80px; /* MIN-HEIGHT optional, any unit */
    max-width: 225px; /* MAX-WIDTH optional, any unit */
    min-width: 80px; /* MIN-WIDTH optional, any unit */
    margin: 0 auto;
    border: 1px solid;
    background: #eaeaea;
    overflow: auto;
}

```

 Here's a basic example via jsFiddle: <iframe allowfullscreen="allowfullscreen" frameborder="0" src="http://jsfiddle.net/q3Rks/29/embedded/?clickable=true" style="height: 275px; width: 100%; display: block;"></iframe> **NOTE:** When using the simple modal method with `height` set to `auto`, you must constrain the modal to a percentage-based max-width in order to ensure that scroll bars appear when the modal content is taller than the window. An example of this use-case would be cases where you need to add elements to the modal, but outside the `modal-body` element, such as a header and footer. Luckily the advanced method described below allows for this. #### The Advanced, Have-your-cake-and-eat-it-too Modal

 There are cases were you want the best of everything. For such cases, you'll need a slightly modified HTML structure: ```markup
<table id="modal">
  <tbody id="modal-tbody">
    <tr id="modal-tr">
      <td id="modal-td">
        <div id="modal-box">
          <div id="modal-header"></div>
            <div id="modal-content">
              <div id="modal-body">
                  *** YOUR CONTENT HERE ***
              </div>
            </div>
          <div id="modal-footer"></div>
        </div>
      </td>
    </tr>
  </tbody>
</table>

```

 There is also a single addition to the CSS: ```

#modal-content
{
	overflow: auto;
}
```

 Notice I have wrapped the body in another element, `modal-content`. This is the only required change, the header and footer are just so our advanced modal demo looks more like the intricate modals you see on the web today. Next, you need to set a single style with JavaScript on window resize. Now don't get all sad face on me, this one-line of JavaScript is nothing like the complex, performance assaulting JS found in the modal scripts floating around the net. This is about as close to set-it-and-forget-it you'll ever get, let's take a look: ```javascript
window.addEventListener('resize', function(){
    document.getElementById('modal-content').style.maxHeight = document.documentElement.offsetHeight - headerFooterMargin;
}, false);

```

 Above you'll notice the header/footer/margin variable. In cases where you have a header, footer, or want to allow extra space between the modal and the edge of the window on resize, you'll need to subtract that value from the document's height offset. The awesome thing about this JavaScript is that it retains 100% of the adaptive ability of the modal. All other modal scripts on the web fall down when you add dynamic content or manipulate the size of their modal elements. Usually if you add content afterward, modal scripts require you to fire some laborious recalculation method that resets a massive set of height, width, and positioning values in order to maintain a centered and scrollable modal. The Best Damn Modal Method Period eliminates all that unneeded calculation and frees you up to create the most dynamic and complex modal interactions you can think of. Here's a full-page demo of the advanced method in action. For my own purposes, I create a MooTools class using the Best Damn Modal Method Period for my own convenience, but the output remains the same: [Sexy Full-size Advanced Modal Demo](https://www.backalleycoder.com/best-damn-modal-example/index.html) **Happy modal'n folks!**