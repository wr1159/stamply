import { Stack } from "expo-router";
import { PrivyProvider } from "@privy-io/expo";
import "dotenv/config";

export default function Layout() {
  return (
    <PrivyProvider
      appId={process.env.PRIVY_APP_ID}
      clientId={process.env.PRIVY_CLIENT_ID}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#FF69B4",
        },
      }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#FFF5F5" },
        }}
      />
    </PrivyProvider>
  );
}
