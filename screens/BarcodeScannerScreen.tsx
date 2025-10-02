import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors, shadows } from '../constants/theme';

type BarcodeScannerScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: {
    params: {
      onBarcodeScanned: (barcode: string) => void;
    };
  };
};

interface BarcodeProduct {
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  servingSizeGrams: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  image?: string;
}

export const BarcodeScannerScreen = ({ navigation, route }: BarcodeScannerScreenProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { onBarcodeScanned } = route.params;

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    setIsLoading(true);

    try {
      // Look up product information using the barcode
      const productInfo = await lookupBarcodeProduct(data);
      
      if (productInfo) {
        // Pass the product info back to the food logging screen
        onBarcodeScanned(data, productInfo);
        navigation.goBack();
      } else {
        Alert.alert(
          'Product Not Found',
          'This barcode was not found in our database. You can still add the food manually.',
          [
            { text: 'Try Again', onPress: () => setScanned(false) },
            { text: 'Cancel', onPress: () => navigation.goBack() }
          ]
        );
      }
    } catch (error) {
      console.error('Barcode lookup error:', error);
      Alert.alert(
        'Error',
        'Failed to look up product information. Please try again.',
        [
          { text: 'Try Again', onPress: () => setScanned(false) },
          { text: 'Cancel', onPress: () => navigation.goBack() }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const lookupBarcodeProduct = async (barcode: string): Promise<BarcodeProduct | null> => {
    try {
      // Use Open Food Facts API for barcode lookup
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();

      if (data.status === 1 && data.product) {
        const product = data.product;
        
        // Extract nutrition information
        const nutrition = product.nutriments || {};
        
        return {
          name: product.product_name || product.product_name_en || 'Unknown Product',
          brand: product.brands || product.brand,
          calories: Math.round(nutrition['energy-kcal_100g'] || nutrition['energy_100g'] / 4.184 || 0),
          protein: Math.round((nutrition['proteins_100g'] || 0) * 10) / 10,
          carbs: Math.round((nutrition['carbohydrates_100g'] || 0) * 10) / 10,
          fat: Math.round((nutrition['fat_100g'] || 0) * 10) / 10,
          servingSize: product.serving_size || '100g',
          servingSizeGrams: parseFloat(product.serving_size?.replace(/[^\d.]/g, '')) || 100,
          fiber: Math.round((nutrition['fiber_100g'] || 0) * 10) / 10,
          sugar: Math.round((nutrition['sugars_100g'] || 0) * 10) / 10,
          sodium: Math.round((nutrition['sodium_100g'] || 0) * 10) / 10,
          image: product.image_url || product.image_front_url,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Open Food Facts API error:', error);
      return null;
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Camera permission is required to scan barcodes.</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.ean13, BarCodeScanner.Constants.BarCodeType.ean8, BarCodeScanner.Constants.BarCodeType.upc_a, BarCodeScanner.Constants.BarCodeType.upc_e]}
      />
      
      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Barcode</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Scanning Area */}
        <View style={styles.scanningArea}>
          <View style={styles.scanningFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Position the barcode within the frame
          </Text>
          {isLoading && (
            <Text style={styles.loadingText}>
              Looking up product information...
            </Text>
          )}
        </View>

        {/* Manual Entry Option */}
        <View style={styles.manualEntryContainer}>
          <TouchableOpacity 
            style={styles.manualEntryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.manualEntryText}>Enter manually instead</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  message: {
    color: colors.text,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  closeButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  scanningArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanningFrame: {
    width: 250,
    height: 150,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.primary,
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
  instructionsContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  instructionsText: {
    color: colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  manualEntryContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  manualEntryButton: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  manualEntryText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
});

