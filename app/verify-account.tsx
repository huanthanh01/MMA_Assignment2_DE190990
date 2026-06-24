import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppColors } from "../constants/colors";
import { verifyUserAccount } from "../utils/database";
import { styles } from "../components/styles/VerifyAccount.styles";

export default function VerifyAccountScreen() {
  const router = useRouter();

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

                <Text style={styles.title}>Verify Account</Text>
                <Text style={styles.subtitle}>
                  Enter your username and email address to verify your identity
                </Text>

                {/* General Error */}
                {errors.general && (
                  <View style={styles.generalError}>
                    <Text style={styles.generalErrorText}>
                      ⚠️ {errors.general}
                    </Text>
                  </View>
                )}

                {/* Username */}
                <View
                  style={[
                    styles.inputBox,
                    errors.username ? styles.inputError : null,
                  ]}
                >
                  <TextInput
                    style={styles.textInput}
                    placeholder="Username"
                    placeholderTextColor="#6b7280"
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text);
                      if (errors.username)
                        setErrors({ ...errors, username: "" });
                      if (errors.general)
                        setErrors({ ...errors, general: "" });
                    }}
                    autoCapitalize="none"
                  />
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#6b7280"
                    style={styles.inputIcon}
                  />
                </View>
                {errors.username && (
                  <Text style={styles.errorMsgText}>{errors.username}</Text>
                )}

                {/* Email */}
                <View
                  style={[
                    styles.inputBox,
                    errors.email ? styles.inputError : null,
                  ]}
                >
                  <TextInput
                    style={styles.textInput}
                    placeholder="Email"
                    placeholderTextColor="#6b7280"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email)
                        setErrors({ ...errors, email: "" });
                      if (errors.general)
                        setErrors({ ...errors, general: "" });
                    }}
                    autoCapitalize="none"
                  />
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#6b7280"
                    style={styles.inputIcon}
                  />
                </View>
                {errors.email && (
                  <Text style={styles.errorMsgText}>{errors.email}</Text>
                )}

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
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <View style={styles.btnContent}>
                        <Text style={styles.submitBtnText}>
                          Verify Account
                        </Text>
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={18}
                          color="#fff"
                          style={{ marginLeft: 6 }}
                        />
                      </View>
                    )}
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

                <Text style={styles.successTitle}>Account Verified!</Text>
                <Text style={styles.successSubtitle}>
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
