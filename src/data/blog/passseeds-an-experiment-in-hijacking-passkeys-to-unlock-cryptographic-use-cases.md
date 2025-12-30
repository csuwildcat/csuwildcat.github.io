---
title: 'PassSeeds - Hijacking Passkeys to Unlock Cryptographic Use Cases'
pubDatetime: 2025-12-26T16:35:11Z
featured: true
author: 'Daniel Buchner'
tags:
  - passkeys
  - WebAuthn
  - cryptography
  - identity
  - key management
description: An exploration in using Passkeys as generalized cryptographic seed material to address new use cases while retaining the anti-phishing, biometric UX Passkeys provide.
---

[Passkeys](https://www.passkeys.io/) have made standard, secure, cryptographic authentication [accessible to all users](https://www.passkeys.io/who-supports-passkeys), but the Passkey model is largely restricted to the website and app login use case. PassSeeds is a technical experiment that explores this question: can we hijack the capabilties and user experience of Passkeys and apply it to use cases where the status quo is often users pasting key material into sites/apps or buying special hardware devices that can be difficult for less technical folks to deal with?

## How do Passkeys Work?

Passkeys are [WebAuthn credentials](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API) in the form of asymmetric key pairs, typically used for replacing passwords as the way users log into websites. A key pair is created on the user's device for a website and stored in a secure hardware module on the device. These key pairs are access-scoped to the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) of the site they were created on (examples of different origins: `example.com`, `other.example.com`, `test.com`). Passkeys have two modes: device-bound passkeys that never leave the hardware module on the user's device, and syncable passkeys that implementing vendors (iCloud Keychain, Google Password Manager, Windows Hello, etc.) replicate across a user's devices via an end-to-end encrypted sync process. This is a basic overview of the two primary UX flows for generating and using a passkey for login:

![Passkey flows](../../assets/images/passkey-flows.png)
<span class="caption" style="display:block; text-align:center; font-size:0.9em; color:#888;">
Image from Sahil Dahekar
</span>

A standard WebAuthn exchange uses a passkey to sign over two things: the `authenticatorData` and `clientDataHash`, which is a SHA-256 hash of JSON containing the challenge, origin, and action type (`get` or `create`). The authenticator chooses an allowed algorithm (most commonly ES256 on the P-256/secp256r1 curve) and never reveals the private key. WebAuthn does not let sites request raw key export, except for one-time access to the public key during initial creation of a passkey. That last part is critical to understand: after the initial creation of a passkey, the platform does not record the public key anywhere, or provide an API method by which to retrieve it, treating it effectively as a sensitive, private value it does not export or expose outside of the secure hardware module.

## The PassSeeds Concept

Passkeys provide phishing-resistant, biometrically gated use of cryptographic keys, but they are very narrowly designed for signing authentication assertions within centralized website flows. Meanwhile, seed and key management flows in Web-based apps remains primitive and convoluted: users copy 12-24 words, stash JSON keystores, or paste in raw keys across apps. PassSeeds introduces a novel approach: treat the passkey’s P-256 public key *itself* as seed material and retrieve it on demand through ECDSA public key recovery. The authenticator still keeps the private key and user-verification requirements, but the recovered public key bytes become the deterministic “PassSeed” that can fuel other cryptographic flows.

## Extracting the PassSeed with ECDSA Key Recovery

**Assumption:** you have already created a passkey with `userVerification: required`, and did not involve any server in doing so, never exporting the public key provided at generation time to anywhere outside the page/origin in which it was created (the WebAuthn login registration flow normally sends the server the passkey public key - we are explicitly NOT doing that!)

1. When the PassSeed's seed material is needed (the user wants to sign a Bitcoin transaction, sign a decentralized social media post, or generate/verify a zero-knowledge proof), the origin the PassSeed is bound to (the app/site the user chooses as their PassSeed wallet) crafts a formatted message (for example, `PassSeed ${nonce}`) and asks the user to sign it twice, via `navigator.credentials.get()`, using the same challenge and RP scope each time.  
2. Each assertion returns `authenticatorData`, `clientDataJSON`, and a P-256 ECDSA signature. Because both signatures are over the same message, the client can perform ECDSA public key recovery using the two signatures to derive the unique P-256 public key of the passkey. No private material leaves the authenticator; the app receives only the public key bytes.  
3. The recovered public key (compressed or uncompressed form) is the PassSeed. It is reproducible on demand by repeating the double-sign ECDSA recovery flow, with no exportation of the PassSeed public key at any time.

## Exporting the PassSeed as a Mnemonic

To make the PassSeed user-friendly, the implementation converts the 32-byte PassSeed into a standard BIP-39 mnemonic. In practice, the PassSeed is the SHA-256 hash of the recovered public key, represented as 32 bytes. For a 24-word phrase, the full 32 bytes are used; for a 12-word phrase, the first 16 bytes are used and fed into BIP-39's checksum mechanics. Users can write down or import that phrase; rerunning recovery on the same passkey yields the same phrase, and a different passkey yields a different phrase.

## Deriving Other Keys from the PassSeed

Once you have the PassSeed (public key bytes or its mnemonic-derived entropy), you can deterministically derive other cryptographic material:

- Bitcoin signing: use HKDF with a domain-separated label (for example, `PassSeed | secp256k1 | bitcoin main`) to produce 32 bytes, clamp to the secp256k1 field, and treat it as a private key for transaction signing.  
- Multi-chain or app keys: derive additional context-labeled keys for different chains, environments, or apps without ever touching the passkey’s private key.  
- ZKP credentials: derive scalar material for BLS12-381 or other proving curves, enabling deterministic prover keys or presentation keys for zero-knowledge credentials tied back to the passkey identity.  
- Symmetric uses: derive AES/GCM keys for sealed storage, message encryption, or envelope encryption of larger key blobs.

## Flow Sketch

**Enrollment**  
1) Call `navigator.credentials.create()` with `userVerification: required` to mint a P-256 passkey scoped to the RP ID.  
2) You may persist only the credential ID, user label, creation time, and other benign metadata. Do not export the public key, as it is effectively the private seed value of the PassSeed and can be recovered later through cryptographic means.

**Invocation**  
1) When an action needs authorization, show a clear summary (“sign Bitcoin transfer”, “derive ZKP key for credential presentation”).  
2) Issue two `navigator.credentials.get()` calls over the same canonical message.  
3) Recover the passkey’s public key via ECDSA recovery, turn it into the mnemonic if export is requested, and derive the needed child keys.  
4) Perform the downstream crypto (Bitcoin signing, ZKP proof generation, decryption) using the derived keys while keeping the passkey private key in the authenticator.

**Recovery / rotation**  
If a device is lost, enroll a new passkey to generate a new PassSeed. Any keys derived from the old PassSeed must be rotated or re-wrapped. The mnemonic acts as an exportable backup of the seed material but still depends on the user being able to reproduce the public key via the double-sign flow.

## Implementation

### Dependencies and helpers

The code below uses a specific set of crypto and CBOR helpers to keep the implementation compact. You can sub out or forgo these dependencies in your own implementation, but these were the ones selected for this reference build.

:::collapse{height=20rem}

```typescript
import * as bip39 from "bip39";
import { Decoder } from "cbor-x";
import { base64urlnopad } from "@scure/base";
import { sha256 } from "@noble/hashes/sha2.js";
import { p256 } from "@noble/curves/nist.js";
import { Field, invert, mod } from "@noble/curves/abstract/modular.js";
import { bytesToHex, bytesToNumberBE, concatBytes, hexToBytes, numberToBytesBE } from "@noble/curves/utils.js";

type NoblePoint = InstanceType<typeof p256.Point>;

const CURVE = p256.Point.CURVE();
const Fp = Field(CURVE.p);
const cborDecoder = new Decoder({ mapsAsObjects: false, useRecords: false });

function seedStringFromPublicKeyBytes(publicKeyBytes: Uint8Array): string {
  const seedBytes = sha256(publicKeyBytes);
  return PassSeed.bytesToHex(seedBytes);
}

function decodeDerSignature(signature: ArrayBuffer): { r: bigint; s: bigint } {
  const sig = p256.Signature.fromBytes(new Uint8Array(signature), "der");
  return { r: sig.r, s: sig.s };
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

function extractPublicKeyFromAttestation(attestationObject: ArrayBuffer): { x: Uint8Array; y: Uint8Array } {
  const value = cborDecoder.decode(new Uint8Array(attestationObject));
  if (!(value instanceof Map)) {
    throw new Error("Attestation object must decode to a CBOR map");
  }
  const authData = value.get("authData");
  if (!(authData instanceof Uint8Array)) {
    throw new Error("Attestation object missing authData");
  }

  if (authData.length < 37) {
    throw new Error("Authenticator data is too short");
  }

  const flags = authData[32];
  if ((flags & 0x40) === 0) {
    throw new Error("Attestation missing credential data");
  }

  let offset = 37;
  offset += 16;
  const credentialIdLength = (authData[offset] << 8) | authData[offset + 1];
  offset += 2 + credentialIdLength;

  const coseKeyBytes = authData.slice(offset);
  const coseKey = cborDecoder.decode(coseKeyBytes);
  if (!(coseKey instanceof Map)) {
    throw new Error("Credential public key must decode to a CBOR map");
  }
  const kty = coseKey.get(1);
  const alg = coseKey.get(3);
  const crv = coseKey.get(-1);
  const x = coseKey.get(-2);
  const y = coseKey.get(-3);

  if (kty !== 2 || alg !== -7 || crv !== 1) {
    throw new Error("Unexpected credential public key parameters");
  }

  if (!(x instanceof Uint8Array) || !(y instanceof Uint8Array) || x.length !== 32 || y.length !== 32) {
    throw new Error("Invalid credential public key coordinates");
  }

  return { x, y };
}

function recoverPublicKeys(
  r: bigint,
  s: bigint,
  messageHash: Uint8Array
): NoblePoint[] {
  const candidates: NoblePoint[] = [];
  const rMod = mod(r, CURVE.n);
  const sMod = mod(s, CURVE.n);
  const e = mod(bytesToNumberBE(messageHash), CURVE.n);

  if (rMod === 0n || sMod === 0n) {
    return candidates;
  }

  const rInv = invert(rMod, CURVE.n);

  for (let j = 0; j < 2; j += 1) {
    const x = rMod + BigInt(j) * CURVE.n;
    if (x >= CURVE.p) {
      continue;
    }

    const ySquared = mod(mod(x * x * x, CURVE.p) + CURVE.a * x + CURVE.b, CURVE.p);
    let yRoot: bigint;
    try {
      yRoot = Fp.sqrt(ySquared);
    } catch {
      continue;
    }

    const yCandidates = [yRoot, mod(-yRoot, CURVE.p)];

    for (const y of yCandidates) {
      const rPointBytes = concatBytes(
        new Uint8Array([0x04]),
        numberToBytesBE(x, 32),
        numberToBytesBE(y, 32)
      );

      let rPoint: NoblePoint;
      try {
        rPoint = p256.Point.fromBytes(rPointBytes);
      } catch {
        continue;
      }

      const sR = rPoint.multiply(sMod);
      const eG = p256.Point.BASE.multiply(e);
      const sRMinusEG = sR.add(eG.negate());
      const q = sRMinusEG.multiply(rInv);
      candidates.push(q);
    }
  }

  return candidates;
}

function pointToKey(point: NoblePoint): string {
  return PassSeed.bytesToHex(point.toBytes(false));
}
```

:::

### PassSeed.create()

This method orchestrates the complete WebAuthn credential creation flow, extracting the P-256 public key from the attestation object, and hashing it into a deterministic 32-byte seed string.

:::collapse{height=20rem}

```typescript
static async create(
  options: { user?: string; seedName?: string } = {}
): Promise<string> {
  const now = new Date();
  const {
    user = "anon",
    seedName = `PassSeed Seed - ${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`
  } = options;
  // Step 1: Initiate WebAuthn credential creation
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      rp: { name: "PassSeed" },
      user: {
        id: crypto.getRandomValues(new Uint8Array(16)),
        name: seedName,
        displayName: user
      },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "preferred"
      },
      timeout: 60000,
      attestation: "direct"
    }
  }) as PublicKeyCredential;

  if (!credential) {
    throw new Error("Credential creation cancelled");
  }

  // Step 2: Extract the public key from the attestation object
  const attestationObject = (credential.response as AuthenticatorAttestationResponse).attestationObject;
  const publicKey = extractPublicKeyFromAttestation(attestationObject);
  const publicKeyBytes = concatBytes(new Uint8Array([0x04]), publicKey.x, publicKey.y);

  return seedStringFromPublicKeyBytes(publicKeyBytes);
}
```

:::

**What this does:** Creates a new passkey through the WebAuthn API, extracts the credential's P-256 public key from the CBOR attestation object, and returns a hex-encoded SHA-256 hash of the public key bytes.

### PassSeed.toMnemonic()

This method converts PassSeed bytes (or a hex string) into a human-readable BIP-39 mnemonic phrase for backup and recovery.

```typescript
static async toMnemonic(passSeed: Uint8Array | string, wordCount: 12 | 24 = 24): Promise<string> {
  const passSeedBytes = typeof passSeed === "string" ? PassSeed.hexToBytes(passSeed) : passSeed;
  if (passSeedBytes.length !== 32) {
    throw new Error("PassSeed must be exactly 32 bytes");
  }
  if (wordCount !== 12 && wordCount !== 24) {
    throw new Error("Mnemonic word count must be 12 or 24");
  }

  const entropyBytes = wordCount === 12 ? passSeedBytes.slice(0, 16) : passSeedBytes;
  const entropyHex = bytesToHex(entropyBytes);
  return bip39.entropyToMnemonic(entropyHex, bip39.wordlists.english);
}
```

**What this does:** Accepts a 32-byte PassSeed (as bytes or hex), optionally truncates to 16 bytes for a 12-word phrase, and hands the entropy to `bip39.entropyToMnemonic` with the English wordlist.

### PassSeed.get()

This method retrieves an existing passkey (optionally by credential ID), performs two WebAuthn signatures over the same challenge, recovers the public key from the signatures, and returns the hex-encoded PassSeed string.

:::collapse{height=20rem}

```typescript
static async get(credentialId?: string): Promise<string> {
  // Step 1: Prepare a single challenge that both assertions will sign
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  
  const assertionOptions: CredentialRequestOptions = {
    publicKey: {
      challenge: challenge,
      timeout: 60000,
      userVerification: "preferred"
    }
  };

  // If credentialId is provided, target that specific credential
  if (credentialId) {
    assertionOptions.publicKey!.allowCredentials = [{
      type: "public-key",
      id: toArrayBuffer(base64urlnopad.decode(credentialId))
    }];
  }

  // Step 2: First signature - collect authenticator response
  const assertion1 = await navigator.credentials.get(assertionOptions) as PublicKeyCredential;
  
  if (!assertion1) {
    throw new Error("User cancelled authentication");
  }

  const response1 = assertion1.response as AuthenticatorAssertionResponse;
  const signature1 = response1.signature;
  const authenticatorData1 = response1.authenticatorData;
  const clientData1 = response1.clientDataJSON;

  // Capture the credential ID from the first assertion if not already provided
  const usedCredentialId = credentialId
    ? toArrayBuffer(base64urlnopad.decode(credentialId))
    : assertion1.rawId;

  // Step 3: Second signature over the same challenge
  assertionOptions.publicKey!.challenge = challenge;
  assertionOptions.publicKey!.allowCredentials = [{
    type: "public-key",
    id: usedCredentialId
  }];

  const assertion2 = await navigator.credentials.get(assertionOptions) as PublicKeyCredential;
  
  if (!assertion2) {
    throw new Error("User cancelled second authentication");
  }

  const response2 = assertion2.response as AuthenticatorAssertionResponse;
  const signature2 = response2.signature;
  const authenticatorData2 = response2.authenticatorData;
  const clientData2 = response2.clientDataJSON;

  // Step 4: Recover the public key from both signatures and intersect candidates
  const clientHash1 = sha256(new Uint8Array(clientData1));
  const signedData1 = concatBytes(new Uint8Array(authenticatorData1), clientHash1);
  const messageHash1 = sha256(signedData1);

  const clientHash2 = sha256(new Uint8Array(clientData2));
  const signedData2 = concatBytes(new Uint8Array(authenticatorData2), clientHash2);
  const messageHash2 = sha256(signedData2);

  const { r: r1, s: s1 } = decodeDerSignature(signature1);
  const { r: r2, s: s2 } = decodeDerSignature(signature2);

  const candidates1 = recoverPublicKeys(r1, s1, messageHash1);
  const candidates2 = recoverPublicKeys(r2, s2, messageHash2);

  const candidateMap = new Map<string, NoblePoint>();
  for (const candidate of candidates1) {
    candidateMap.set(pointToKey(candidate), candidate);
  }

  const intersection: NoblePoint[] = [];
  for (const candidate of candidates2) {
    const key = pointToKey(candidate);
    if (candidateMap.has(key)) {
      intersection.push(candidate);
    }
  }

  if (intersection.length !== 1) {
    throw new Error("Unable to recover a unique public key from signatures");
  }

  const publicKeyBytes = intersection[0].toBytes(false);
  return seedStringFromPublicKeyBytes(publicKeyBytes);
}
```

:::

**What this does:** Prompts the user to authenticate (optionally with a targeted credential), performs two assertions over the same challenge, reconstructs the public key via ECDSA recovery by intersecting candidate points from both signatures, and hashes the recovered public key into a hex PassSeed.

## Threat Model and Constraints

The authenticator still enforces RP binding and user verification before issuing signatures, so phishing resistance mirrors standard passkeys. The host page sees two signatures and the recovered public key; handling must assume the host can exfiltrate those values. Because the same message is signed twice, replay risk is mitigated by including nonces, RP ID, and a strict prefix so signatures cannot be repurposed. Syncable passkeys inherit the platform’s sync trust model, and attestation remains optional. Downgrade paths (password fallback, non-UV requests) should be disabled to avoid bypassing the PassSeed gate.

## Candidate Use Cases

- Passkey-gated Bitcoin wallet: derive a secp256k1 key for transaction signing without ever exporting a hot seed.  
- Deterministic ZKP credential agent: derive proving keys tied to the passkey so credential presentations require the same user-verified prompts.  
- Sealed personal storage: encrypt data to a symmetric key derived from the PassSeed so only a verified passkey invocation can decrypt.  
- Multi-party controls: require multiple PassSeeds (from different RP IDs or devices) to derive separate shares that unlock a combined operation.

## Open Questions

How portable is double-sign-based recovery across platform authenticators, and will any enforce nonce uniqueness that prevents repeated signing of the same message? Can RP binding policies be shared across multiple apps without weakening origin checks? What assurance do we have that public key recovery on P-256 is reliable across vendor implementations and signature formats?

## Next Steps

Prototype the double-sign recovery flow in a browser demo and validate that P-256 public key recovery works consistently across major platforms. Build the deterministic mnemonic export and HKDF-based derivations for secp256k1 and ZKP keys, then threat-model replay and misuse of the recovered public key.
