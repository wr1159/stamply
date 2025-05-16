


## Sutanpu — "collect the world, one tap at a time"


Sutanpu turns any NFC sticker at a landmark into a *free* on-chain "stamp".  
Users open the Sutanpu mobile app, tap a plaque, and an NFT for that place lands in their wallet in ~6 s — **with zero gas paid by the user**.  
All contracts live on **Polkadot Hub's native EVM** AND **Bahamut Horizon Testnet** AND **BaseSepolia** (With ForteRuleEngine), the backend sponsors fees, and the app is built with **Expo + React-Native NFC**.
No Gas from the user — perfect for first-time visitors.

---
<img src="https://github.com/user-attachments/assets/524545ea-5c96-402c-9f2d-f666d9d3b215" width="300" />
<img src="https://github.com/user-attachments/assets/ff56e69e-948b-4ee7-a33f-5bafe14b6fae" width="300" />
<img src="https://github.com/user-attachments/assets/03a70c12-9a13-4fba-bed2-1bf3da40ba6d" width="300" />
<img src="https://github.com/user-attachments/assets/c88f6ae3-cc50-4e47-851b-de99bbfb1740" width="300" />

### Addreses

PolkadotHub Contract: `0x66b7a4AE4dAfAc28D852ea1f7E5B6C470330FD0D`
BahamutHorizon Contract: `0x478e6ebb4d015aa9bf4063b4d499ad1db58483b4`
BaseSepolia Address: `0x4E448907B4B8d5949D4A6C67f34419dBb29690bD`
BaseSepolia PolciyId: `78`
---

### 🗂 Monorepo structure

```
stamply/
│
├─ contract/         # Solidity + Hardhat for Polkadot Hub
│   ├─ contracts/
│   │   ├─ StampNFT.sol          # ERC-721 implementation (Ownable)
│   │   └─ StamplyRegistry.sol   # direct deployment factory + mint redirect logic
│   └─ scripts/                  # deploy & verify
│
├─ contracts-fre/    # Forte Rules Engine integration
│   ├─ stamplypolicy.json        # Configurable policy for gamification & limits
│   └─ index.ts                  # SDK tools for policy management
│
├─ backend/          # Next.js  (Typescript) for easy deployment
│   ├─ src/
│   │   ├─ app/api/claim/route.ts    # Route Handler — POST {nfcId, toAddress}
│   │   ├─ lib/abis/              # Contract ABIs for viem
│   │   └─ config/index.ts       # Configuration with env vars
│   └─ .env.local                # RPC URL + hot-wallet seed
│
└─ frontend/         # React-Native + Expo dev-client
    ├─ App.tsx                    # NFC scan → fetch('/api/claim')
    └─ screens/Leaderboard.tsx    # live polkadot-js WS event stream (⬇️Low Priority Target)
```

---

### ⚙️ Contract layer (`/contract`)

* **Polkadot Hub native EVM** stamps for everyone in polkadot!
* **Bahamut Horizon Testnet** stamps for everyone in Bahamut too!
* `StamplyRegistry` deploys new `StampNFT` instances for each landmark using the `new` keyword.
* `StampNFT` is a simple ERC-721 + ERC721URIStorage implementation that's `Ownable` with the registry as its owner.
* `registerLandmark(nfcId, name, symbol, img, desc)` ⇒ deploys a new StampNFT instance and stores it in `landmarks[nfcId]`.
* `claimStamp(nfcId, to)` ⇒ mints a free token to `to`, emitting `StampClaimed` with the token ID.
* Each landmark's NFT collection has its own separate token ID counter starting from 0.

All tasks are scripted in **Hardhat** (`npx hardhat run scripts/deploy-registry.ts`) which compiles Solidity 0.8.23 and connects to the Hub RPC. There are also helper scripts for registering landmarks and claiming stamps.

---

### 🎮 Forte Rules Engine (`/contracts-fre`)

* **Smart Policies** extend Sutanpu with configurable rules without changing the core contracts.
* Key features enabled by the Forte Rules Engine:
  * **Daily Claim Limits**: Caps claims at 500 per day to prevent spam and exploitation.
  * **Milestone Celebrations**: Special events triggered at visitor milestones (e.g., 100th visitor).
  * **Landmark-Specific Rewards**: Custom rules for specific venues like the Aquarium.
  * **Tourism Analytics**: Tracking metrics important for tourism boards.
  * **Seasonal Promotions**: Ability to modify rules based on seasons without redeployment.

The `stamplypolicy.json` defines all rules and trackers, which can be updated without redeploying core contracts.

To setup and apply the policy:

```bash
cd contracts-fre
npm i
# Create and register policy
npx tsx index.ts setupPolicy stamplypolicy.json
# Apply policy to your contract
npx tsx index.ts applyPolicy <POLICY_ID> <CONTRACT_ADDRESS>
```

---

### 🌐 Backend (`/backend`)

A minimal **Next.js 14** API endpoint (`src/app/api/claim/route.ts`) that:

1. Receives `POST` request with `{nfcId, toAddress}`
2. Uses **viem** to interact with the StamplyRegistry contract
3. Converts NFC ID to the proper bytes32 format
4. Simulates and then submits the transaction
5. Pays gas fees from a backend hot wallet
6. Waits for transaction confirmation and checks for emitted events
7. Returns transaction details and token ID to the client

The `/api/claim` endpoint handles all blockchain interaction on behalf of users, making the experience completely gas-free for them.

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
npx hardhat run scripts/deploy-registry.ts --network hubTestnet

# Register a landmark (edit the script first to update registry address)
npx hardhat run scripts/register-landmark.ts --network hubTestnet

# Claim a stamp (edit the script first to update registry address and recipient)
npx hardhat run scripts/claim-stamp.ts --network hubTestnet

# 2. backend
cd ../backend && npm i
# Create .env.local with private key for gas-relaying hot wallet
npm run dev               # localhost:3000/api/claim

# Test the API with curl
curl -X POST http://localhost:3000/api/claim \
  -H "Content-Type: application/json" \
  -d '{"nfcId":"example-nfc-id-1","toAddress":"0x1e527408BFC6Fcaf91a7Fb0c80D11F57E8f171Cb"}'

# 3. frontend
cd ../frontend
npm i
eas build --profile development --platform ios   # one-time dev-client
expo start --dev-client

### ✨ How the *gas-free* flow works

1. **User app** reads NFC tag and sends `{nfcId, toAddress}` to backend API.  
2. **Backend** signs & pays for the transaction using viem + hot wallet.  
3. **Blockchain** (Polkadot Hub or Bahamut) confirms in ~6 s; fee is drawn from the hot wallet.  
4. **Mobile app** gets the transaction details → NFT visible in any compatible wallet.
```

---

### 📌 Roadmap (future work)

* UID anti-replay (NTAG read-counter + HMAC).  
* AR overlay and Mapbox clustering.  
* Wormhole bridge to mirror stamps on other chains (multichain bonus).  
* Progressive Web App viewer for desktop collectors.
* Enhanced gamification through advanced Rules Engine policies.

---

**Happy stamping!**  Collect the venue, city, or world — one NFC tap at a time.
