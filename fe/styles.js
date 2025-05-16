import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5", // Soft pink background
  },
  header: {
    padding: 20,
    backgroundColor: "#FFB6C1", // Light pink header
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF69B4", // Hot pink
    marginBottom: 5,
    fontFamily: "System",
  },
  subtitle: {
    fontSize: 16,
    color: "#FF1493", // Deep pink
    fontStyle: "italic",
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
    fontFamily: "System",
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: "#FFB6C1",
    textAlign: "center",
    fontStyle: "italic",
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
    height: 350,
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
    fontFamily: "System",
  },
  stampDate: {
    fontSize: 14,
    color: "#FFB6C1",
    fontStyle: "italic",
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
    fontFamily: "System",
  },
  scanningIcon: {
    fontSize: 24,
    color: "#FFB6C1",
    marginBottom: 5,
  },
  errorText: {
    color: "#FF69B4",
    fontSize: 16,
    textAlign: "center",
    padding: 20,
    fontFamily: "System",
  },
  nfcIcon: {
    fontSize: 40,
    color: "#FF69B4",
    marginBottom: 10,
  },
  scanningStatus: {
    fontSize: 14,
    color: "#FFB6C1",
    fontStyle: "italic",
    marginTop: 5,
  },
});
