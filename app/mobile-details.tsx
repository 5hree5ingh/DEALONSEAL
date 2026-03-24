import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type DurationUnit = 'year' | 'month';

export default function MobileDetailsScreen() {
    const router = useRouter();
    
    console.log('MobileDetailsScreen loaded');
    
    // Dents and scratch
    const [dentsScratch, setDentsScratch] = useState<'minor' | 'major' | null>(null);
    
    // How much used
    const [usedDuration, setUsedDuration] = useState('');
    const [usedUnit, setUsedUnit] = useState<DurationUnit>('year');
    
    // In Warranty
    const [inWarranty, setInWarranty] = useState<boolean | null>(null);
    const [warrantyLeftDuration, setWarrantyLeftDuration] = useState('');
    const [warrantyLeftUnit, setWarrantyLeftUnit] = useState<DurationUnit>('year');
    
    // Broken body
    const [brokenBody, setBrokenBody] = useState<boolean | null>(null);
    
    // Damaged screen
    const [damagedScreen, setDamagedScreen] = useState<boolean | null>(null);
    
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const isFormValid = 
        dentsScratch !== null &&
        usedDuration.trim() !== '' &&
        inWarranty !== null &&
        (inWarranty === false || warrantyLeftDuration.trim() !== '') &&
        brokenBody !== null &&
        damagedScreen !== null;

    const handlePressIn = () => {
        Animated.timing(scaleAnim, {
            toValue: 0.98,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 7,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const handleContinue = () => {
        if (isFormValid) {
            // Navigate to next screen
            router.push('/(tabs)');
        }
    };

    // Duration Input Component
    const DurationInput = ({
        label,
        duration,
        unit,
        onDurationChange,
        onUnitChange,
    }: {
        label: string;
        duration: string;
        unit: DurationUnit;
        onDurationChange: (value: string) => void;
        onUnitChange: (unit: DurationUnit) => void;
    }) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.durationContainer}>
                <View style={styles.durationInputWrapper}>
                    <BlurView intensity={20} tint="dark" style={styles.inputBlur}>
                        <TextInput
                            style={styles.durationInput}
                            value={duration}
                            onChangeText={onDurationChange}
                            placeholder="0"
                            placeholderTextColor="rgba(255, 255, 255, 0.3)"
                            keyboardType="numeric"
                        />
                    </BlurView>
                </View>
                <View style={styles.unitSelector}>
                    <TouchableOpacity
                        style={[
                            styles.unitButton,
                            unit === 'year' && styles.unitButtonActive,
                        ]}
                        onPress={() => onUnitChange('year')}
                    >
                        <Text style={[
                            styles.unitButtonText,
                            unit === 'year' && styles.unitButtonTextActive,
                        ]}>
                            Year
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.unitButton,
                            unit === 'month' && styles.unitButtonActive,
                        ]}
                        onPress={() => onUnitChange('month')}
                    >
                        <Text style={[
                            styles.unitButtonText,
                            unit === 'month' && styles.unitButtonTextActive,
                        ]}>
                            Month
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    // Yes/No Toggle Component
    const YesNoToggle = ({
        label,
        value,
        onChange,
    }: {
        label: string;
        value: boolean | null;
        onChange: (value: boolean) => void;
    }) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[
                        styles.toggleButton,
                        value === true && styles.toggleButtonActive,
                    ]}
                    onPress={() => onChange(true)}
                >
                    <Text style={[
                        styles.toggleButtonText,
                        value === true && styles.toggleButtonTextActive,
                    ]}>
                        Yes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.toggleButton,
                        value === false && styles.toggleButtonActive,
                    ]}
                    onPress={() => onChange(false)}
                >
                    <Text style={[
                        styles.toggleButtonText,
                        value === false && styles.toggleButtonTextActive,
                    ]}>
                        No
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // Minor/Major Selector Component
    const MinorMajorSelector = ({
        label,
        value,
        onChange,
    }: {
        label: string;
        value: 'minor' | 'major' | null;
        onChange: (value: 'minor' | 'major') => void;
    }) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[
                        styles.toggleButton,
                        value === 'minor' && styles.toggleButtonActive,
                    ]}
                    onPress={() => onChange('minor')}
                >
                    <Text style={[
                        styles.toggleButtonText,
                        value === 'minor' && styles.toggleButtonTextActive,
                    ]}>
                        Minor
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.toggleButton,
                        value === 'major' && styles.toggleButtonActive,
                    ]}
                    onPress={() => onChange('major')}
                >
                    <Text style={[
                        styles.toggleButtonText,
                        value === 'major' && styles.toggleButtonTextActive,
                    ]}>
                        Major
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Smooth diagonal gradient background */}
            <LinearGradient
                colors={['#6b5a8e', '#4a3a6e', '#2d2550', '#1a1f35', '#0f1a1a', '#0a1f1a']}
                style={styles.vignette}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <Text style={styles.backIcon}>←</Text>
                        </TouchableOpacity>
                        <View style={styles.stepBadge}>
                            <Text style={styles.stepText}>Step 4 of 4</Text>
                        </View>
                        <Text style={styles.title}>Additional Details</Text>
                        <Text style={styles.subtitle}>Tell us more about your device condition</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formContainer}>
                        {/* Dents and Scratch */}
                        <MinorMajorSelector
                            label="Dents and Scratch"
                            value={dentsScratch}
                            onChange={setDentsScratch}
                        />

                        {/* How much used */}
                        <DurationInput
                            label="How much used?"
                            duration={usedDuration}
                            unit={usedUnit}
                            onDurationChange={setUsedDuration}
                            onUnitChange={setUsedUnit}
                        />

                        {/* In Warranty */}
                        <YesNoToggle
                            label="In Warranty?"
                            value={inWarranty}
                            onChange={setInWarranty}
                        />

                        {/* Warranty Left (conditional) */}
                        {inWarranty === true && (
                            <DurationInput
                                label="How much left?"
                                duration={warrantyLeftDuration}
                                unit={warrantyLeftUnit}
                                onDurationChange={setWarrantyLeftDuration}
                                onUnitChange={setWarrantyLeftUnit}
                            />
                        )}

                        {/* Broken Body */}
                        <YesNoToggle
                            label="Broken Body?"
                            value={brokenBody}
                            onChange={setBrokenBody}
                        />

                        {/* Damaged Screen */}
                        <YesNoToggle
                            label="Damaged Screen / Discoloration?"
                            value={damagedScreen}
                            onChange={setDamagedScreen}
                        />
                    </View>

                    {/* Continue Button */}
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <TouchableOpacity
                            style={[
                                styles.ctaButton,
                                !isFormValid && styles.ctaButtonDisabled,
                            ]}
                            onPress={handleContinue}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            disabled={!isFormValid}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={
                                    isFormValid
                                        ? ['#BFAAFF', '#9B7FFF']
                                        : ['#4A4A4A', '#3A3A3A']
                                }
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.ctaGradient}
                            >
                                <Text style={styles.ctaText}>Continue</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </ScrollView>
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
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 24,
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    header: {
        marginBottom: 32,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    backIcon: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 24,
        ...(Platform.OS === 'android' && {
            textAlignVertical: 'center',
            includeFontPadding: false,
        }),
    },
    stepBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(126, 224, 122, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
        marginBottom: 16,
    },
    stepText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#7EE07A',
        letterSpacing: 0.5,
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
        marginBottom: 32,
    },
    inputGroup: {
        width: '100%',
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#EDE9FF',
        marginBottom: 12,
        letterSpacing: 0.3,
    },
    durationContainer: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    durationInputWrapper: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    inputBlur: {
        overflow: 'hidden',
    },
    durationInput: {
        height: 56,
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: '400',
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        ...(Platform.OS === 'android' && {
            includeFontPadding: false,
            textAlignVertical: 'center',
        }),
    },
    unitSelector: {
        flexDirection: 'row',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    unitButton: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    unitButtonActive: {
        backgroundColor: 'rgba(191, 170, 255, 0.2)',
    },
    unitButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.5)',
    },
    unitButtonTextActive: {
        color: '#BFAAFF',
    },
    toggleContainer: {
        flexDirection: 'row',
        gap: 12,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleButtonActive: {
        backgroundColor: 'rgba(191, 170, 255, 0.2)',
    },
    toggleButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.5)',
    },
    toggleButtonTextActive: {
        color: '#BFAAFF',
    },
    ctaButton: {
        marginTop: 32,
        marginBottom: 24,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#BFAAFF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    ctaButtonDisabled: {
        opacity: 0.5,
    },
    ctaGradient: {
        paddingVertical: 18,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
});

