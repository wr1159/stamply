# Stamply Backend

The backend for the Stamply app, providing a server that handles NFC ID to NFT minting through a simple API.

## Features

- **Gas-Free Minting**: Backend pays gas fees for users, enabling a seamless experience
- **Simple API**: Single `/api/claim` endpoint accepts NFC ID and recipient address
- **Chain Support**: Currently deployed on Bahamut Horizon Testnet and PolkadotHub

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file with the following variables:

   ```
   # Blockchain RPC URL
   RPC_URL=https://test-rpc.bahamutchain.io
   
   # Contract addresses
   REGISTRY_ADDRESS=0x478e6ebb4d015aa9bf4063b4d499ad1db58483b4
   
   # Private key for hot wallet (DO NOT COMMIT THE ACTUAL PRIVATE KEY)
   PRIVATE_KEY=your_private_key_here
   
   # Optional rate limiting settings
   RATE_LIMIT_REQUESTS=10
   RATE_LIMIT_WINDOW_SECONDS=60
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

## API Endpoints

### `/api/claim` (POST)

Claims an NFT stamp for a given NFC ID and recipient address.

**Request Body**:

```json
{
  "nfcId": "example-nfc-id-1",
  "toAddress": "0x1e527408BFC6Fcaf91a7Fb0c80D11F57E8f171Cb"
}
```

**Response (Success)**:

```json
{
  "success": true,
  "transactionHash": "0x123...",
  "blockNumber": 12345,
  "tokenId": 0,
  "nfcId": "example-nfc-id-1",
  "toAddress": "0x1e527408BFC6Fcaf91a7Fb0c80D11F57E8f171Cb"
}
```

**Response (Error)**:

```json
{
  "error": "Error message here"
}
```

## How It Works

1. User scans an NFC tag with the mobile app
2. App sends the NFC ID and user's wallet address to `/api/claim`
3. Backend converts the NFC ID to bytes32 format
4. Backend calls `claimStamp` on the StamplyRegistry contract
5. Backend pays the gas fee using its hot wallet
6. Backend waits for transaction confirmation
7. Backend returns the transaction details and token ID to the app

## Testing

You can test the API using curl:

```bash
curl -X POST http://localhost:3000/api/claim \
  -H "Content-Type: application/json" \
  -d '{"nfcId":"example-nfc-id-1","toAddress":"0x1e527408BFC6Fcaf91a7Fb0c80D11F57E8f171Cb"}'
```

Or using a tool like Postman.

## Security Considerations

- The backend uses a hot wallet with a private key to send transactions
- In production, ensure the private key is securely stored and has limited funds
- Consider implementing rate limiting and authentication for the API
