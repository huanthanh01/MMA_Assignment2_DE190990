import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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

      // Allow the UI to render the loading spinner before synchronous bcrypt blocks the JS thread
      await new Promise((resolve) => setTimeout(resolve, 50));

      try {
        // Authenticate against SQLite database using bcryptjs
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
      <Text style={styles.formTitle}>Welcome Back</Text>
      <Text style={styles.formSubtitle}>
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
          <Text
            style={{
              color: "#ef4444",
              fontSize: 13,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            ⚠️ {errors.general}
          </Text>
        </View>
      )}

      {/* Username Input */}
      <View
        style={[styles.inputBox, errors.username ? styles.inputError : null]}
      >
        <TextInput
          style={styles.textInput}
          placeholder="Username"
          placeholderTextColor="#6b7280"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            if (errors.username) setErrors({ ...errors, username: "" });
            if (errors.general) setErrors({ ...errors, general: "" });
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

      {/* Password Input */}
      <View
        style={[styles.inputBox, errors.password ? styles.inputError : null]}
      >
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor="#6b7280"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors({ ...errors, password: "" });
            if (errors.general) setErrors({ ...errors, general: "" });
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
      {errors.password && (
        <Text style={styles.errorMsgText}>{errors.password}</Text>
      )}

      {/* Options Row */}
      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={styles.rememberMeBtn}
          onPress={() => setRememberMe(!rememberMe)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && <Ionicons name="checkmark" size={12} color="#fff" />}
          </View>
          <Text style={styles.rememberText}>Remember me</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Theme Selector */}
      <View style={styles.themeRow}>
        <Text style={styles.themeText}>Default Theme</Text>
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
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View style={styles.btnContent}>
              <Text style={styles.submitBtnText}>Login</Text>
              <Ionicons
                name="log-in-outline"
                size={18}
                color="#fff"
                style={{ marginLeft: 6 }}
              />
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or login with</Text>
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
          <FontAwesome
            name="facebook"
            size={20}
            color={AppColors.socialFacebook}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialBtn, { borderColor: AppColors.primary + "40" }]}
          onPress={() => onSocialLogin("TikTok")}
        >
          <Ionicons
            name="logo-tiktok"
            size={20}
            color={AppColors.socialTiktok}
          />
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
