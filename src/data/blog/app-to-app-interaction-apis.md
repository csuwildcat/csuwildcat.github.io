---
title: 'A Renewed Call for App-to-App Interaction APIs'
pubDatetime: 2015-10-13T17:00:14Z
author: 'Daniel Buchner'
tags:
  - app interaction
  - Web APIs
  - JavaScript
  - Web Intents
  - Web Activities
description: Renewing the discussion around app-to-app interaction APIs for the web, examining past attempts like Web Activities and Web Intents and proposing better solutions.
---

![Cow, come in cow](../../assets/images/goat-to-cow-come-in-cow.jpg)The battle ground of app-to-app interaction history is littered with abandoned ideas, half-solutions, and unimplemented APIs. The current, consumer/provider interaction paradigm for apps and services is a mess of one-off, provider-defined systems that each use their own transaction mechanisms and custom data structures. This makes it hard to do simple things across N providers, like save something to a user's preferred storage service without jumping through provider-specific code and UX hoops.... I'd like to restart the conversation about bringing legit, app-to-app interaction APIs to the Web. There have been past spec attempts, namely Web Activities and Web Intents, but I'll argue that while they get a lot right, they all fail to deliver an A+ solution.

## Wait, what is an "App-to-App Interaction API"?

Have you ever wanted to open a programmatic connection within your app to the user's preferred provider of a service or activity? Maybe you've wanted to check a user's identity, store data to a user's storage provider, or post to the user's preferred social network, etc. If you're saying to yourself, "Self, this is already solved, there are endless provider-specific social, identity, and storage includes to do just that" <--- I would submit to you, that right there, sucks. There must be some way to provide a common API layer for consumption of these services that doesn't require developers to know of, integrate, and manage specific bits of UI and code for every provider. Not having legit APIs to do this is a real problem, with significant consequences: - Pages are cluttered with code and UI includes for countless providers, many of which are left on pages to rot after a company discontinues support.
- Developers must know of, include, maintain, and write code to juggle how and what providers respond with; which usually doesn't share a semantic, even across the same type of service.
- The performance cost is huge - social, login, and other provider-specific includes account for a staggering amount of memory and dramatically increase page load times.
- Because developers are required to specifically include each provider, they often display only two or three options for a given service. This prevents users from leveraging different services that aren't among those a developer has committed cycles to integrating.

So we know this is a serious issue that impacts countless uses-cases, degrades performance, and limits service mashability, but what does a serious solution look like?

### Must-haves of an A+ solution:

1. Ability for providers to be registered dynamically, or via manifest declaration, but not tied to any installable app model - the whole Web deserves this API.
2. The user's selection and preferences for servicing activities should be managed by the User Agent *(browser, OS, etc.)*, within its trusted, chrome UI.
3. The user should have the ability to pick a service/app to handle an activity per-use, as a default per-domain, or as a global default.
4. The developer should be able to request handling of an activity via context switch to the provider app OR by establishing a silent, programmatic connection *(connecting to another app/service in the background)*
5. The spec should provide both declarative and imperative entry points for UI hand-offs and programmatic connections - for instance: links for declarative hand-offs, and imperative interfaces for background connections.
6. Imperative API connections to providers should be transactional - meaning a response sent back from a provider should be tied to a specific request instance *(hopefully with a Promise)*.

### How does current tech stack up?

Here's a rundown of how the three existing mechanisms we have for app-to-app interaction fare when assessed against the base features and capabilities an A+ solution should include:

| Features                                             | Web Intents | Web Activities | Custom Protocols |
|------------------------------------------------------|-------------|---------------|------------------|
| Use is not limited to installable app model          | ✅          | ✅            | ✅               |
| Choice of dynamic or declarative registration        | ✅          | ✅            | ✅               |
| Activities types should not be whitelist-driven      | ❌          | ✅            | ❌               |
| Selection/prefs managed in trusted UI                | ✅          | ✅            | ❌               |           
| Per-use selection                                   | ❌          | ❌            | ❌               |
| Per-domain default option                            | ✅          | ✅            | ✅               |
| Global default option                                | ❌          | ❌            | ❌               |
| Global default != granting global permission         | ❌          | ❌            | ✅               |
| Requests to providers are handled transactionally    | ❌          | ❌            | ❌               |
| Handling via context switch or background connection | ❌          | ✅            | ❌               |
| Implemented today by more than one browser vendor    | ✅          | ✅            | ❌               |
| Implemented today in any default, mobile browsers    | ✅          | ✅            | ✅               |

Though Custom Protocols come closest - and could be enhanced to fill the gaps - none of these options meet the criteria of an A+ solution. To add insult to injury, no current option is supported by default mobile browsers (Android, iOS, or Windows Phone), which makes general use a non-starter for most developers. The inability of these APIs to cover significant developer use-cases is one reason implementation of the above APIs is so spotty. Neither IE nor Edge currently support these APIs, and I don't blame them - before you commit significant time to implementing an API, you need to be sure it adequately solves the problems you face. That's part of the reason I am starting this discussion; we want to create an open dialog to better understand your needs.

## Experimenting with Protocol Handlers

I needed an app-to-app interaction API for something I'm working on at Microsoft, called Web Profile. The requirement was that any consuming app would be able to open a programmatic connection to a user's preferred service provider and perform transactions without the consuming app having to know where to look, or include any provider specific code. To build a working prototype, I needed an existing mechanism that worked across multiple browsers, so I took another look at something I had used in the past: Custom Protocol Handlers ([MDN: navigator.registerProtocolHandler](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/registerProtocolHandler)). Though they may not realize it, users and developers are already familiar with custom protocol handlers; the best example is probably `mailto:`. URLs prefixed with a custom protocol direct the browser to open the app or site the user selects to handle the request. This usually takes the form of a contextual switch: opening a new window or browser tab. For what I was looking to do, I needed a way to stay within my app while interacting over a programmatic connection with whatever provider the user selects. Custom protocol handlers can currently be registered in the desktop versions of these browsers: - Firefox 3+
- Chrome 13+
- Opera 11.6+

### Meet `ProtocolWorker`

It turns out you can use custom protocols to create a programmatic, background connection for app-to-app interactions. How? By pairing them with an old friend: the `iframe`. I found that loading a custom protocol (any handler registered with the `web+` prefix) in an iframe will redirect to the handler's target page. With a bit of postMessage() magic handled by a prollyfill included on both sides (consumer and provider), you can create an active, two-way connection between your app and the user's preferred service provider. Think of it as a cross between a Web Worker and Background Page (as they're known in browser extension land). Here's my Github repo with the JS file you'll need to make it all work: <https://github.com/csuwildcat/ProtocolWorker>

#### Talk codey to me:

To show how this works I put together a simple demo built on the totally-100%-made-up `web+whisper` protocol. The hypothetical Web Whisper case I highlight in the code below lets a user store a text string (a *whisper*) with their provider, or retrieve the last text string the provider stored on their behalf. Any consuming app that desires to store or retrieve the user's whisper must first be permitted to do so via the browser's protocol selection UI. The whole demo uses `localStorage` to save the user's text string on the provider's domain, so don't expect persistence beyond that of your local machine. **Note:** though this is a super simple demo, the system would be just as good for sending/retrieving things like: social posts, user profile info, or files from places like OneDrive, Dropbox, Box, etc.

#### Providers register a protocol handler

The first thing a site offering a Web Whisper service needs to do is register itself as a handler for the `web+whisper` protocol. Here's how you do that: 

```javascript
navigator.registerProtocolHandler('web+whisper', HANDLER\_URL + '?%s', 'Whisper Demo Provider');
```

#### Protocol handlers point to a ProtocolWorker page

At the other end of that `HANDLER\_URL` should be an HTML page that is not intended for display - we'll be treating it as more of a DOM-enhanced, Web Worker environment. In this page you will include event listeners and whatever code you need to deal with the requests you'll receive from consuming apps. Here's what the handler page looks like for our Web Whisper provider: 

```html
<script src="js/ProtocolWorker.js"></script><script>
  window.addEventListener('protocolrequest', function(event){
    if (event.detail['@type'] == 'Comment') {
      localStorage.whisper = event.detail.comment;
      event.detail.resolve();
    }
    if (event.detail['@type'] == 'Search') {
      event.detail.resolve(localStorage.whisper);
    }
  });
</script>
```

#### Consuming apps connect to providers via `ProtocolWorker`

After the user adds our Web Whisper provider as a handler for `web+whisper` requests, consuming apps can ask to open a connection to it. Below is a demo page of what it would look like for a consuming app to interact with the user's Web Whisper provider. Notice the consuming app creates a `ProtocolWorker` instance and sets up events in which it will attempt to send and retrieve data from the user's Web Whisper provider.


```html
<input placeholder="Whisper something" type="text"></input>
<button id="send">Send</button>
<button id="retrieve">Retrieve</button>

<script src="js/ProtocolWorker.js"></script>

<script>
var retrieveButton = document.querySelector('#retrieve');
var sendButton = document.querySelector('#send');
var input = document.querySelector('input');
var whisperWorker = new ProtocolWorker('web+whisper');
sendButton.addEventListener('click', function(){
var value = input.value.trim();
  if (value) {
    whisperWorker.request({
      '@context': 'http://schema.org',
      '@type': 'Comment',
      comment: value
    }).then(function(){
      alert('Your message has been whispered to your provider!')
    }).catch(function(){
      alert('You either declined to whisper something to me or don\'t have a web+whisper provider :/')
    });
  }
  else alert('You didn\'t whisper anything.');
});
retrieveButton.addEventListener('click', function(){
  whisperWorker.request({
    '@context': 'http://schema.org',
    '@type': 'Search'
  }).then(function(data){
    alert('You last whispered: ' + data);
  }).catch(function(){
    alert('You either decided not to let this app see your last whisper, or don\'t have a web+whisper provider :/')
  });
});
</script>
```

#### Transactions should follow shared semantics

As you may have noticed above, each `ProtocolWorker` request above is formatted in accordance with a matching data description from [Schema.org](http://schema.org/). Schema.org is a great resource for semantic data descriptors, which I believe are a solid Lingua-franca upon which to transact custom protocol requests. Who knows, maybe browsers could validate and enforce these semantic data structures some day?

## Just show me the demo, clown.

1. I have the demo code above running on a couple Github domains so you can test the interplay between providing and consuming apps - note: you need to be using a desktop version of Firefox, Chrome, or Opera. Here are the steps to follow: 1. Add the demo provider as your Web Whisper handler by clicking the "Add Provider" button, and accepting the handler via the browser's permission UI: <http://web-protocols.github.io/provider-demo/>
2. Visit the consuming app demo page and whisper something to your provider by entering a message in the input and clicking the send button. It will prompt you to select a provider, make sure you pick the "Whisper Demo Provider" you just added: <http://csuwildcat.github.io/ProtocolWorker/>
3. OPTIONAL: You'll notice an option to make your provider choice the default when the browser selection UI is raised in the consuming app demo. If you select a provider as your default, all subsequent `ProtocolWorker` calls will happen instantly in the background, without bugging you to choose a handler.

[Christian Heilmann](https://twitter.com/codepo8) was kind enough to shoot a quick screen cast of the steps above:

<iframe allowfullscreen="allowfullscreen" frameborder="0" height="315" src="https://www.youtube.com/embed/VIhREuWcAK8" width="560"></iframe>## Where do we go from here?

As we've discussed, there are new and existing APIs and specs that could be modified to enable these use-cases - ServiceWorker could be a candidate, but regardless of what form the solution takes, let's come together as a community of developers and platform implementers to move the web forward. I encourage you to submit your own requirements, technical feedback, and implementation ideas directly to this Github repo: <https://github.com/csuwildcat/ProtocolWorker/issues/1>