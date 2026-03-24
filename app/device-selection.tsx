import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type DeviceType = 'mobile' | 'laptop' | 'tablet' | 'others';

interface DeviceCardProps {
    icon: string;
    title: string;
    description: string;
    type: DeviceType;
    onPress: (type: DeviceType) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ icon, title, description, type, onPress }) => {
    const scaleValue = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.timing(scaleValue, {
            toValue: 0.98,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 7,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const handlePress = () => {
        onPress(type);
    };

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
        >
            <Animated.View
                style={[
                    styles.card,
                    {
                        transform: [{ scale: scaleValue }],
                    },
                ]}
            >
                <BlurView intensity={25} tint="dark" style={styles.cardBlur}>
                    <LinearGradient
                        colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)']}
                        style={styles.cardGradient}
                    >
                        <View style={styles.cardContent}>
                            <View style={styles.iconContainer}>
                                <Text style={styles.icon}>{icon}</Text>
                            </View>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>{title}</Text>
                                <Text style={styles.cardDescription}>{description}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </BlurView>
            </Animated.View>
        </TouchableOpacity>
    );
};

export default function DeviceSelectionScreen() {
    const router = useRouter();

    const handleDeviceSelect = (type: DeviceType) => {
        // Navigate to device-specific form or next screen
        if (type === 'mobile') {
            router.push('/mobile-form');
        } else {
            router.push('/(tabs)');
        }
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
                    <View style={styles.stepBadge}>
                        <Text style={styles.stepText}>Step 1 of 3</Text>
                    </View>
                    <Text style={styles.title}>Select Device Type</Text>
                    <Text style={styles.subtitle}>Choose the device you want to certify</Text>
                </View>

                {/* Device cards */}
                <View style={styles.cardsContainer}>
                    <DeviceCard
                        icon="📱"
                        title="Mobile Phone"
                        description="Smartphones & Feature Phones"
                        type="mobile"
                        onPress={handleDeviceSelect}
                    />
                    <DeviceCard
                        icon="💻"
                        title="Laptop"
                        description="Notebooks & Ultrabooks"
                        type="laptop"
                        onPress={handleDeviceSelect}
                    />
                    <DeviceCard
                        icon="🖥️"
                        title="Tablet"
                        description="iPads & Android Tablets"
                        type="tablet"
                        onPress={handleDeviceSelect}
                    />
                    <DeviceCard
                        icon="📦"
                        title="Others"
                        description="Other Devices & Accessories"
                        type="others"
                        onPress={handleDeviceSelect}
                    />
                </View>
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
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    header: {
        marginBottom: 32,
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
    cardsContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: 20,
    },
    card: {
        height: 120,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
    },
    cardSelected: {
        shadowColor: '#BFAAFF',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 12,
    },
    cardBlur: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
    },
    cardGradient: {
        flex: 1,
        borderRadius: 20,
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 18,
        backgroundColor: 'rgba(191, 170, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        borderWidth: 1,
        borderColor: 'rgba(191, 170, 255, 0.2)',
    },
    iconContainerSelected: {
        backgroundColor: 'rgba(191, 170, 255, 0.25)',
        borderColor: 'rgba(191, 170, 255, 0.4)',
        shadowColor: '#BFAAFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 6,
    },
    icon: {
        fontSize: 36,
    },
    cardTextContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    cardDescription: {
        fontSize: 14,
        fontWeight: '400',
        color: 'rgba(207, 199, 232, 0.8)',
        lineHeight: 20,
    },
    selectedIndicator: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#BFAAFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    selectedCheck: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkIcon: {
        fontSize: 12,
        fontWeight: '800',
        color: '#BFAAFF',
    },
    selectedRing: {
        position: 'absolute',
        top: -3,
        left: -3,
        right: -3,
        bottom: -3,
        borderRadius: 23,
        borderWidth: 2.5,
        borderColor: '#BFAAFF',
        shadowColor: '#BFAAFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 12,
    },
});
