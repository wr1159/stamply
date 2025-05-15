import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { usePrivy } from "@privy-io/expo";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";

export default function CollectionScreen() {
  const { user } = usePrivy();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [collectedStamps, setCollectedStamps] = useState([]);

  useEffect(() => {
    if (params.newStamp) {
      try {
        const newStamp = JSON.parse(params.newStamp);
        setCollectedStamps((prev) => [...prev, newStamp]);
      } catch (e) {
        console.error("Error parsing new stamp:", e);
      }
    }
  }, [params.newStamp]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Collection</Text>
        <Text style={styles.subtitle}>
          {user?.wallet?.address?.slice(0, 6)}...
          {user?.wallet?.address?.slice(-4)}
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
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => router.push("/scan")}
            >
              <Text style={styles.scanButtonText}>Start Scanning</Text>
            </TouchableOpacity>
          </View>
        ) : (
          collectedStamps.map((stamp) => (
            <View key={stamp.id} style={styles.stampCard}>
              <Image source={{ uri: stamp.image }} style={styles.stampImage} />
              <View style={styles.stampInfo}>
                <Text style={styles.stampLocation}>{stamp.location}</Text>
                <Text style={styles.stampDate}>{stamp.date}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/scan")}
        >
          <Text style={styles.navButtonText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, styles.activeNavButton]}
          onPress={() => router.push("/collection")}
        >
          <Text style={styles.navButtonText}>Collection</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFB6C1",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF69B4",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#FF1493",
  },
  collectionContainer: {
    flex: 1,
    padding: 15,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 20,
    color: "#FF69B4",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: "#FFB6C1",
    marginBottom: 20,
    textAlign: "center",
  },
  stampCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#FF69B4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#FFE4E1",
  },
  stampImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  stampInfo: {
    padding: 15,
    backgroundColor: "#FFFFFF",
  },
  stampLocation: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF69B4",
    marginBottom: 5,
  },
  stampDate: {
    fontSize: 14,
    color: "#FFB6C1",
  },
  scanButton: {
    backgroundColor: "#FF69B4",
    padding: 15,
    borderRadius: 25,
    width: 200,
    alignItems: "center",
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#FFE4E1",
  },
  navButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  activeNavButton: {
    backgroundColor: "#FFF5F5",
    borderRadius: 20,
  },
  navButtonText: {
    color: "#FF69B4",
    fontSize: 16,
    fontWeight: "bold",
  },
});
