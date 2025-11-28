import { ThemedText } from '@/components/themed-text';
import React, { useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  // Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Product Details
  const [productName, setProductName] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyDuration, setWarrantyDuration] = useState('');

  // Company Details
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyContact, setCompanyContact] = useState('');

  const [generatedCertificate, setGeneratedCertificate] = useState('');

  const generateCertificate = () => {
    // Validation: Check for missing fields
    const missingFields = [];
    if (!customerName) missingFields.push('Customer Name');
    if (!customerPhone) missingFields.push('Customer Phone');
    if (!productName) missingFields.push('Product Name');
    if (!modelNumber) missingFields.push('Model Number');
    if (!serialNumber) missingFields.push('Serial Number');
    if (!purchaseDate) missingFields.push('Date of Purchase');
    if (!warrantyDuration) missingFields.push('Warranty Duration');
    if (!companyName) missingFields.push('Company Name');
    if (!companyAddress) missingFields.push('Company Address');
    if (!companyContact) missingFields.push('Company Contact');

    if (missingFields.length > 0) {
      Alert.alert(
        'Missing Information',
        `Please provide the following details before generating the certificate:\n\n${missingFields.join('\n')}`
      );
      return;
    }

    // Generate Certificate Text
    const certificateText = `🏷️ PRODUCT CERTIFICATE OF AUTHENTICITY

Customer Details
Name: ${customerName}
Phone: ${customerPhone}

Product Details
Product Name: ${productName}
Model Number: ${modelNumber}
Serial Number: ${serialNumber}
Date of Purchase: ${purchaseDate}
Warranty: ${warrantyDuration}

Company Details
Company/Shop Name: ${companyName}
Address: ${companyAddress}
Contact: ${companyContact}

Certification Statement
“This is to certify that the above-mentioned product is original, unused, and verified as authentic by our company.”

Authorized Seal/Signature`;

    setGeneratedCertificate(certificateText);
  };

  const shareCertificate = async () => {
    if (!generatedCertificate) return;
    try {
      await Share.share({
        message: generatedCertificate,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share certificate');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.header}>DealSeal Generator</ThemedText>

        <View style={styles.section}>
          <ThemedText type="subtitle">Customer Information</ThemedText>
          <TextInput style={styles.input} placeholder="Customer Name" value={customerName} onChangeText={setCustomerName} placeholderTextColor="#888" />
          <TextInput style={styles.input} placeholder="Phone Number" value={customerPhone} onChangeText={setCustomerPhone} keyboardType="phone-pad" placeholderTextColor="#888" />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Product Information</ThemedText>
          <TextInput style={styles.input} placeholder="Product Name" value={productName} onChangeText={setProductName} placeholderTextColor="#888" />
          <TextInput style={styles.input} placeholder="Model Number" value={modelNumber} onChangeText={setModelNumber} placeholderTextColor="#888" />
          <TextInput style={styles.input} placeholder="Serial Number" value={serialNumber} onChangeText={setSerialNumber} placeholderTextColor="#888" />
          <TextInput style={styles.input} placeholder="Date of Purchase" value={purchaseDate} onChangeText={setPurchaseDate} placeholderTextColor="#888" />
          <TextInput style={styles.input} placeholder="Warranty Duration" value={warrantyDuration} onChangeText={setWarrantyDuration} placeholderTextColor="#888" />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Company Information</ThemedText>
          <TextInput style={styles.input} placeholder="Company Name" value={companyName} onChangeText={setCompanyName} placeholderTextColor="#888" />
          <TextInput style={styles.input} placeholder="Shop/Branch Address" value={companyAddress} onChangeText={setCompanyAddress} placeholderTextColor="#888" />
          <TextInput style={styles.input} placeholder="Contact Number" value={companyContact} onChangeText={setCompanyContact} keyboardType="phone-pad" placeholderTextColor="#888" />
        </View>

        <TouchableOpacity style={styles.button} onPress={generateCertificate}>
          <Text style={styles.buttonText}>Generate Certificate</Text>
        </TouchableOpacity>

        {generatedCertificate ? (
          <View style={styles.resultContainer}>
            <ThemedText type="subtitle">Generated Certificate</ThemedText>
            <View style={styles.certificateBox}>
              <Text style={styles.certificateText} selectable>{generatedCertificate}</Text>
            </View>
            <TouchableOpacity style={[styles.button, styles.shareButton]} onPress={shareCertificate}>
              <Text style={styles.buttonText}>Share / Copy</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  shareButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
  },
  certificateBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 10,
    marginBottom: 10,
  },
  certificateText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#333',
  },
});
