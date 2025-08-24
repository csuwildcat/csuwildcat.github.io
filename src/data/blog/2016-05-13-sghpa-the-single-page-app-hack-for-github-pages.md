---
title: 'S(GH)PA: The Single-Page App Hack for GitHub Pages'
pubDatetime: 2016-05-13T14:41:28Z
author: 'Daniel Buchner'
tags:
  - GitHub Pages
  - single-page app
  - JavaScript
  - web development
  - routing
description: A clever hack to enable single-page app routing on GitHub Pages by leveraging the 404.html file and preserving SEO-friendly status codes for crawlers.
---

## SPA woes

For some time now I have wanted the ability to route paths for a `gh-pages` site to its `index.html` for handling as a single-page app. This ability is table stakes for single-page apps because you need all requests to be routed to one HTML file, unless you want to copy the same file across all your routes every time you make a change to your project. Currently GitHub Pages doesn't offer a route handling solution; the Pages system is intended to be a flat, simple mechanism for serving basic project content. If you weren't aware, GitHub does provide one morsel of customization for your project site: the ability to add a `404.html` file and have it served as your custom error page. I took a first stab at doing an SPA hack by simply copying my `index.html` file and renaming the copy to `404.html`. Turns out many folks have experienced the same issue with GitHub Pages and liked the general idea: <https://twitter.com/csuwildcat/status/730558238458937344>. The issue that some folks on Twitter correctly raised was that the `404.html` page is still served with a status code of 404, which is no bueno for crawlers. The gauntlet had been thrown down, but I decided to answer, and answer with vigor! ## One more time, with feeling

After sleeping on it, I thought to myself: "Self, we're deep in fuck-it territory, so why don't I make this hack even dirtier?!" To that end, I developed an even better hack that provides the same functionality and simplicity, while also preserving your site's crawler juice - and you don't even need to waste time copying your `index.html` file to a `404.html` file anymore! The following solution should work in all modern desktop and mobile browsers (Edge, Chrome, Firefox, Safari), and Internet Explorer 10+. **Template & Demo:** If you want to skip the explanation and get the goods, here's a [template repo](https://github.com/csuwildcat/sghpa) (<https://github.com/csuwildcat/sghpa>), and a test URL to see it in action: <https://csuwildcat.github.io/sghpa/foo/bar>### That's so META

The first thing I did was investigate other options for getting the browser to redirect to the `index.html` page. That part was pretty straight forward, you basically have three options: server config, JavaScript `location` manipulation, or a meta refresh tag. The first one is obviously a no-go for GitHub pages, and JavaScript is basically the same as a refresh, but arguably worse for crawler indexing, so that leaves us with the meta tag. Setting a meta tag with a refresh of 0 [appears to be treated as a 301 redirect](http://sebastians-pamphlets.com/google-and-yahoo-treat-undelayed-meta-refresh-as-301-redirect/) by search engines, which works out well for this use-case. You'll need to start by adding a `404.html` file to your `gh-pages` repo that contains an empty HTML document inside it - but your document ***must*** total more than 512 bytes (explained below). Next put the following markup in your `404.html` page's `head` element:

```html
<script>
  sessionStorage.redirect = location.href;
</script>
<meta http-equiv="refresh" content="0;URL='/REPO_NAME_HERE'"></meta>
```

This code sets the attempted entrance URL to a variable on the standard `sessionStorage` object and immediately redirects to your project's `index.html` page using a meta refresh tag. If you're doing a Github Organization site, don't put a repo name in the `content` attribute replacer text, just do this: `content="0;URL='/'"`#### Customizing your route handling

If you want more elaborate route handling, just include some additional JavaScript logic in the script tag shown above to tweak things like: the composition of the `href` you pass to the `index.html` page, which pages should remain on the 404 page (via dynamic removal of the meta tag), and any other logic you want to put in place to dictate what content is shown based on the inbound route. #### 512 magical bytes:

This is hands down one of the strangest quirks I have ever encountered in web development: You must ensure the total size of your `404.html` page is greater than 512 bytes, because if it isn't IE will disregard it and show a generic browser 404 page instead. When I finally figured this out, I had to crack a beer to help cope with the amount of time it took. ### Let's make history

In order to capture and restore the URL the user initially navigated to, you'll need to add the following script tag to the `head` of your `index.html` page ***before*** any other JavaScript acts on the page's current state:

```html
<script>
  (function(){
    var redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;
    if (redirect && redirect != location.href) {
      history.replaceState(null, null, redirect);
    }
  })();
</script>
```

This bit of JavaScript retrieves the URL we cached in `sessionStorage` over on the `404.html` page and replaces the current `history` entry with it. However you choose to handle things from there is up to you, but I'd use `popstate` and `hashchange` if you can. ---

Well folks, that's it - now go hug it out and celebrate by writing some single-page apps on GitHub Pages! \[WPGP gif_id="175" width="600"\]