import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { resetUserPassword } from "../utils/database";
import { styles } from "../components/styles/ResetPassword.styles";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  // Password requirement checks
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const allRequirementsMet = hasMinLength && hasUppercase && hasNumber;

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (!allRequirementsMet) {
      newErrors.newPassword = "Password does not meet all requirements";
    }
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!userId) {
      setErrors({ general: "Invalid session. Please verify your account again." });
      return;
    }

    if (validate()) {
      setIsLoading(true);
      setErrors({});

      await new Promise((resolve) => setTimeout(resolve, 50));

      try {
        const result = await resetUserPassword(
          parseInt(userId, 10),
          newPassword
        );

        if (result.success) {
          setSuccess(true);
        } else {
          setErrors({
            general: result.error || "Failed to reset password",
          });
        }
      } catch (error) {
        setErrors({ general: "An unexpected error occurred" });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const RequirementItem = ({
    met,
    label,
  }: {
    met: boolean;
    label: string;
  }) => (
    <View style={styles.requirementRow}>
      <Ionicons
        name={met ? "checkmark-circle" : "ellipse-outline"}
        size={16}
        color={met ? "#34c759" : "#6b7280"}
      />
      <Text
        style={[
          styles.requirementText,
          met ? styles.requirementMet : styles.requirementNotMet,
        ]}
      >
        {label}
      </Text>
    </View>
  );

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
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            {!success ? (
              <>
                {/* Icon */}
                <LinearGradient
                  colors={AppColors.gradientBtn as any}
                  style={styles.iconContainer}
                >
                  <Ionicons name="key-outline" size={32} color="#fff" />
                </LinearGradient>

                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>
                  Create a new strong password for your account
                </Text>

                {/* General Error */}
                {errors.general && (
                  <View style={styles.generalError}>
                    <Text style={styles.generalErrorText}>
                      ⚠️ {errors.general}
                    </Text>
                  </View>
                )}

                {/* New Password */}
                <View
                  style={[
                    styles.inputBox,
                    errors.newPassword ? styles.inputError : null,
                  ]}
                >
                  <TextInput
                    style={styles.textInput}
                    placeholder="New Password"
                    placeholderTextColor="#6b7280"
                    secureTextEntry={!showPassword}
                    value={newPassword}
                    onChangeText={(text) => {
                      setNewPassword(text);
                      if (errors.newPassword)
                        setErrors({ ...errors, newPassword: "" });
                      if (errors.general)
                        setErrors({ ...errors, general: "" });
                    }}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIconBtn}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
                {errors.newPassword && (
                  <Text style={styles.errorMsgText}>{errors.newPassword}</Text>
                )}

                {/* Password Requirements */}
                <View style={styles.requirementsContainer}>
                  <Text style={styles.requirementsTitle}>
                    Password Requirements
                  </Text>
                  <RequirementItem
                    met={hasMinLength}
                    label="At least 8 characters"
                  />
                  <RequirementItem
                    met={hasUppercase}
                    label="At least 1 uppercase letter (A-Z)"
                  />
                  <RequirementItem
                    met={hasNumber}
                    label="At least 1 number (0-9)"
                  />
                </View>

                {/* Confirm Password */}
                <View
                  style={[
                    styles.inputBox,
                    errors.confirmPassword ? styles.inputError : null,
                  ]}
                >
                  <TextInput
                    style={styles.textInput}
                    placeholder="Confirm New Password"
                    placeholderTextColor="#6b7280"
                    secureTextEntry={!showConfirm}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (errors.confirmPassword)
                        setErrors({ ...errors, confirmPassword: "" });
                    }}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirm(!showConfirm)}
                    style={styles.eyeIconBtn}
                  >
                    <Ionicons
                      name={showConfirm ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <Text style={styles.errorMsgText}>
                    {errors.confirmPassword}
                  </Text>
                )}

                {/* Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    { opacity: allRequirementsMet ? 1 : 0.6 },
                  ]}
                  activeOpacity={0.9}
                  onPress={handleResetPassword}
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
                          Reset Password
                        </Text>
                        <Ionicons
                          name="lock-closed-outline"
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
              /* Success */
              <View style={styles.successContainer}>
                <View style={styles.successIconContainer}>
                  <Ionicons
                    name="checkmark-circle"
                    size={40}
                    color="#34c759"
                  />
                </View>

                <Text style={styles.successTitle}>Password Reset!</Text>
                <Text style={styles.successSubtitle}>
                  Your password has been changed successfully.{"\n"}
                  You can now login with your new password.
                </Text>

                {/* Back to Login */}
                <TouchableOpacity
                  style={styles.loginBtn}
                  activeOpacity={0.9}
                  onPress={() => router.replace("/")}
                >
                  <LinearGradient
                    colors={AppColors.gradientBtn as any}
                    style={styles.loginBtnGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons
                      name="log-in-outline"
                      size={18}
                      color="#fff"
                    />
                    <Text style={styles.loginBtnText}>Back to Login</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
