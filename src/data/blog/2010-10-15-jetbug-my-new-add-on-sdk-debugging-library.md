---
title: 'Jetbug – Mozilla Add-on SDK debugging library'
pubDatetime: 2010-10-15T07:13:37Z
author: 'Daniel Buchner'
tags:
  - Jetpack
  - Mozilla
  - debugging
  - Firefox
description: A debugging library for Mozilla Add-on SDK that enables Firebug-based debugging of add-on code with support for chrome-level objects and SDK API introspection.
---

Dogfooding is an essential part of product development for many reasons and should not be a task set aside for only certain teams. Dogfooding products helps you understand the true user experience a product offers, brainstorm new features, and uncover rough edges in need of correction. Recently while using the Add-ons SDK for a Personas related add-on, I got frustrated with the stringified console logging available by default in the SDK. While attempts were made in the past to provide more robust debugging, none have been able to maintain stability, as they were strongly tied to various moving-target applications.

### <del>Necessity</del> Annoyance, Mother of Invention

 As I set out on a search for something that would provide a better debugging experience for SDK-base add-ons, I thought I'd first take a crack at utilizing the best debugger on the planet, Firebug. To my delight (and hopefully yours as well) I was able to construct an Add-on SDK library that enabled Firebug-based debugging of add-on code in a way that should remain stable regardless of any future SDK release or Firebug code changes. ![](http://blog.mozilla.com/addons/files/2010/10/jetbug_logo.png)### Jetbug to the rescue!

 Welcome to logging of chrome-level objects and elements. Say hello to introspection of an add-on's contents. Meet invocation of SDK APIs from the Firebug command line. Yeah, I know, its going to rock your socks. Jetbug is pretty flexible and should go a long way to advance the developer ergonomics story for the Add-ons SDK. [Download the Jetbug SDK library](http://people.mozilla.com/~dbuchner/sdk_libs/jetbug.zip) and drop it into an add-on you're working on. There is a readme file included in the library that contains a brief explanation of how to use Jetbug and what methods are available to you. Let us know how you like it, we'd love to hear your feedback!