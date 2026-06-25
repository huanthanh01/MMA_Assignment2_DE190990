import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput, Button, HelperText, Text, useTheme as usePaperTheme } from "react-native-paper";
import { AppColors } from "../constants/colors";
import { verifyUserAccount } from "../utils/database";
import { styles } from "../components/styles/VerifyAccount.styles";

export default function VerifyAccountScreen() {
  const router = useRouter();
  const theme = usePaperTheme();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifiedUserId, setVerifiedUserId] = useState<number | null>(null);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    general?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = async () => {
    if (validate()) {
      setIsLoading(true);
      setErrors({});

      await new Promise((resolve) => setTimeout(resolve, 50));

      try {
        const result = await verifyUserAccount(
          username.trim(),
          email.trim().toLowerCase()
        );

        if (result.success && result.userId) {
          setVerifiedUserId(result.userId);
          setVerified(true);
        } else {
          setErrors({
            general: result.error || "Verification failed",
          });
        }
      } catch (error) {
        setErrors({ general: "An unexpected error occurred" });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoToResetPassword = () => {
    if (verifiedUserId) {
      router.push({
        pathname: "/reset-password",
        params: { userId: verifiedUserId.toString() },
      } as any);
    }
  };

  return (
    <LinearGradient
      colors={AppColors.gradientLogin as any}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={[styles.bgShape, styles.bgShape1]} />
      <View style={[styles.bgShape, styles.bgShape2]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color="#9ca3af" />
              <Text style={styles.backText}>Back to Login</Text>
            </TouchableOpacity>

            {!verified ? (
              <>
                {/* Icon */}
                <LinearGradient
                  colors={AppColors.gradientBtn as any}
                  style={styles.iconContainer}
                >
                  <Ionicons name="shield-checkmark-outline" size={32} color="#fff" />
                </LinearGradient>

                <Text variant="headlineSmall" style={styles.title}>Verify Account</Text>
                <Text variant="bodyMedium" style={styles.subtitle}>
                  Enter your username and email address to verify your identity
                </Text>

                {/* General Error */}
                {errors.general && (
                  <View style={{
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: "rgba(239, 68, 68, 0.3)",
                  }}>
                    <Text style={{ color: "#ef4444", fontSize: 13, fontWeight: "600", textAlign: "center" }}>
                      ⚠️ {errors.general}
                    </Text>
                  </View>
                )}

                {/* Username */}
                <TextInput
                  mode="outlined"
                  label="Username"
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (errors.username) setErrors({ ...errors, username: "" });
                    if (errors.general) setErrors({ ...errors, general: "" });
                  }}
                  autoCapitalize="none"
                  error={!!errors.username}
                  left={<TextInput.Icon icon="account-outline" />}
                  style={{ marginBottom: errors.username ? 0 : 12 }}
                />
                {errors.username && <HelperText type="error" visible={!!errors.username}>{errors.username}</HelperText>}

                {/* Email */}
                <TextInput
                  mode="outlined"
                  label="Email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: "" });
                    if (errors.general) setErrors({ ...errors, general: "" });
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  error={!!errors.email}
                  left={<TextInput.Icon icon="email-outline" />}
                  style={{ marginBottom: errors.email ? 0 : 12 }}
                />
                {errors.email && <HelperText type="error" visible={!!errors.email}>{errors.email}</HelperText>}

                {/* Verify Button */}
                <TouchableOpacity
                  style={styles.submitBtn}
                  activeOpacity={0.9}
                  onPress={handleVerify}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={AppColors.gradientBtn as any}
                    style={styles.btnGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Button 
                      mode="text" 
                      onPress={handleVerify} 
                      loading={isLoading} 
                      disabled={isLoading}
                      labelStyle={{ color: '#fff', fontSize: 15, fontWeight: '600' }}
                      icon={() => <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />}
                      style={{ width: '100%', height: '100%', justifyContent: 'center' }}
                    >
                      Verify Account
                    </Button>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              /* Verification Success */
              <View style={styles.successContainer}>
                <View style={styles.successIconContainer}>
                  <Ionicons
                    name="checkmark-circle"
                    size={40}
                    color="#34c759"
                  />
                </View>

                <Text variant="headlineSmall" style={styles.successTitle}>Account Verified!</Text>
                <Text variant="bodyMedium" style={styles.successSubtitle}>
                  Your identity has been confirmed successfully.{"\n"}
                  Click the link below to reset your password.
                </Text>

                {/* Reset Password Link */}
                <TouchableOpacity
                  style={styles.resetLinkBtn}
                  activeOpacity={0.9}
                  onPress={handleGoToResetPassword}
                >
                  <LinearGradient
                    colors={AppColors.gradientBtn as any}
                    style={styles.resetLinkGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="key-outline" size={18} color="#fff" />
                    <Text style={styles.resetLinkText}>
                      Reset Password
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color="#fff"
                    />
                  </LinearGradient>
                </TouchableOpacity>

                {/* Back to Login */}
                <TouchableOpacity
                  style={styles.backToLoginBtn}
                  activeOpacity={0.7}
                  onPress={() => router.replace("/")}
                >
                  <Text style={styles.backToLoginText}>
                    Remember your password?{" "}
                    <Text style={styles.backToLoginLink}>Login</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
