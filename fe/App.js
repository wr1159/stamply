import { StatusBar } from "expo-status-bar";
import { Text, View, ScrollView, Image } from "react-native";
import { useState, useEffect } from "react";
import NfcManager, { NfcTech, NfcEvents, Ndef } from "react-native-nfc-manager";
import { styles } from "./styles";

const stampImages = {
  cntower: require("./assets/stamps/cntower.png"),
  aquarium: require("./assets/stamps/aquarium.png"),
};

export default function App() {
  const [hasNfc, setHasNfc] = useState(null);
  const [collectedStamps, setCollectedStamps] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const checkNfc = async () => {
      const supported = await NfcManager.isSupported();
      setHasNfc(supported);
      if (supported) {
        await NfcManager.start();
        startNfcScan();
      }
    };
    checkNfc();

    // return () => {
    //   NfcManager.cancelTechnologyRequest();
    // };
  }, []);

  const getStampTitle = (stampLocation) => {
    switch (stampLocation) {
      case "cntower":
        return "Toronto's CN Tower";
      case "aquarium":
        return "Ripley's Aquarium of Canada";
      default:
        return "Unknown Location";
    }
  };

  const getStampImage = (stampLocation) => {
    switch (stampLocation) {
      case "cntower":
        return stampImages.cntower;
      case "aquarium":
        return stampImages.aquarium;
      default:
        return "";
    }
  };

  const startNfcScan = async () => {
    if (isScanning) return;

    try {
      console.log("Starting NFC Scan...");
      setIsScanning(true);
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      if (tag) {
        // Add new stamp to collection
        const stampLocation = Ndef.text.decodePayload(
          tag.ndefMessage[0].payload
        );
        console.log("Location:", stampLocation);

        setCollectedStamps((prevStamps) => {
          // Check for duplicates using the previous state
          const isDuplicate = prevStamps.some(
            (stamp) => stamp.title === stampLocation
          );

          if (isDuplicate) {
            console.log("Stamp already collected!");
            return prevStamps; // Return unchanged state if duplicate
          }

          const newStamp = {
            id: Date.now(),
            title: stampLocation,
            location: getStampTitle(stampLocation),
            date: new Date().toLocaleDateString(),
            image: getStampImage(stampLocation),
          };

          const updatedStamps = [...prevStamps, newStamp];
          console.log("Updated collection:", updatedStamps);
          return updatedStamps;
        });
      }
    } catch (ex) {
      // Silently handle the error - no need to log it
    } finally {
      setIsScanning(false);
      NfcManager.cancelTechnologyRequest();
      // Only restart scanning if we're not already scanning
      if (!isScanning) {
        setTimeout(startNfcScan, 1000);
      }
    }
  };

  // if (hasNfc === null) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.scanningText}>Checking NFC availability...</Text>
  //     </View>
  //   );
  // }

  // if (hasNfc === false) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.errorText}>
  //         NFC is not supported on this device
  //       </Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Stamply</Text>
        <Text style={styles.subtitle}>
          Collect memories, one stamp at a time
        </Text>
      </View>

      {/* Collection View */}
      <ScrollView style={styles.collectionContainer}>
        {collectedStamps.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Your travel collection is empty
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Start scanning to collect stamps!
            </Text>
          </View>
        ) : (
          collectedStamps.map((stamp) => (
            <View key={stamp.id} style={styles.stampCard}>
              <Image source={stamp.image} style={styles.stampImage} />
              <View style={styles.stampInfo}>
                <Text style={styles.stampLocation}>{stamp.location}</Text>
                <Text style={styles.stampDate}>{stamp.date}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Scanning Overlay */}
      <View style={styles.scanningOverlay}>
        <Text style={styles.nfcIcon}>📱</Text>
        <Text style={styles.scanningText}>
          Put your phone near a Stamply Tag
        </Text>
        <Text style={styles.scanningIcon}>✨</Text>
      </View>
    </View>
  );
}
