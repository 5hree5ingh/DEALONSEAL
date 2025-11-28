import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function OTPScreen() {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState(false);
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Focus first input on mount
        inputRefs.current[0]?.focus();

        // Start countdown timer
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const shakeAnimation = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start();
    };

    const handleOtpChange = (value: string, index: number) => {
        if (value.length > 1) return;

        setError(false);
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError(true);
            shakeAnimation();
            Alert.alert('Invalid OTP', 'Please enter the complete 6-digit OTP');
            return;
        }

        // Simulate OTP verification (OTP = 999999)
        if (otpString === '999999') {
            router.replace('/device-selection');
        } else {
            setError(true);
            shakeAnimation();
            Alert.alert('Invalid OTP', 'Please enter the correct OTP (999999)');
        }
    };

    const handleResend = () => {
        if (!canResend) return;

        setTimer(30);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        setError(false);
        inputRefs.current[0]?.focus();

        // Restart timer
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        Alert.alert('OTP Sent', 'A new OTP has been sent to your phone');
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

            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Enter OTP</Text>
                    <Text style={styles.subtitle}>
                        We've sent a 6-digit code to your phone number
                    </Text>
                </View>

                {/* OTP Input boxes */}
                <Animated.View
                    style={[
                        styles.otpContainer,
                        { transform: [{ translateX: shakeAnim }] },
                    ]}
                >
                    {otp.map((digit, index) => (
                        <View key={index} style={styles.otpInputWrapper}>
                            <BlurView intensity={20} tint="dark" style={styles.otpBlur}>
                                <TextInput
                                    ref={(ref) => {
                                        inputRefs.current[index] = ref;
                                    }}
                                    style={[
                                        styles.otpInput,
                                        digit && styles.otpInputFilled,
                                        error && styles.otpInputError,
                                    ]}
                                    value={digit}
                                    onChangeText={(value) => handleOtpChange(value, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    selectTextOnFocus
                                />
                            </BlurView>
                        </View>
                    ))}
                </Animated.View>

                {/* Primary CTA */}
                <TouchableOpacity
                    activeOpacity={1}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={handleVerify}
                    disabled={otp.join('').length !== 6}
                >
                    <Animated.View
                        style={[
                            styles.ctaButton,
                            otp.join('').length === 6 && styles.ctaButtonActive,
                            { transform: [{ scale: scaleAnim }] },
                        ]}
                    >
                        <LinearGradient
                            colors={otp.join('').length === 6 ? ['#BFAAFF', '#9B7FE8'] : ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.03)']}
                            style={styles.ctaGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={[styles.ctaText, otp.join('').length !== 6 && styles.ctaTextDisabled]}>
                                Verify OTP
                            </Text>
                        </LinearGradient>
                    </Animated.View>
                </TouchableOpacity>

                {/* Resend */}
                <TouchableOpacity
                    style={styles.resendContainer}
                    onPress={handleResend}
                    disabled={!canResend}
                >
                    <Text style={[styles.resendText, !canResend && styles.resendTextDisabled]}>
                        {canResend ? 'Resend OTP' : `Resend in ${timer}s`}
                    </Text>
                </TouchableOpacity>
            </View>
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
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    otpInputWrapper: {
        position: 'relative',
    },
    otpBlur: {
        width: (width - 80) / 6,
        height: 56,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    otpInput: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        color: '#FFFFFF',
    },
    otpInputFilled: {
        borderColor: '#BFAAFF',
        borderWidth: 2,
    },
    otpInputError: {
        borderColor: '#FF6B6B',
        borderWidth: 2,
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
    resendContainer: {
        alignItems: 'center',
        padding: 12,
    },
    resendText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#BFAAFF',
    },
    resendTextDisabled: {
        color: '#CFC7E8',
    },
});
