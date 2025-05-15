import { Redirect } from "expo-router";
import { usePrivy } from "@privy-io/expo";
import CollectionScreen from "../components/CollectionScreen";

export default function Collection() {
  const { ready, authenticated } = usePrivy();

  if (!ready) {
    return null;
  }

  if (!authenticated) {
    return <Redirect href="/" />;
  }

  return <CollectionScreen />;
}
