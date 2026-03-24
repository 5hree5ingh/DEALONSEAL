import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
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

export default function MobileFormScreen() {
    const router = useRouter();
    
    // Basic specs
    const [modelName, setModelName] = useState('');
    const [ram, setRam] = useState('');
    const [internalMemory, setInternalMemory] = useState('');
    const [processor, setProcessor] = useState('');
    
    // Additional details
    const [dentsScratch, setDentsScratch] = useState<'minor' | 'major' | null>(null);
    const [usedDuration, setUsedDuration] = useState('');
    const [usedUnit, setUsedUnit] = useState<DurationUnit>('year');
    const [inWarranty, setInWarranty] = useState<boolean | null>(null);
    const [warrantyLeftDuration, setWarrantyLeftDuration] = useState('');
    const [warrantyLeftUnit, setWarrantyLeftUnit] = useState<DurationUnit>('year');
    const [brokenBody, setBrokenBody] = useState<boolean | null>(null);
    const [damagedScreen, setDamagedScreen] = useState<boolean | null>(null);
    
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const isFormValid = 
        modelName.trim() && 
        ram.trim() && 
        internalMemory.trim() && 
        processor.trim() &&
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
            // Navigate to photo upload screen
            router.push('/photo-upload');
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
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={duration}
                                onChangeText={onDurationChange}
                                placeholder="0"
                                placeholderTextColor="#CFC7E8"
                                keyboardType="numeric"
                            />
                        </View>
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

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
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
                                <Text style={styles.stepText}>Step 2 of 4</Text>
                            </View>
                            <Text style={styles.title}>Mobile Phone Details</Text>
                            <Text style={styles.subtitle}>Enter your device specifications</Text>
                        </View>

                        {/* Form */}
                        <View style={styles.formContainer}>
                            {/* Model Name */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Model Name</Text>
                                <View style={styles.inputCard}>
                                    <BlurView intensity={20} tint="dark" style={styles.inputBlur}>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="e.g., iPhone 15 Pro"
                                                placeholderTextColor="#CFC7E8"
                                                value={modelName}
                                                onChangeText={setModelName}
                                            />
                                        </View>
                                    </BlurView>
                                </View>
                            </View>

                            {/* RAM */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>RAM</Text>
                                <View style={styles.inputCard}>
                                    <BlurView intensity={20} tint="dark" style={styles.inputBlur}>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="e.g., 8 GB"
                                                placeholderTextColor="#CFC7E8"
                                                value={ram}
                                                onChangeText={setRam}
                                            />
                                        </View>
                                    </BlurView>
                                </View>
                            </View>

                            {/* Internal Memory */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Internal Memory</Text>
                                <View style={styles.inputCard}>
                                    <BlurView intensity={20} tint="dark" style={styles.inputBlur}>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="e.g., 256 GB"
                                                placeholderTextColor="#CFC7E8"
                                                value={internalMemory}
                                                onChangeText={setInternalMemory}
                                            />
                                        </View>
                                    </BlurView>
                                </View>
                            </View>

                            {/* Processor */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Processor</Text>
                                <View style={styles.inputCard}>
                                    <BlurView intensity={20} tint="dark" style={styles.inputBlur}>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="e.g., A17 Pro"
                                                placeholderTextColor="#CFC7E8"
                                                value={processor}
                                                onChangeText={setProcessor}
                                            />
                                        </View>
                                    </BlurView>
                                </View>
                            </View>

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

                            {/* Continue Button */}
                            <TouchableOpacity
                                activeOpacity={1}
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                onPress={handleContinue}
                                disabled={!isFormValid}
                            >
                                <Animated.View
                                    style={[
                                        styles.ctaButton,
                                        isFormValid && styles.ctaButtonActive,
                                        { transform: [{ scale: scaleAnim }] },
                                    ]}
                                >
                                    <LinearGradient
                                        colors={
                                            isFormValid
                                                ? ['#BFAAFF', '#9B7FE8']
                                                : ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.03)']
                                        }
                                        style={styles.ctaGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    >
                                        <Text
                                            style={[
                                                styles.ctaText,
                                                !isFormValid && styles.ctaTextDisabled,
                                            ]}
                                        >
                                            Continue
                                        </Text>
                                    </LinearGradient>
                                </Animated.View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
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
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
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
    },
    inputGroup: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#EDE9FF',
        marginBottom: 12,
        letterSpacing: 0.3,
    },
    inputCard: {
        marginBottom: 0,
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
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '400',
        color: '#FFFFFF',
        paddingHorizontal: 16,
    },
    ctaButton: {
        marginTop: 32,
        marginBottom: 24,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    ctaButtonActive: {
        borderColor: 'rgba(191, 170, 255, 0.3)',
        shadowColor: '#BFAAFF',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 12,
    },
    ctaGradient: {
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    ctaTextDisabled: {
        color: 'rgba(207, 199, 232, 0.5)',
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
});

