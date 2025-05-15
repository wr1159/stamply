import { View, Text, StyleSheet } from "react-native";
import { usePrivy } from "@privy-io/expo";

export default function LoginScreen() {
  const { login, ready, authenticated } = usePrivy();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Stamply</Text>
      <Text style={styles.subtitle}>Collect memories, one stamp at a time</Text>

      {!authenticated && (
        <View style={styles.buttonContainer}>
          <Text style={styles.button} onPress={login}>
            Connect Wallet
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF69B4",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#FFB6C1",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
  },
  button: {
    backgroundColor: "#FF69B4",
    color: "#FFFFFF",
    padding: 15,
    borderRadius: 25,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    overflow: "hidden",
  },
});
