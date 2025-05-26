import * as Crypto from "expo-crypto";
import React, { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const SECRET = "your-secret-key"; // 🔐 Use the same key used to generate the QR signature

export default function QRManualVerifier() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [debug, setDebug] = useState({});

  const handleVerify = async () => {
    try {
      const data = JSON.parse(input);
      const { signature, ...originalPayload } = data;
      const payloadString = JSON.stringify(originalPayload);

      const expectedSignature = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        payloadString + SECRET
      );

      setDebug({ originalPayload, payloadString, expectedSignature, scannedSignature: signature });

      if (expectedSignature === signature) {
        setResult("✅ Signature is valid!");
      } else {
        setResult("❌ Signature is invalid!");
      }
    } catch (error) {
      setResult("❌ Invalid JSON or payload format.");
      setDebug({});
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Manual QR Signature Verifier</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Paste QR code payload (JSON)"
        value={input}
        onChangeText={setInput}
      />
      <Button title="Verify Signature" onPress={handleVerify} />
      <Text style={styles.result}>{result}</Text>

      {debug.originalPayload && (
        <View style={styles.debugBox}>
          <Text style={styles.debugTitle}>Debug Info:</Text>
          <Text>🔸 Payload: {debug.payloadString}</Text>
          <Text>🔸 Expected Signature: {debug.expectedSignature}</Text>
          <Text>🔸 Scanned Signature: {debug.scannedSignature}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    height: 180,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  result: { marginTop: 16, fontSize: 18, fontWeight: "bold", textAlign: "center" },
  debugBox: {
    backgroundColor: "#f3f3f3",
    padding: 10,
    marginTop: 20,
    borderRadius: 6,
  },
  debugTitle: { fontWeight: "bold", marginBottom: 4 },
});
