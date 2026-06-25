import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { TextInput, Button, Checkbox, HelperText, Text, useTheme as usePaperTheme } from "react-native-paper";
import { AppColors } from "../constants/colors";
import { User } from "../models/types";
import { loginUser } from "../utils/database";
import { styles } from "./styles/LoginForm.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../constants/ThemeContext";

interface LoginFormProps {
  onLoginSuccess: (user: User) => void;
  onSocialLogin: (platform: string) => void;
  onToggleSignUp?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onSocialLogin,
  onToggleSignUp,
}) => {
  const { isDark, setTheme } = useTheme();
  const theme = usePaperTheme();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    general?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsLoading(true);
      setErrors({});

      await new Promise((resolve) => setTimeout(resolve, 50));

      try {
        const result = await loginUser(username.trim(), password);

        if (result.success && result.user) {
          if (rememberMe) {
            await AsyncStorage.setItem("saved_username", username.trim());
            await AsyncStorage.setItem("saved_password", password);
            await AsyncStorage.setItem("saved_timestamp", Date.now().toString());
          } else {
            await AsyncStorage.removeItem("saved_username");
            await AsyncStorage.removeItem("saved_password");
            await AsyncStorage.removeItem("saved_timestamp");
          }
          onLoginSuccess(result.user);
          setUsername("");
          setPassword("");
          setErrors({});
        } else {
          setErrors({ general: result.error || "Login failed" });
        }
      } catch (error) {
        setErrors({ general: "An unexpected error occurred" });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.formContent}>
      <Text variant="headlineSmall" style={styles.formTitle}>Welcome Back</Text>
      <Text variant="bodyMedium" style={styles.formSubtitle}>
        Sign in to your account to continue
      </Text>

      {/* General Error Message */}
      {errors.general && (
        <View
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderRadius: 10,
            padding: 12,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: "rgba(239, 68, 68, 0.3)",
          }}
        >
          <Text style={{ color: "#ef4444", fontSize: 13, fontWeight: "600", textAlign: "center" }}>
            ⚠️ {errors.general}
          </Text>
        </View>
      )}

      {/* Username Input */}
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

      {/* Password Input */}
      <TextInput
        mode="outlined"
        label="Password"
        value={password}
        secureTextEntry={!showPassword}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) setErrors({ ...errors, password: "" });
          if (errors.general) setErrors({ ...errors, general: "" });
        }}
        autoCapitalize="none"
        error={!!errors.password}
        left={<TextInput.Icon icon="lock-outline" />}
        right={<TextInput.Icon icon={showPassword ? "eye-off-outline" : "eye-outline"} onPress={() => setShowPassword(!showPassword)} />}
        style={{ marginBottom: errors.password ? 0 : 12 }}
      />
      {errors.password && <HelperText type="error" visible={!!errors.password}>{errors.password}</HelperText>}

      {/* Options Row */}
      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={styles.rememberMeBtn}
          onPress={() => setRememberMe(!rememberMe)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={rememberMe ? "checkmark-circle" : "ellipse-outline"}
            size={22}
            color={rememberMe ? AppColors.primary : "rgba(255, 255, 255, 0.7)"}
            style={{ marginRight: 8 }}
          />
          <Text variant="bodyMedium" style={[styles.rememberText, { color: "#e5e7eb" }]}>Remember me</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/verify-account" as any)}>
          <Text variant="bodySmall" style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Theme Selector */}
      <View style={styles.themeRow}>
        <Text style={styles.themeText}>Theme</Text>
        <View style={styles.themeSelector}>
          <TouchableOpacity
            style={[styles.themeBtn, !isDark && styles.themeBtnActive]}
            onPress={() => setTheme(false)}
            activeOpacity={0.8}
          >
            <Ionicons name="sunny-outline" size={14} color={!isDark ? "#fff" : "#9ca3af"} />
            <Text style={[styles.themeBtnText, !isDark && { color: "#fff" }]}>Light</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeBtn, isDark && styles.themeBtnActive]}
            onPress={() => setTheme(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="moon-outline" size={14} color={isDark ? "#fff" : "#9ca3af"} />
            <Text style={[styles.themeBtnText, isDark && { color: "#fff" }]}>Dark</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.submitBtn}
        activeOpacity={0.9}
        onPress={handleSubmit}
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
            onPress={handleSubmit} 
            loading={isLoading} 
            disabled={isLoading}
            labelStyle={{ color: '#fff', fontSize: 15, fontWeight: '600' }}
            icon={() => <Ionicons name="log-in-outline" size={18} color="#fff" />}
            style={{ width: '100%', height: '100%', justifyContent: 'center' }}
          >
            Login
          </Button>
        </LinearGradient>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text variant="labelSmall" style={styles.dividerText}>or login with</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Social Login Icons */}
      <View style={styles.socialRow}>
        <TouchableOpacity
          style={[styles.socialBtn, { borderColor: AppColors.primary + "40" }]}
          onPress={() => onSocialLogin("Google")}
        >
          <FontAwesome name="google" size={20} color={AppColors.socialGoogle} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialBtn, { borderColor: AppColors.primary + "40" }]}
          onPress={() => onSocialLogin("Facebook")}
        >
          <FontAwesome name="facebook" size={20} color={AppColors.socialFacebook} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialBtn, { borderColor: AppColors.primary + "40" }]}
          onPress={() => onSocialLogin("TikTok")}
        >
          <Ionicons name="logo-tiktok" size={20} color={AppColors.socialTiktok} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialBtn, { borderColor: AppColors.primary + "40" }]}
          onPress={() => onSocialLogin("GitHub")}
        >
          <FontAwesome name="github" size={20} color={AppColors.socialGithub} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
