import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import ConfettiCannon from "react-native-confetti-cannon";
import { useRouter } from "expo-router";

export default function ScanScreen() {
  const router = useRouter();
  const [hasNfc, setHasNfc] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confettiRef, setConfettiRef] = useState(null);

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

    return () => {
      NfcManager.cancelTechnologyRequest();
    };
  }, []);

  const startNfcScan = async () => {
    if (isScanning) return;

    try {
      setIsScanning(true);
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      if (tag) {
        // Add new stamp to collection
        const newStamp = {
          id: Date.now(),
          location: tag.ndefMessage?.[0]?.payload
            ? String.fromCharCode.apply(
                null,
                tag.ndefMessage[0].payload.slice(3)
              )
            : "Unknown Location",
          date: new Date().toLocaleDateString(),
          image: "https://picsum.photos/200/200",
        };

        // Show success modal
        setShowSuccess(true);
        if (confettiRef) {
          confettiRef.start();
        }

        // Navigate to collection after delay
        setTimeout(() => {
          setShowSuccess(false);
          router.push({
            pathname: "/collection",
            params: { newStamp: JSON.stringify(newStamp) },
          });
        }, 2000);
      }
    } catch (ex) {
      // Silently handle the error
    } finally {
      setIsScanning(false);
      NfcManager.cancelTechnologyRequest();
      if (!isScanning) {
        setTimeout(startNfcScan, 1000);
      }
    }
  };

  if (hasNfc === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.scanningText}>Checking NFC availability...</Text>
      </View>
    );
  }

  if (hasNfc === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          NFC is not supported on this device
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Scanning Overlay */}
      <View style={styles.scanningOverlay}>
        <Text style={styles.nfcIcon}>📱</Text>
        <Text style={styles.scanningText}>
          Put your phone near a Stamply Tag
        </Text>
        <Text style={styles.scanningIcon}>✨</Text>
      </View>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.successText}>Success!</Text>
            <Text style={styles.successSubtext}>New stamp collected!</Text>
          </View>
          <ConfettiCannon
            ref={(ref) => setConfettiRef(ref)}
            count={200}
            origin={{ x: -10, y: 0 }}
            autoStart={false}
            fadeOut={true}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  scanningOverlay: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#FF69B4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#FFE4E1",
  },
  scanningText: {
    fontSize: 18,
    color: "#FF69B4",
    textAlign: "center",
    marginBottom: 10,
  },
  scanningIcon: {
    fontSize: 24,
    color: "#FFB6C1",
    marginBottom: 5,
  },
  nfcIcon: {
    fontSize: 40,
    color: "#FF69B4",
    marginBottom: 10,
  },
  errorText: {
    color: "#FF69B4",
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#FF69B4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  successText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF69B4",
    marginBottom: 10,
  },
  successSubtext: {
    fontSize: 18,
    color: "#FFB6C1",
  },
});
