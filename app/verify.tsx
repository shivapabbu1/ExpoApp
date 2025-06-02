import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Colors } from './constants/Colors';

const { width: screenWidth } = Dimensions.get('window');

export default function VerifyScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate the scan line
    const animateScanLine = () => {
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnimation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (!scanned) {
          animateScanLine();
        }
      });
    };

    if (permission?.granted && !scanned) {
      animateScanLine();
    }

    return () => {
      scanAnimation.stopAnimation();
    };
  }, [permission?.granted, scanned]);

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionIcon}>📸</Text>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionMessage}>
            We need access to your camera to scan QR codes and verify employee credentials.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.permissionButton,
              pressed && styles.permissionButtonPressed,
            ]}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Camera Access</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    scanAnimation.stopAnimation();

    try {
      const parsedData = JSON.parse(data);
      const isValidEmployee = parsedData.id && parsedData.name && parsedData.timestamp;
      
      if (isValidEmployee) {
        Alert.alert(
          '✅ Valid Employee QR Code',
          `Employee: ${parsedData.name}\nID: ${parsedData.id}\nGenerated: ${new Date(parsedData.timestamp).toLocaleString()}`,
          [
            {
              text: 'Scan Another',
              onPress: () => setScanned(false),
              style: 'default',
            },
            {
              text: 'Done',
              style: 'cancel',
            },
          ]
        );
      } else {
        Alert.alert(
          '❌ Invalid QR Code',
          'This QR code does not contain valid employee information.',
          [
            {
              text: 'Try Again',
              onPress: () => setScanned(false),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        '⚠️ Invalid QR Code Format',
        'Unable to read QR code data. Please ensure it\'s a valid employee QR code.',
        [
          {
            text: 'Scan Again',
            onPress: () => setScanned(false),
          },
        ]
      );
    }
  };

  const scanLinePosition = scanAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'pdf417'],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>QR Code Scanner</Text>
            <Text style={styles.headerSubtitle}>
              {scanned ? 'QR Code Detected!' : 'Point camera at QR code'}
            </Text>
          </View>

          <View style={styles.scanAreaContainer}>
            <View style={styles.scanFrame}>
              {/* Corner indicators */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {/* Animated scan line */}
              {!scanned && (
                <Animated.View
                  style={[
                    styles.scanLine,
                    {
                      transform: [{ translateY: scanLinePosition }],
                    },
                  ]}
                />
              )}
              
              {scanned && (
                <View style={styles.successIndicator}>
                  <Text style={styles.successIcon}>✅</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.instructionText}>
              {scanned 
                ? 'QR code scanned successfully!' 
                : 'Align QR code within the frame'
              }
            </Text>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.controlButton,
              pressed && styles.controlButtonPressed,
            ]}
            onPress={toggleCameraFacing}
          >
            <Text style={styles.controlButtonIcon}>🔄</Text>
            <Text style={styles.controlButtonText}>Flip</Text>
          </Pressable>
          
          {scanned && (
            <Pressable
              style={({ pressed }) => [
                styles.controlButton,
                styles.scanAgainButton,
                pressed && styles.controlButtonPressed,
              ]}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.controlButtonIcon}>📸</Text>
              <Text style={styles.controlButtonText}>Scan Again</Text>
            </Pressable>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  permissionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  permissionIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  permissionButton: {
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
  permissionButtonPressed: {
    backgroundColor: Colors.primaryDark,
    transform: [{ scale: 0.98 }],
  },
  permissionButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  scanAreaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: Colors.secondary,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  successIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 48,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 12,
    borderRadius: 8,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 80,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  controlButtonPressed: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    transform: [{ scale: 0.95 }],
  },
  scanAgainButton: {
    backgroundColor: 'rgba(34, 197, 94, 0.8)',
    borderColor: Colors.secondary,
  },
  controlButtonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  controlButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
});
