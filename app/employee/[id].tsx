import * as Crypto from "expo-crypto";
import * as Location from 'expo-location';
import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Button, Pressable, StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import employees from "../data/employee.json";

async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }
  const location = await Location.getCurrentPositionAsync({});
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}

// Helper to generate random nonce
function generateNonce(byteLength = 16) {
  const bytes = Crypto.getRandomValues(new Uint8Array(byteLength));
  // Convert bytes to base64
  const base64 = btoa(String.fromCharCode(...bytes));
  // Make it URL-safe
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Helper to generate signature
async function generateSignature(payload, secret = "shivapabbu-key") {
  const toSign = payload + secret;
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    toSign
  );
}

// Simulated server-side QR code payload
async function fetchQrPayloadFromServer(employee) {
  await new Promise(res => setTimeout(res, 700)); // simulate delay

  const timestamp = Date.now();
  const nonce = generateNonce();
  const payloadObj = {
    ...employee,
    timestamp,
    nonce,
  };
  const payloadString = JSON.stringify(payloadObj);
  const signature = await generateSignature(payloadString);

  return {
    ...payloadObj,
    signature,
  };
}

export default function EmployeeDetailScreen() {
  // Removed useCameraPermissions and isPermissonGranted from here
  // const [Permission , requesPermission] = useCameraPermissions();
  // const isPermissonGranted = Boolean(Permission?.granted);

  const { id } = useLocalSearchParams(); // URL param
  const employee = employees.find(emp => emp.id === id); // Find from JSON
  const [showQR, setShowQR] = useState(false);
  const [qrPayload, setQrPayload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expiresIn, setExpiresIn] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (showQR && expiresIn > 0) {
      timerRef.current = setInterval(() => {
        setExpiresIn(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setShowQR(false);
            setQrPayload(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showQR, expiresIn]);

  if (!employee) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Employee not found.</Text>
      </View>
    );
  }

  const handleGenerateQR = async () => {
    setShowQR(false);
    setQrPayload(null);
    setLoading(true);

    const qrObj = await fetchQrPayloadFromServer(employee);
    setQrPayload(JSON.stringify(qrObj));
    setShowQR(true);
    setExpiresIn(60);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{employee.name}</Text>
      <Text style={styles.label}>ID: <Text style={styles.value}>{employee.id}</Text></Text>
      <Text style={styles.label}>Contact: <Text style={styles.value}>{employee.contact}</Text></Text>
      <Text style={styles.label}>Email: <Text style={styles.value}>{employee.email}</Text></Text>
      <Button title="Generate QR" onPress={handleGenerateQR} />
      {loading && <ActivityIndicator size="large" color="#f4511e" style={{ marginTop: 20 }} />}
      {showQR && qrPayload && (
        <View style={styles.qrContainer}>
          <QRCode value={qrPayload} size={180} />
          <Text style={styles.qrLabel}>Employee QR Code</Text>
          <Text style={styles.expiryText}>
            Expires in: <Text style={{ fontWeight: "bold" }}>{expiresIn}</Text> sec
          </Text>
        </View>
      )}
      {!showQR && expiresIn === 0 && qrPayload && (
        <Text style={styles.expiredText}>QR Code expired. Please generate a new one.</Text>
      )}

      {/* Removed the camera permission request button from here */}
      {/* <Pressable onPress={requesPermission}>
       <Text> Request Permission</Text>
      </Pressable> */}

      {/* The Link to /verify will now always be enabled */}
      <Link href={"/verify"} asChild>
        <Pressable> {/* No more 'disabled' prop here */}
          <Text>Scan Code</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 18, marginVertical: 4 },
  value: { fontWeight: "normal" },
  notFound: { fontSize: 20, color: "red" },
  qrContainer: { marginTop: 32, alignItems: "center" },
  qrLabel: { marginTop: 10, fontSize: 16, color: "#555" },
  expiryText: { marginTop: 8, fontSize: 15, color: "#b15e00" },
  expiredText: { marginTop: 24, fontSize: 16, color: "red" },
});