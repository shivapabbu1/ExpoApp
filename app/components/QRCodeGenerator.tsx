import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '../constants/Colors';
import { fetchQrPayloadFromServer } from '../utils/qrUtils';
import LoadingSpinner from './LoadingSpinner';

interface QRCodeGeneratorProps {
  employee: any;
}

export default function QRCodeGenerator({ employee }: QRCodeGeneratorProps) {
  const [showQR, setShowQR] = useState(false);
  const [qrPayload, setQrPayload] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expiresIn, setExpiresIn] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (showQR && expiresIn > 0) {
      // Animate QR code appearance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      timerRef.current = setInterval(() => {
        setExpiresIn(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setShowQR(false);
            setQrPayload(null);
            // Animate QR code disappearance
            Animated.parallel([
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 200,
                useNativeDriver: true,
              }),
            ]).start();
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

  const handleGenerateQR = async () => {
    setShowQR(false);
    setQrPayload(null);
    setLoading(true);

    try {
      const qrObj = await fetchQrPayloadFromServer(employee);
      setQrPayload(JSON.stringify(qrObj));
      setShowQR(true);
      setExpiresIn(60);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  const getExpiryColor = () => {
    if (expiresIn > 30) return Colors.success;
    if (expiresIn > 10) return Colors.warning;
    return Colors.danger;
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.generateButton,
          pressed && styles.generateButtonPressed,
          loading && styles.generateButtonDisabled,
        ]}
        onPress={handleGenerateQR}
        disabled={loading}
      >
        <Text style={styles.generateButtonText}>
          {loading ? 'Generating...' : 'Generate QR Code'}
        </Text>
      </Pressable>

      {loading && <LoadingSpinner message="Generating secure QR code..." />}

      {showQR && qrPayload && (
        <Animated.View
          style={[
            styles.qrContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.qrWrapper}>
            <QRCode value={qrPayload} size={200} />
          </View>
          <Text style={styles.qrLabel}>Employee Authentication QR</Text>
          <View style={styles.expiryContainer}>
            <Text style={styles.expiryLabel}>Expires in:</Text>
            <Text style={[styles.expiryTime, { color: getExpiryColor() }]}>
              {Math.floor(expiresIn / 60)}:{(expiresIn % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        </Animated.View>
      )}

      {!showQR && expiresIn === 0 && qrPayload && (
        <View style={styles.expiredContainer}>
          <Text style={styles.expiredText}>QR Code has expired</Text>
          <Text style={styles.expiredSubtext}>Generate a new one for security</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  generateButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  generateButtonPressed: {
    backgroundColor: Colors.primaryDark,
    transform: [{ scale: 0.98 }],
  },
  generateButtonDisabled: {
    backgroundColor: Colors.textLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  generateButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  qrContainer: {
    marginTop: 24,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  qrLabel: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 8,
  },
  expiryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  expiryTime: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  expiredContainer: {
    marginTop: 24,
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  expiredText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.danger,
  },
  expiredSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
