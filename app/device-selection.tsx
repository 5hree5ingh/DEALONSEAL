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

type DeviceType = 'mobile' | 'laptop' | 'tablet';

interface DeviceCardProps {
    icon: string;
    title: string;
    description: string;
    type: DeviceType;
    onPress: (type: DeviceType) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ icon, title, description, type, onPress }) => {
    const scaleValue = React.useRef(new Animated.Value(1)).current;
    const [selected, setSelected] = React.useState(false);

    const handlePressIn = () => {
        Animated.timing(scaleValue, {
            toValue: 1.03,
            duration: 180,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const handlePress = () => {
        setSelected(true);
        setTimeout(() => {
            onPress(type);
        }, 300);
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
                    selected && styles.cardSelected,
                    {
                        transform: [{ scale: scaleValue }],
                    },
                ]}
            >
                <BlurView intensity={20} tint="dark" style={styles.cardBlur}>
                    <View style={styles.cardContent}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>{icon}</Text>
                        </View>
                        <View style={styles.cardTextContainer}>
                            <Text style={styles.cardTitle}>{title}</Text>
                            <Text style={styles.cardDescription}>{description}</Text>
                        </View>
                        {selected && (
                            <View style={styles.selectedDot}>
                                <View style={styles.selectedDotInner} />
                            </View>
                        )}
                    </View>
                </BlurView>
                {selected && <View style={styles.selectedRing} />}
            </Animated.View>
        </TouchableOpacity>
    );
};

export default function DeviceSelectionScreen() {
    const router = useRouter();

    const handleDeviceSelect = (type: DeviceType) => {
        // Navigate to certificate generator or next screen
        router.replace('/(tabs)');
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
        gap: 16,
    },
    card: {
        height: 110,
        borderRadius: 18,
        overflow: 'hidden',
        position: 'relative',
    },
    cardSelected: {
        shadowColor: '#BFAAFF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    cardBlur: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 18,
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(237, 233, 255, 0.06)',
        paddingHorizontal: 20,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: 'rgba(191, 170, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    icon: {
        fontSize: 32,
    },
    cardTextContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 13,
        fontWeight: '400',
        color: '#CFC7E8',
    },
    selectedDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#7EE07A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedDotInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },
    selectedRing: {
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#BFAAFF',
    },
});
