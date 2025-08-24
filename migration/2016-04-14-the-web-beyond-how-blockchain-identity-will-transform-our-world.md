---
id: 166
title: 'The Web Beyond: How blockchain identity will transform our world'
date: '2016-04-14T10:32:09-07:00'
author: 'Daniel Buchner'
layout: post
guid: 'https://www.backalleycoder.com/?p=166'
permalink: /2016/04/14/the-web-beyond-how-blockchain-identity-will-transform-our-world/
ao_post_optimize:
    - 'a:6:{s:16:"ao_post_optimize";s:2:"on";s:19:"ao_post_js_optimize";s:2:"on";s:20:"ao_post_css_optimize";s:2:"on";s:12:"ao_post_ccss";s:2:"on";s:16:"ao_post_lazyload";s:2:"on";s:15:"ao_post_preload";s:0:"";}'
categories:
    - Bitcoin
    - Blockchain
---

## Imagine

Jane wakes up to the sound of her alarm clock, it's 6:13 AM. "Oh great, what am I in for today," she thinks. Jane's alarm clock is normally set for 6:30 AM, but her identity agent detected a traffic accident that is projected to add 17 minutes to her commute. Jane's identity agent, acting on her behalf, changed her alarm while she was sleeping. All three, Jane's identity, the identity of her alarm clock, and the identity of her agent, are connected via a self-sovereign, decentralized, blockchain-anchored identity system. Jane gets ready and grabs a yogurt from the fridge as she heads out the door. The yogurt was delivered yesterday, after her fridge detected she was out. Her fridge's identity has been granted limited access to initiate purchases for her. In this case, Jane has opted to be notified for confirmation of any purchases her fridge initiates; yesterday Jane swiped "Confirm" when the identity management app on her phone asked if the fridge could execute a purchase of some groceries. The fridge executed a payment over the blockchain using Jane's identity-linked blockchain wallet and the wallet linked to the grocery store's identity. That's right, the grocery store has a blockchain-anchored identity as well. Starting to get the picture? Jane needs to get to a downtown office building where she is scheduled to meet a contact on the 12th floor. Jane doesn't have a car, so she asks her identity agent to fetch her one by leveraging the many identity crawlers dedicated to indexing sharing economy identity data. These crawlers are always hard at work, real-time indexing the (user allowed) blockchain identity data changes of every person, place, device, and intangible entity on Earth. In this case, there are hundreds of drivers in Jane's general vicinity who have granted popular ride sharing identity agents access to read and update their identity's ride sharing fields. Jane uses her preferred crawler's app to send signed, encrypted requests directly to providers of sharing economy services. The crawler identifies a driver whose identity shows a ride sharing status of "Available," with a geolocation value that indicates he is close to Jane. Jane taps "Request a Ride" on the app and it immediately sends a message to the communication endpoint listed on the driver's blockchain identity. The driver's blockchain sharing economy app alerts him that a new ride request was received and asks whether he wants to accept. The driver accepts and is sent Jane's current geolocation. Upon arriving at her destination, Jane authorizes a payment of her driver's identity-linked blockchain wallet. She enters the office building and heads directly for the elevators, bypassing a lengthy check-in procedure in the ground floor lobby. Jane taps her phone against an NFC pad, which instantly identifies her via a challenge/response verification of her identity assertion. The elevator system's blockchain-anchored identity has been given access to the appointment schedules of the various software systems used by the companies that reside in the building. It uses Jane's identity datastore to locate the appointment entry, which was created by her contact. Within this entry is a signed directive to allow Jane's identity to access the elevator and take it to the 12th floor. Jane enters the elevator and the button for the 12th floor is already lit up. Just for fun, Jane tries hitting other buttons. But alas, she was not granted access to other floors, so the buttons don't light up and she isn't able to access them. Jane walks up to the front desk and alerts the attendant that she has arrived for her meeting. The attendant directs her to verify her identity once more, via the guest terminal. Jane is greeted by her contact and smiles at the thought of how efficient and interoperable the world has become, thanks to the universal blockchain-based identity system. ## Understand

A blockchain is a decentralized, distributed ledger that accounts for and stores cryptographically verifiable token ownership proofs, synced to computers around the globe. Blockchains represent an unprecedented opportunity to create standard, decentralized systems that handle complex activities in a more efficient, automated, programmable way than ever before. One of the most interesting applications of blockchain tech is in the area of identity. Identity has never, ever, had a good solution. Humanity has built countless centralized systems, federation schemes, and every hybrid of the two you can imagine. With a worldwide, decentralized blockchain of identity, that all ends. Each transaction on a blockchain allows for a small amount of data to be stored with it. For the purpose of identity, this data can be encoded with two things: 1. A registration for an ID (a friendly or unfriendly name), that is verifiable and indexable
2. A pointer to off-blockchain data that describes the identity attached to the ID

Whoever possesses the private key for one of these blockchain ID transactions controls the identity data attached to it. This allows us to do interesting things, like: - Lookup IDs on a cacheable index of the global ledger
- CRUD identity data connected to an ID at real-time speed
- Prove ownership of an ID, or verify data has been signed/sent by an ID's owner, using standard cryptographic methods

## Build

With a global blockchain of identity, we can dramatically transform almost every product or service that relies on interactions between living, non-living, and intangible things. Here are a few examples of what it will do: - Allows users to directly expose products or services to real-time crawlers and indexes, which can disintermediate centralized products/services in every vertical.
- Provides a means to lookup and contact anyone on the planet via the exposure of public or private (access limited) communication endpoints
- Simplifies service access and accounting schemes, like registering for API keys, leaky URL params, etc.
- Provides better mechanisms for verifying access/ownership of digital goods
- Solves the fundamental issues with provisioning, security, and access control for the IoT ecosystem

Here are a few developer-enabling features, APIs, and tools we can build into existing platforms to more rapidly realize this blockchain-based future: - Create a new protocol (chain:, bid: ?) that allows for CRUD and search of blockchain transactions/identities
- Build cloud services that make blockchain identity agents, and their bots, as easy to develop as all the social/messaging bot frameworks of today
- Develop new Web standards and browser features that integrate a more secure, more powerful blockchain-anchored system of authentication and identity into common flows, like login and request signing

- We may want to reuse/augment some existing mechanism, like the FIDO flow, etc.

^ This is the future we deserve, a standard, generative, user-sovereign world of identity that will fundamentally change the way we interface with every person and object around us.