---
id: 139
title: 'Element Queries, From the Feet Up'
date: '2014-04-18T21:37:34-07:00'
author: 'Daniel Buchner'
layout: post
guid: 'https://www.backalleycoder.com/?p=139'
permalink: /2014/04/18/element-queries-from-the-feet-up/
livefyre_version:
    - '3'
ao_post_optimize:
    - 'a:6:{s:16:"ao_post_optimize";s:2:"on";s:19:"ao_post_js_optimize";s:2:"on";s:20:"ao_post_css_optimize";s:2:"on";s:12:"ao_post_ccss";s:2:"on";s:16:"ao_post_lazyload";s:2:"on";s:15:"ao_post_preload";s:0:"";}'
categories:
    - Code
    - Hacks
    - JavaScript
    - 'Web Components'
---

## Everybody's looking for Element Queries

What are Element Queries? At a high level, I'd describe them as pure, unfiltered, rocket fuel for hyper-responsive layouts and components. More technically, they are Media Queries scoped to individual elements. Element Queries would allow you to attach Media Query break-points based on the dimensions and characteristics of an element *itself*, instead of the page's viewport. Developers have wanted Element Queries for a long time. Here's a list of articles that convey the need, along with a few attempts to make them real: - Ian Taylor - [Media Queries are a Hack](http://ianstormtaylor.com/media-queries-are-a-hack/ "Media Queries are a Hack")
- Tab Atkins - [Element Queries](http://www.xanthir.com/b4PR0 "Element Queries") (a discussion of the problems)
- The Filament Group - [Working Around a Lack of Element Queries](http://filamentgroup.com/lab/element_query_workarounds/ "Working Around a Lack of Element Queries")
- Smashing Magazine - [Media Queries Are Not The Answer: Element Query Polyfill](http://www.smashingmagazine.com/2013/06/25/media-queries-are-not-the-answer-element-query-polyfill/ "Media Queries Are Not the Answer: Element Query Polyfill")

### Visualizing the Problem

I've included a couple sketches from the [Filament Group](http://filamentgroup.com/) (with permission) that highlight the common layout issues we face in a world without Element Queries: *When the following schedule component is in its primary, full-width state, Media Queries work well for addressing different screen sizes/orientations*![Responsive Calendar](http://i.imgur.com/FIoQSBR.png?1)*Problems quickly arise when the same schedule component enters a secondary, partial-width state. Top-level viewport break-points are no longer relevant, and styling the component becomes extremely difficult.*![Responsive Calendar](http://i.imgur.com/onp6JLB.png?1)"So you've convinced me. Element Queries would be awesome, and developers want them - so why don't browser vendors just give 'em the goods?" Well, there are a few tough problems to solve, chief among them is *circularity*. As Tab Atkins points out in his post, there is a problematic condition created if you apply the existing paradigm to Element Queries: ```
.container {
  float: left;
}
.child {
  width: 500px;
}
.container:min-width(450px) > .child {
  width: 400px;
}
```

See the issue? I'll let Tab clarify the problem for us: > In this simple example, the container's size is determined by the size of its contents, because it's floating. By default, its only child is 500px wide. However, whenever the container is greater than 450px wide, the child is 400px wide. In other words, if the child is 500px wide (thus making the container also 500px wide), then the child becomes 400px wide. But if the child is 400px wide (thus making the container also 400px wide), the child becomes 500px wide. Circular dependency!

## Some Element Query hacks want to abuse you

Each of the posts I've linked to above adds to the chorus of developer need, and all are to be commended for highlighting the issues developers face. While there have been many attempts at creating something that resembles Element Queries, most rely on polling, observers, hacky resize listeners, hand-rolled measurement routines, and an assortment of odds and ends that simply fail to produce the same level of API fidelity and reliability that native Media Queries do. So what does this mean? Is all hope lost? ## I've traveled the DOM and the HTML seas

After doing a ton of research and experimentation, I believe I have a better solution to Element Queries - in fact, it may be the best solution possible while we wait for some sort of native implementation of the feature. The mechanism I've derived not only avoids the issues highlighted above, it also provides the full Media Query API, scoped to individual elements. There are many factors to consider, but with a bit of out-side-the-box (literally) thinking, we're giving Element Queries to everyone! ![Oprah 'You Get' Element Queries Meme](http://i.imgur.com/XSdtyyG.png)## Sweet Element Queries are made of this

Let's talk about all the pieces we'll need. I'll start with the most basic ingredient: finding a way to associate a separate, scoped `viewport` with each of the elements we want to imbue with Element Query powers. ### Picking a Viewport Surrogate

What are the options? There are basically two routes: you can either try arcane event juggling with resize listeners or DOM polling, or utilize something that creates its own browsing context. Tab Atkins highlights one classic element that does this: the `iframe`. Sure, I guess we could toss content into an `iframe`, but they are heavy elements (in terms of performance), and placing all your content *into* a separate browsing context brings with it its own lame set of hassles, like style/script boundaries, lack of auto-height content flexibility, and a host of others. But hey, let's not give up yet, there are other candidates for the staring role in this Element Query thriller: `embed` and `object`. #### The `EMBED` Element

The `embed` element can be used to, er, embed content within your pages. It was recently standardized in the HTML spec, and in my exploration of the spec, seems to be the 'lightest' (in terms of performance) of all the elements that create new browsing contexts. The flaw with `embed` elements, is the difficulty in accessing the content they contain from the parent document. For this reason, it's a poor choice for this use-case. (here's the embed element spec if you're curious: <http://www.w3.org/TR/html5/embedded-content-0.html#the-embed-element>) #### The `OBJECT` Element

Our other option, is the `object` tag. It can also be used to fetch and include content (or code) within your page, and still has a far 'lighter' create, load, and memory footprint than the `iframe` (closest to that of the `img` tag). This tag is interesting for a few reasons. Object tags create new browsing contexts, and most importantly, allow ownerDocument script access to their `about:blank` content. These suckers have been around for ages, here's the spec: <http://www.w3.org/TR/html5/embedded-content-0.html#the-object-element>**The Conclusion**: We're going with option 2, the `object` element, for compatibility and (relative) ease in scripting its contents. #### The Skinny on Performance

It's widely recognized that the `iframe` element is a beast that consumes memory and ravages performance - this is true, they're terrible. So how are object and embed elements different? Can't you load things into them like an `iframe`? Sure, but their fundamental attributes and performance characteristics greatly differ from that of an `iframe`. To assure you that, in moderation, use of object elements is safe and will not get you burned at the stake for performance heresy, I've thrown together a perf test - you may find the results surprising: [http://jsperf.com/element-create-load-footprint](http://jsperf.com/element-create-load-footprint "JS Perf - element performance test") (Warning: some have stated the `audio` tag test - *which has nothing to do with Element Queries* - crashes Safari. This is inexplicable, as I am doing very basic create/load testing) Basically, I wouldn't use 1000 `object` elements in your app - but as the test above shows, I wouldn't go putting a 1000 `img` elements into the DOM either. Use this Element Query code in a smart and deliberate way. Instead of putting an element query on 1000 `li` elements, put one on the `ul` - this is my official appeal to common sense, folks. ### Bringing It All Together

Now you may be thinking "So put content in an object element? Wow, great advice Dan, that's really original. Yawn.", but here's the trick: we're not putting any content inside the `object` element! A few posts back I did a walk-through of how you can create a resize event sensor out of a few divs and well-placed scroll events - this is along those lines. I've created two distribution flavors for this mechanism: 1) a vanilla module that enables use without reliance on any additional dependencies, and 2) an easy-to-use [Web Component](https://developers.google.com/events/io/sessions/318907648 "Web Components - A Tectonic Shift for Web Development") created with the awesome [X-Tag](http://www.x-tags.org/ "X-Tag - Web Components Library") library. **UPDATE:** I was contacted on Twitter by a [fellow](https://twitter.com/georgeocrawford) who suggested I use the `addListener` method of [`MediaQueryList`](http://msdn.microsoft.com/en-us/library/ie/hh673551%28v=vs.85%29.aspx) objects to detect query matches on the `object` element sensors. I explored this route, but there are a few things that led me back to using dummy `transitionend` pings. I am happy to code up a version that uses MQL listeners, but here are a few things to consider: - It reduces browser support: you lose all of Android below version 4
- MQL listeners are still shaky: https://bugs.webkit.org/show\_bug.cgi?id=75903 - http://stackoverflow.com/questions/16694591/media-query-doesnt-change-css-when-maximizing-browser-and-switching-tabs/16844712#16844712
- Hold on a bit longer!: They'll be reliable soon, I'd estimate another 6-12 months

Both versions of the Element Query code work in any browser that [supports CSS Transitions](http://caniuse.com/#feat=css-transitions). This is a generous compatibility range that covers all "app-ready" browsers. Let me know if you encounter any issues using the GitHub issue areas under each of the repositories listed at the end of the article. #### The Vanilla Module

The plain ol' code module comes with the following features: - Two methods for manually attaching and detaching the Element Query object sensor - `attachQuerySensor()` and `detachQuerySensor()`
- Automatic DOM ready attachment of all non-style/link elements that have a `media=""` attribute
- Automatic bootstrapping of dynamically create elements when you add a `media=""` attribute

##### The HTML

Let's imagine I have a `section` element that contains a `ul`. I want to style the list differently when the container becomes smaller than `300px`. The HTML structure below is what this scenario would look like if the elements had already been parsed by the Element Query module (triggered by the presence of the `media=""` attribute): <section>- One
- Two
- Three

<object data="about:blank" height="150" type="text/html" width="300">  <style>
          div {
            opacity: 0;
            transition: 0.001s opacity;
            <!-- the code adds prefixed properties too,
                 only showing standard for simplicity sake -->
          }
          @media (max-width: 300px) {
            [query-id="small-width"] {
              opacity: 1;
            }
          }
         </style><div query-id="small-width"></div> </object></section>So what's that `object` element doing in there? How's that going to help with anything? The `media=""` attribute on the section element is how you declare your Element Query rules. There are two arguments for the media attribute's `query()` function syntax. The first is an identifying query name that will be added to the `matched-media=""` attribute when its corresponding [CSSMediaRule](https://developer.mozilla.org/en-US/docs/Web/API/CSSMediaRule "MDN - CSSMediaRule docs") is matched within the `object` sensor. As the user, all you need to worry about is adding queries to the `media` attribute, and styling based on the `matched-media` attribute, all the rest happens automatically. ##### The CSS

Once a query is matched, the name you gave the query will be added to the `matched-media` attribute. It's a space separated list, so if multiple are matched, you would use it in CSS just like other attributes of this sort, `class=""` for instance. Here's a post by Chris Coyier on all the ways you can style elements based on their attribute values: [http://css-tricks.com/attribute-selectors/](http://css-tricks.com/attribute-selectors/ "Chris Coyier - CSS Attribute Selectors"). Here's an example of what writing CSS against an Element Query match looks like, based on the HTML example content above: ```
section[matched-media~="small-width"] {
  font-size: 50%; /* small text for a wee lil element! */
}

/*** Example for styling multiple matches: ***/

section[matched-media~="small-width medium-height"] {
  ...
}
```

A few caveats with this version: - If you set the innerHTML of an element, and that HTML contains an element that has the `media=""` attribute, it will not be element-quererized. This is something that is automatic when you use the Web Component version below. To augment the element with the query sensor, you'll need to call the `window` method `attachQuerySensor(ELEMENT_REF)`, passing the element as the first argument.
- You must take care not to inadvertently remove the object element from the element-quererized parent. If you do this, it will no longer be able to sense changes and determine query matches. The most common ways this can occur are using `innerHTML` to blow-out content, or a DOM library method to empty an element. One strategy to avoid this, is always using a single child element inside the target element and using that for content CRUDing.

#### The Element Query Web Component

To make things even easier, I've created a Web Component [Custom Element](http://w3c.github.io/webcomponents/spec/custom/ "Web Components - Custom Element spec") called `x-querybox` using [X-Tag](http://www.x-tags.org/ "X-Tag - Web Components Library"). This component utilizes the same mechanism described above, but also provides enhanced ergonomics, matched media listeners, and automatic retention of the object sensor when doing DOM manipulation - and since we're using X-Tag, it's actually smaller in size than the vanilla version! Let's explore how it's used: ##### The HTML (same as above, besides the custom element)

- One
- Two
- Three

```


```

##### The CSS (also the same)

```
x-querybox[matched-media~="small-width"] {
  font-size: 50%; /* small text for a wee lil querybox! */
}
```

##### Moar goodies! The `mediachange` custom event

```
document.querySelector('x-querybox').addEventListener('mediachange', function(e){
  // the event detail property is an array of the active element queries
  if (e.detail.indexOf('small-width') > -1) {
    // the 'small-width' query is active, do some smally-widthy stuff!
  }
});
```

## Element Queries want to be used by you

Checkout the demo, and go grab the code. Feel free to contribute to either of the repositories using their respective GitHub Issues area. Happy queryin' folks! ### Demo

The demo is based on the Web Component version of the code to show both the basic and extended features. It's only meant to give you a general idea of what is possible. The shapes are style with percentage units, so you can resize the window to expand them, or grow them with a tap (via `:hover` CSS styles). As the shapes progress through their size changes, you'll notice the text and background colors change to indicate they have hit a new break-point - this is all based on their individual, element-scoped queries. If you open the console, you will notice I am logging all the `mediachange` events that occur. The demo is more impressive on a larger screen, where you can test all the query changes: [`Element Queries Demo`](https://www.backalleycoder.com/x-querybox/demo/ "Element Queries Demo")### Repos

I have two different repositories on my Github profile, one for the vanilla version, and one for the `x-querybox` X-Tag Web Component: - Web Component version: <https://github.com/csuwildcat/x-querybox>
- Vanilla version: <https://github.com/csuwildcat/element-queries>