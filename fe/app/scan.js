import { Redirect } from "expo-router";
import { usePrivy } from "@privy-io/expo";
import ScanScreen from "../components/ScanScreen";

export default function Scan() {
  const { ready, authenticated } = usePrivy();

  if (!ready) {
    return null;
  }

  if (!authenticated) {
    return <Redirect href="/" />;
  }

  return <ScanScreen />;
}
