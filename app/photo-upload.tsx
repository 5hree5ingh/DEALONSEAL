import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type PhotoType = 'front' | 'back' | 'left' | 'right';

export default function PhotoUploadScreen() {
    const router = useRouter();
    const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
    const [backPhoto, setBackPhoto] = useState<string | null>(null);
    const [leftPhoto, setLeftPhoto] = useState<string | null>(null);
    const [rightPhoto, setRightPhoto] = useState<string | null>(null);
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const pickImage = async (type: PhotoType, source: 'camera' | 'library') => {
        let result;

        if (source === 'camera') {
            // Request camera permissions
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Sorry, we need camera permissions to take photos!');
                return;
            }

            // Launch camera
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false, // Don't crop - take full photo
                quality: 0.8,
            });
        } else {
            // Request media library permissions
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload photos!');
                return;
            }

            // Launch image picker
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false, // Don't crop - take full photo
                quality: 0.8,
            });
        }

        if (!result.canceled && result.assets[0]) {
            const uri = result.assets[0].uri;
            switch (type) {
                case 'front':
                    setFrontPhoto(uri);
                    break;
                case 'back':
                    setBackPhoto(uri);
                    break;
                case 'left':
                    setLeftPhoto(uri);
                    break;
                case 'right':
                    setRightPhoto(uri);
                    break;
            }
        }
    };

    const showImagePickerOptions = (type: PhotoType) => {
        Alert.alert(
            'Select Photo',
            'Choose an option',
            [
                {
                    text: 'Camera',
                    onPress: () => pickImage(type, 'camera'),
                },
                {
                    text: 'Photo Library',
                    onPress: () => pickImage(type, 'library'),
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

    const isFormValid = frontPhoto && backPhoto && leftPhoto && rightPhoto;

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
            // Navigate to tabs
            router.push('/(tabs)');
        }
    };

    const PhotoUploadCard = ({ 
        type, 
        label, 
        photo, 
        onPress 
    }: { 
        type: PhotoType; 
        label: string; 
        photo: string | null; 
        onPress: () => void;
    }) => (
        <View style={styles.photoGroup}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={styles.photoCard}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <BlurView intensity={20} tint="dark" style={styles.photoBlur}>
                    {photo ? (
                        <View style={styles.photoContainer}>
                            <Image source={{ uri: photo }} style={styles.photo} />
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    switch (type) {
                                        case 'front':
                                            setFrontPhoto(null);
                                            break;
                                        case 'back':
                                            setBackPhoto(null);
                                            break;
                                        case 'left':
                                            setLeftPhoto(null);
                                            break;
                                        case 'right':
                                            setRightPhoto(null);
                                            break;
                                    }
                                }}
                            >
                                <Text style={styles.removeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.uploadPlaceholder}>
                            <Text style={styles.uploadIcon}>📷</Text>
                            <Text style={styles.uploadText}>Tap to Upload</Text>
                        </View>
                    )}
                </BlurView>
            </TouchableOpacity>
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
                            <Text style={styles.stepText}>Step 3 of 3</Text>
                        </View>
                        <Text style={styles.title}>Upload Photos</Text>
                        <Text style={styles.subtitle}>Take photos of your device from all angles</Text>
                    </View>

                    {/* Photo Upload Sections */}
                    <View style={styles.formContainer}>
                        <PhotoUploadCard
                            type="front"
                            label="Front Photo"
                            photo={frontPhoto}
                            onPress={() => showImagePickerOptions('front')}
                        />

                        <PhotoUploadCard
                            type="back"
                            label="Back Photo"
                            photo={backPhoto}
                            onPress={() => showImagePickerOptions('back')}
                        />

                        <PhotoUploadCard
                            type="left"
                            label="Left Side Photo"
                            photo={leftPhoto}
                            onPress={() => showImagePickerOptions('left')}
                        />

                        <PhotoUploadCard
                            type="right"
                            label="Right Side Photo"
                            photo={rightPhoto}
                            onPress={() => showImagePickerOptions('right')}
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
        flex: 1,
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
    photoGroup: {
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
    photoCard: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    photoBlur: {
        overflow: 'hidden',
    },
    photoContainer: {
        position: 'relative',
        width: '100%',
        height: 200,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
    },
    photo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Crop for display only, full image is stored
    },
    removeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 107, 107, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: '600',
        lineHeight: 24,
    },
    uploadPlaceholder: {
        width: '100%',
        height: 200,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    uploadText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#CFC7E8',
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

