import { MadeWithDyad } from "@/components/made-with-dyad";
import { View, Text, StyleSheet } from "react-native";

const Index = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Blank App</Text>
      <Text style={styles.subtitle}>
        Start building your amazing project here!
      </Text>
      <MadeWithDyad />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default Index;