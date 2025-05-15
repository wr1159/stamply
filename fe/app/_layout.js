import { Stack } from "expo-router";
import { PrivyProvider } from "@privy-io/expo";
import Constants from "expo-constants";
import { View } from "react-native";

const PRIVY_APP_ID = Constants.expoConfig.extra.PRIVY_APP_ID;
const PRIVY_CLIENT_ID = Constants.expoConfig.extra.PRIVY_CLIENT_ID;

export default function Layout() {
  if (!PRIVY_APP_ID || !PRIVY_CLIENT_ID) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF5F5" }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#FFF5F5" },
          }}
        />
      </View>
    );
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      clientId={PRIVY_CLIENT_ID}
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
