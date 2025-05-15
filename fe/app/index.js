import { Redirect } from "expo-router";
import { usePrivy } from "@privy-io/expo";
import LoginScreen from "../components/LoginScreen";

export default function Index() {
  const { ready, authenticated } = usePrivy();

  if (!ready) {
    return null;
  }

  if (authenticated) {
    return <Redirect href="/scan" />;
  }

  return <LoginScreen />;
}
