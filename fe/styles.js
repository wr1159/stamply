import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3EB", // Washi paper color
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8D5C4", // Traditional Japanese color
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2C1810", // Deep brown
    marginBottom: 8,
    fontFamily: "System",
  },
  subtitle: {
    fontSize: 16,
    color: "#8B4513", // Saddle brown
    fontFamily: "System",
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F7F3EB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8D5C4",
  },
  settingsIcon: {
    fontSize: 24,
  },
  collectionContainer: {
    flex: 1,
    paddingTop: 24,
  },
  stampsScrollView: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  stampCard: {
    width: width * 0.85,
    marginRight: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 0,
    shadowColor: "#2C1810",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#E8D5C4",
    height: 400,
  },
  stampImage: {
    width: "100%",
    height: 350,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  stampInfo: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  stampLocation: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2C1810",
    marginBottom: 8,
    fontFamily: "System",
    letterSpacing: 0.5,
  },
  stampDate: {
    fontSize: 14,
    color: "#8B4513",
    fontFamily: "System",
    letterSpacing: 0.5,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2C1810",
    marginBottom: 12,
    textAlign: "center",
    fontFamily: "System",
    letterSpacing: 0.5,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: "#8B4513",
    textAlign: "center",
    fontFamily: "System",
    letterSpacing: 0.5,
  },
  scanningOverlay: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#2C1810",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderTopWidth: 1,
    borderColor: "#E8D5C4",
  },
  nfcIcon: {
    fontSize: 36,
    textAlign: "center",
    marginBottom: 16,
  },
  scanningText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C1810",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "System",
    letterSpacing: 0.5,
  },
  scanningIcon: {
    fontSize: 28,
    textAlign: "center",
    color: "#8B4513",
  },
  successMessage: {
    fontSize: 16,
    color: "##2986cc",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "System",
  },
});
