import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handleContinue = () => {
        // Validate phone number
        if (phoneNumber.length !== 10) {
            Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number');
            return;
        }

        // Navigate to OTP screen
        router.push('/otp');
    };

    const handlePressIn = () => {
        Animated.timing(scaleAnim, {
            toValue: 0.98,
            duration: 120,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 120,
            useNativeDriver: true,
        }).start();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Smooth diagonal gradient background */}
            <LinearGradient
                colors={['#6b5a8e', '#4a3a6e', '#2d2550', '#1a1f35', '#0f1a1a', '#0a1f1a']}
                style={styles.vignette}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Enter your phone number to continue</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Phone Number</Text>

                        {/* Frosted input card */}
                        <View style={styles.inputCard}>
                            <BlurView intensity={20} tint="dark" style={styles.inputBlur}>
                                <View style={styles.inputContainer}>
                                    <View style={styles.countryCodeContainer}>
                                        <Text style={styles.countryCode}>🇮🇳 +91</Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your number"
                                        placeholderTextColor="#CFC7E8"
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                    />
                                </View>
                            </BlurView>
                        </View>

                        {/* Primary CTA */}
                        <TouchableOpacity
                            activeOpacity={1}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            onPress={handleContinue}
                            disabled={phoneNumber.length !== 10}
                        >
                            <Animated.View
                                style={[
                                    styles.ctaButton,
                                    phoneNumber.length === 10 && styles.ctaButtonActive,
                                    { transform: [{ scale: scaleAnim }] },
                                ]}
                            >
                                <LinearGradient
                                    colors={phoneNumber.length === 10 ? ['#BFAAFF', '#9B7FE8'] : ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.03)']}
                                    style={styles.ctaGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text style={[styles.ctaText, phoneNumber.length !== 10 && styles.ctaTextDisabled]}>
                                        Continue
                                    </Text>
                                </LinearGradient>
                            </Animated.View>
                        </TouchableOpacity>

                        {/* Terms */}
                        <Text style={styles.termsText}>
                            By continuing, you agree to our{' '}
                            <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
                            <Text style={styles.termsLink}>Privacy Policy</Text>
                        </Text>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0820',
    },
    vignette: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '400',
        color: '#CFC7E8',
        lineHeight: 22,
    },
    formContainer: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#EDE9FF',
        marginBottom: 12,
        letterSpacing: 0.3,
    },
    inputCard: {
        marginBottom: 24,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    inputBlur: {
        overflow: 'hidden',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        height: 56,
    },
    countryCodeContainer: {
        paddingHorizontal: 16,
        borderRightWidth: 1,
        borderRightColor: 'rgba(255, 255, 255, 0.06)',
    },
    countryCode: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '400',
        color: '#FFFFFF',
        paddingHorizontal: 16,
    },
    ctaButton: {
        marginBottom: 24,
        borderRadius: 28,
        overflow: 'hidden',
    },
    ctaButtonActive: {
        shadowColor: '#BFAAFF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    ctaGradient: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
    ctaTextDisabled: {
        color: '#CFC7E8',
    },
    termsText: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '400',
        color: '#CFC7E8',
        lineHeight: 18,
    },
    termsLink: {
        color: '#BFAAFF',
        fontWeight: '600',
    },
});
