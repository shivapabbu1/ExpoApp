import * as Crypto from "expo-crypto";
import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
}

export async function getCurrentLocation(): Promise<LocationData> {
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

export function generateNonce(byteLength = 16): string {
  const bytes = Crypto.getRandomValues(new Uint8Array(byteLength));
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function generateSignature(payload: string, secret = "shivapabbu-key"): Promise<string> {
  const toSign = payload + secret;
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    toSign
  );
}

export async function fetchQrPayloadFromServer(employee: any) {
  await new Promise(res => setTimeout(res, 700));

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