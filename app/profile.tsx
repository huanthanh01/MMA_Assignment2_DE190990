import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import { useAppContext } from "../controllers/useAppController";
import { styles } from "../components/styles/Profile.styles";
import { useTheme } from "../constants/ThemeContext";

export default function ProfileScreen() {
  const {
    currentUser,
    updateProfile,
    isLargeScreen,
    handleLogout,
  } = useAppContext();
  const { colors, isDark } = useTheme();

  const [fullname, setFullname] = useState(currentUser?.fullname || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!fullname.trim() || !email.trim()) {
      Alert.alert("Error", "Full Name and Email are required.");
      return;
    }

    setIsLoading(true);
    const result = await updateProfile(fullname.trim(), email.trim());
    setIsLoading(false);

    if (result.success) {
      Alert.alert("Success", "Your profile has been updated successfully.");
    } else {
      Alert.alert("Error", result.error || "Failed to update profile.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} />
      <Header
        isLargeScreen={isLargeScreen}
        onLogout={handleLogout}
        currentScreen="createTask" // Reuse back button mode
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary + "20" }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Username (Disabled) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Username</Text>
              <View style={[styles.inputBox, styles.inputBoxDisabled, { backgroundColor: isDark ? "#374151" : "#f3f4f6", borderColor: colors.border }]}>
                <Ionicons name="person-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, styles.textInputDisabled]}
                  value={currentUser?.username}
                  editable={false}
                />
              </View>
            </View>

            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
              <View style={[styles.inputBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="id-card-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, { color: colors.text }]}
                  value={fullname}
                  onChangeText={setFullname}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
              <View style={[styles.inputBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, { color: colors.text }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.submitBtn}
              activeOpacity={0.9}
              onPress={handleSave}
              disabled={isLoading}
            >
              <LinearGradient
                colors={colors.gradientBtn as any}
                style={styles.btnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <View style={styles.btnContent}>
                    <Text style={styles.submitBtnText}>Save Changes</Text>
                    <Ionicons
                      name="save-outline"
                      size={18}
                      color="#fff"
                      style={{ marginLeft: 6 }}
                    />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
