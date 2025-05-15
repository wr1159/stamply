import "dotenv/config";

export default {
  expo: {
    name: "Stamply",
    version: "1.0.0",
    scheme: "stamply",
    extra: {
      PRIVY_APP_ID: process.env.PRIVY_APP_ID,
      PRIVY_CLIENT_ID: process.env.PRIVY_CLIENT_ID,
    },
    plugins: ["expo-secure-store", "expo-web-browser"],
  },
};
