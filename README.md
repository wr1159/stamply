## Stamply — “collect the world, one tap at a time”

Stamply turns any NFC sticker at a landmark into a *free* on-chain “stamp”.  
Users open the Stamply mobile app, tap a plaque, and an NFT for that place lands in their wallet in ~6 s — **with zero gas paid by the user**.  
All contracts live on **Polkadot Hub’s native EVM**, the backend sponsors fees, and the app is built with **Expo + React-Native NFC**.

---

### 🗂 Monorepo structure

stamply/
│
├─ contract/         # Solidity + Hardhat for Polkadot Hub
│   ├─ contracts/
│   │   ├─ StampNFT.sol          # ERC-721 implementation (clone target)
│   │   └─ StamplyRegistry.sol   # factory + gas-free mint logic
│   └─ scripts/                  # deploy & verify
│
├─ backend/          # Next.js  (Typescript) for easy deployment
│   ├─ app/api/claim/route.ts    # Route Handler — POST {uid, addr}
│   └─ .env.local                # RPC URL + hot-wallet seed
│
└─ frontend/         # React-Native + Expo dev-client
    ├─ App.tsx                    # NFC scan → fetch('/api/claim')
    └─ screens/Leaderboard.tsx    # live polkadot-js WS event stream (⬇️Low Priority Target)
---

### ⚙️ Contract layer (`/contract`)

* **Polkadot Hub native EVM** lets us keep pure Solidity while benefiting from Polkadot security and interoperability.  
* `StamplyRegistry` deploys minimal-proxy clones of `StampNFT` via **OpenZeppelin Clones** (EIP-1167) for gas-cheap collections.  
* `registerLandmark(nfcId, name, imgUrl, desc)` ⇒ deploys a deterministic clone and stores it in `landmarks[nfcId]`.
* `claimStamp(nfcId, to)` ⇒ mints a free token to `to`, emitting `StampClaimed`.

All tasks are scripted in **Hardhat** (`npx hardhat deploy`) which compiles Solidity 0.8.23 and connects to the Hub RPC.

---

### 🌐 Backend (`/backend`)

A minimal **Next.js 14** Route Handler (`app/api/claim/route.ts`) receives `{uid, addr}` and:

1. Looks up `landmarks[uid]` on chain.  
2. Builds `registry.claimStamp(uid, addr)` with **viem**.  
3. Pays the gas fee from a funded hot wallet (mint ≈ \$0.01).  

---

### 📱 Frontend (`/frontend`)

* **Expo dev-client** embeds native modules; free tier gives 5 iOS builds per month.  
* **React-Native NFC Manager** reads NTAG 215 UID cross-platform.  
* After a tap, the app `POST`s to `/api/claim`; when Polkadot emits the `StampClaimed` event, the app shows confetti and pushes the wallet link.  
* Live leaderboard subscribes to `api.query.system.events()` over WebSocket.

---

### 🏗 Local development

```bash
# 1. contracts
cd contract && npm i
npx hardhat test
npx hardhat run scripts/deploy.ts --network hubTestnet

# 2. backend
cd ../backend && npm i
npm run dev               # localhost:3000/api/claim

# 3. frontend
cd ../frontend
npm i
eas build --profile development --platform ios   # one-time dev-client
expo start --dev-client

### ✨ How the *gas-free* flow works

1. **Reader app** sends `{uid, addr}`.  
2. **Backend** signs & pays the extrinsic.  
3. **Polkadot Hub** confirms in ~6 s; fee is drawn from the relayer wallet.  
4. **Mobile app** gets the event → NFT visible in any ss58 wallet.

No DOT required from the user — perfect for first-time visitors.

---

### 📌 Roadmap (future work)

* UID anti-replay (NTAG read-counter + HMAC).  
* AR overlay and Mapbox clustering.  
* Wormhole bridge to mirror stamps on other chains (multichain bonus).  
* Progressive Web App viewer for desktop collectors.

---

**Happy stamping!**  Collect the venue, city, or world — one NFC tap at a time.
