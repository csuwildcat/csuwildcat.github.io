---
title: 'Scaling Decentralized Apps & Services via Blockchain-based Identity Indirection'
pubDatetime: 2016-07-12T21:02:52Z
featured: true
author: 'Daniel Buchner'
tags:
  - blockchain
  - identity
  - scalability
  - decentralized apps
  - Bitcoin
description: Exploring how blockchain-based identity indirection can address the scalability challenges of decentralized applications and services while maintaining consensus guarantees.
---

## Blockchain Scalability

Developers of apps and services, blockchain-based or not, must always consider efficiency and scalability in determining how to best serve the needs of their users. This is especially true when you add new or emerging technologies to the equation. In the realm of blockchain-based apps and services, scalability considerations are magnified by the distributed nature of the underlying system. In order to maintain the unique guarantees of a blockchain, transactions must be processed with a mechanism that ensures consensus, then propagated across the network. These constraints introduce three major scalability challenges: 1. Propagation over a distributed system
2. Consensus processing of transactions
3. Data duplication size and cost

### Transaction Rate

Currently there are two main blockchains: Bitcoin and Ethereum. Neither of these large-scale blockchain implementations publicly exceed double digits in per-second transaction rates. While various members of the blockchain community are experimenting with Proof of Stake and Sharding, which could theoretically push transaction rates "into the millions per second", these additions introduce new constraints and network characteristics that could impact how developers write apps and services. But let's assume blockchains could process *millions* of transactions per second - is that enough? The real question is: *"How many transactions per second would we need for an on-chain world of people, apps, services, and devices?"*To answer that, imagine a world where organic and inorganic entities are generating frequent, on-chain transactions - here are a few examples of transaction sources: - Billions of people each generating transactions throughout the day
- Hundreds of millions of IoT devices triggering transactions
- Millions of apps, services, and bots performing background transactions

When you consider the breathtaking enormity of the scale, it's hard to precisely quantify a lower bound, but *BILLIONS* of transactions per second may be *conservative*.

![Dr Evil](https://www.backalleycoder.com/wp-content/uploads/2016/07/rzyfKR5.png)

### Transaction-related Computation

Another scalability consideration is the fact that transactions on some blockchains trigger consensus-based computation of programmatic 'contracts'. While this is a neat feature, it also incurs a significant cost that must be borne by nodes on the network. Ethereum devs themselves are open about the fundamental performance limitations of these contract computations: > "Clearly Ethereum is not about optimizing efficiency of computation. Its parallel processing is redundantly parallel. This is to offer an efficient way to reach consensus on the system state without needing trusted third parties, oracles or violence monopolies. But importantly they are not there for optimal computation. The fact that contract executions are redundantly replicated across nodes, naturally makes them expensive, which generally creates an incentive not to use the blockchain for computation that can be done off-chain."

(I want you to remember the word `off-chain`, it's going to come up a lot)

### Data Storage

Blockchains do not allow much data to be embedded within their transactions, and rightly so, because duplicating data across a significant number of nodes is a non-starter when you're talking about billions of transactions per second. In fact, at those transactional rates - even with strict transactional data limits, pruning, and aggressive transaction aggregation - the network would still generate *hundreds of petabytes* of data annually. This would likely reduce the number of full nodes in the network, and the widespread replication of blockchain transactional data that goes with it.

## Consider the Following

The most common way of developing decentralized apps and services with blockchain tech is to create a digital record of source data, link it to an on-chain blockchain transaction via a hash of the data + timestamp, then store the source data off-chain somewhere. Let's call this method the *Blockchain Transactional Model*. But what does this model really provide? 1. The on-chain transaction provides a rough timestamp based on when it is added to the chain.
2. The hash embedded in the transaction records the state of off-chain data, but does not provide storage of that data.
3. Both 1 and 2 are synced to the global ledger, and off-chain data can be validated against the embedded hash.

What if I told you blockchain-anchored identity could provide a more efficient means to achieve the majority of off-chain use-cases? I submit the following for your consideration: > Most non-monetary blockchain use-cases can be accomplished off-chain using a combination of blockchain-anchored identity, cryptographic signatures, and traditional storage systems - all while retaining the features developers desire and avoiding the scalability issues of on-chain transactions.

## Identity - The Red Pill

There are known choke points in the transmission, computation, and storage of on-chain transactions that make the Blockchain Transactional Model prohibitive at high levels of transactional load. But what does that mean for the promise of decentralized apps and services - is blockchain still the solution? The answer is yes, but you'll need to free your mind.

![red-pill-blue-pill](https://www.backalleycoder.com/wp-content/uploads/2016/07/red-pill-blue-pill-300x269.png)

We are currently working on an open source system that will enable cross-blockchain registrations of identifiers for self-sovereign identities. Think of it like a transparent, open source, blockchain-based naming and identity layer for the world. Users will own their identities and can prove ownership based on control of a private key linked to a known identifier. \[alert color="blue" icon="exclamation-circle"\] A blockchain-based identity can be used to represent any type of entity, including: people, apps, services, companies, government agencies, etc. \[/alert\] Regardless of the non-monetary decentralized app or service use-case - *rental agreement, supply chain system, car title transfer, or any other attestation* - it all boils down to three key features: 1. Capturing the state of data
2. Logging time of occurrence
3. Verifying the participation of all parties involved

It turns out we can accomplish all three of these by having various parties to an action sign a payload comprised of source data, the state of that data, the time of occurrence (if relevant), and proof of participation using their globally verifiable, blockchain-based identity.

## Use-Case: Renting an Apartment

Let's compare how non-monetary, blockchain-based use-cases are handled under the Blockchain Transactional Model, vs handling them entirely off-chain via the Blockchain Identity Model. Imagine Jane wants to rent an apartment from Bill - here's how that plays out under each model:

### **Blockchain Transactional Model (On-Chain)**

![rental-agreement-flow](https://www.backalleycoder.com/wp-content/uploads/2016/07/rental-agreement-flow.svg)

#### Result:

- A blockchain is used to record a hash of a rental agreement document and meta data - *a scale bottleneck at higher transaction rates.*
- You must be online to commit a transaction to a blockchain - *a blocker for many use-cases that demand quick resolution.*
- Bill and Jane have forced a huge, distributed consensus system to store a hash of the rental agreement only they are interested in - *introduces scale problems without providing a clear benefit.*
- Bill and Jane still must save and maintain the original rental agreement document if it is ever needed for verification or inspection, because a hash alone is just a proof of state - *it doesn't escape off-chain data maintenance.*
- Bill and Jane are still required to prove that they each signed the rental document, which either requires traditional means of verification or a system of verifiable, digital identity - *identity is an ever-present issue.*

### Blockchain Identity Model (Off-Chain):

![identity-rental-agreement-flow](https://www.backalleycoder.com/wp-content/uploads/2016/07/identity-rental-agreement-flow.svg)

#### Result:

- Use of a blockchain is only required once for each participant to register their identity, which can happen prior to this entire use-case taking place, *yay, it scales!*
- Bill and Jane don't have to worry about the cost, hassle, and delay in broadcasting a transaction to a huge, distributed consensus system, while retaining all the features they wanted from the on-chain model - *less blockchain is more in many cases.*
- Bill and Jane still save their agreement payload off-chain, just as with the Blockchain Transactional Model, but instead the payload contains everything they need: the source document, data state hash, and identity signatures for verification  *fewer moving parts and no added burden.*
- Bill and Jane can now complete this entire use-case with standard, scalable systems, even while offline, then sync the payload to the secure storage services of their choice - *more flexibility with less complexity.*

## Implications

Blockchain-based identity should cause you to question core assumptions around modeling and implementation of decentralized app and service use-cases. As a result, you should ask whether or not your use-case truly requires on-chain transactions. Here are a few important points to take away from this post: 1. The scalability issues with blockchains are an irrelevant mirage for the majority of decentralized app and service use-cases.
2. Hashes or Merkle Roots stored on the blockchain may be valuable in certain unique situations where no combination of identity signatures can be trusted and there is no viable third-party witness, like a Notary Public or a government agency.
3. We can build scalable, decentralized apps and services today by enabling entities to sign off-chain payloads with blockchain-based identities.

### Determining On-Chain vs Off-Chain

Here is a little pseudo-code test to help you determine whether to use the off-chain Blockchain Identity Model or the on-chain Blockchain Transactional Model:

```javascript

if (selfAsserted || groupSigsAreTrusted || canBeAttestedByNeutralParty) {
  useOffChainIdentitySignatures();
}
else {
  anchorItOnChain();
}

```

### Feature Comparison

Last but not least, here's a feature breakdown of the two models:

| Features                              | Traditional (On-Chain) | Identity (Off-Chain) |
|----------------------------------------|:----------------------:|:--------------------:|
| ~Unlimited scalability                 | ❌                     | ✅                   |
| Eliminates the need for off-chain storage | ❌                  | ❌                   |
| Transactions are verifiable without middlemen | ✅              | ✅                   |
| Solves identity verification           | ❌                     | ✅                   |
| Reuses existing systems and tools      | ❌                     | ✅                   |
| Doesn't require learning new languages | ❌                     | ✅                   |
| Not tied to any one blockchain         | ❌                     | ✅                   |