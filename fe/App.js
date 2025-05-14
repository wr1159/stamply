import React, { useEffect } from "react";
import { Text, View, Alert, TouchableOpacity } from "react-native";
import NfcManager, { NfcTech, NfcEvents } from "react-native-nfc-manager";

function App() {
  useEffect(() => {
    NfcManager.start();

    const sub = NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
      console.log("Tag discovered:", tag);
      Alert.alert("NFC Tag", JSON.stringify(tag));
      NfcManager.setAlertMessageIOS("NFC tag read!");
      NfcManager.unregisterTagEvent().catch(() => {});
    });

    return () => {
      sub.remove();
      NfcManager.stop();
    };
  }, []);

  const scanNfc = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
    } catch (err) {
      console.warn("Scan failed:", err);
      await NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity onPress={scanNfc}>
        <Text style={{ fontSize: 20 }}>📡 Scan NFC Tag</Text>
      </TouchableOpacity>
    </View>
  );
}

export default App;
