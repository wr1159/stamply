import { StatusBar } from "expo-status-bar";
import { Text, View, ScrollView, Image, Animated } from "react-native";
import { useState, useEffect, useRef } from "react";
import NfcManager, { NfcTech, NfcEvents, Ndef } from "react-native-nfc-manager";
import ConfettiCannon from "react-native-confetti-cannon";
import { styles } from "../styles";

export const stampImages = {
  cntower: require("../assets/stamps/cntower.png"),
  aquarium: require("../assets/stamps/aquarium.png"),
  highpark: require("../assets/stamps/highpark.png"),
  stlawrence: require("../assets/stamps/stlawrence.png"),
  casaloma: require("../assets/stamps/casaloma.png"),
  harbourfront: require("../assets/stamps/harbourfront.png"),
  // royalontario: require("../assets/stamps/royalontario.png"),
};

const API_URL = "https://stamply-theta.vercel.app/api/bahamut";
const TO_ADDRESS = "0x15d1Ab0F99e8485868Dd1AA393406b5637a66Aae";

const Home = () => {
  const [hasNfc, setHasNfc] = useState(null);
  const [collectedStamps, setCollectedStamps] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newStampId, setNewStampId] = useState(null);
  const confettiRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

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
  }, []);

  const triggerConfetti = () => {
    setShowConfetti(true);
    // Reset confetti state after animation
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  const fadeInNewStamp = (stampId) => {
    // Delay the stamp animation slightly after confetti starts
    setTimeout(() => {
      setNewStampId(stampId);
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setNewStampId(null);
      });
    }, 300); // 300ms delay after confetti starts
  };

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

          // Start confetti first
          triggerConfetti();
          // Then trigger stamp animation after a short delay
          fadeInNewStamp(newStamp.id);
          // Send the new stamp to the server
          sendStampToServer(newStamp);
          // Scroll to the new stamp
          scrollToNewStamp();

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

  const scrollToNewStamp = () => {
    if (scrollViewRef.current) {
      // Add a small delay to ensure the new stamp is rendered
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const sendStampToServer = async (stamp) => {
    console.log("Sending stamp to server:", stamp.title);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          toAddress: TO_ADDRESS,
          nfcId: stamp.title,
        }),
      });
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error("Failed to send stamp data");
      }
    } catch (error) {
      console.error("Error sending stamp data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Stamply</Text>
            <Text style={styles.subtitle}>
              Collect memories, one stamp at a time
            </Text>
          </View>
        </View>
      </View>

      {/* Collection View */}
      <View style={styles.collectionContainer}>
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
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stampsScrollView}
          >
            {collectedStamps.map((stamp) => (
              <Animated.View
                key={stamp.id}
                style={[
                  styles.stampCard,
                  stamp.id === newStampId && {
                    opacity: fadeAnim,
                    transform: [
                      {
                        scale: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Image source={stamp.image} style={styles.stampImage} />
                <View style={styles.stampInfo}>
                  <Text style={styles.stampLocation}>{stamp.location}</Text>
                  <Text style={styles.stampDate}>{stamp.date}</Text>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Scanning Overlay */}
      <View style={styles.scanningOverlay}>
        <Text style={styles.nfcIcon}>📱✨</Text>
        <Text style={styles.scanningText}>
          Put your phone near a Stamply Tag
        </Text>
        {/* <Text style={styles.scanningIcon}>✨</Text> */}
      </View>

      {/* Confetti Animation */}
      {showConfetti && (
        <ConfettiCannon
          ref={confettiRef}
          count={100}
          origin={{ x: 0, y: -10 }}
        />
      )}
    </View>
  );
};

export default Home;
