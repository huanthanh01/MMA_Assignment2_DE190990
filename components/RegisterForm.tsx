import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { TextInput, Button, HelperText, Text, useTheme as usePaperTheme } from "react-native-paper";
import { AppColors } from "../constants/colors";
import { registerUser } from "../utils/database";
import { styles } from "./styles/RegisterForm.styles";

interface RegisterFormProps {
  onRegisterSuccess: (fullname: string) => void;
  onSocialLogin: (platform: string) => void;
  onToggleLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegisterSuccess,
  onSocialLogin,
  onToggleLogin,
}) => {
  const theme = usePaperTheme();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fullname?: string;
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!fullname.trim()) newErrors.fullname = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsLoading(true);
      setErrors({});

      await new Promise((resolve) => setTimeout(resolve, 50));

      try {
        const result = await registerUser(
          fullname.trim(),
          email.trim().toLowerCase(),
          username.trim(),
          password
        );

        if (result.success) {
          onRegisterSuccess(fullname.trim());
          setFullname("");
          setEmail("");
          setUsername("");
          setPassword("");
          setConfirmPassword("");
          setErrors({});
        } else {
          setErrors({ general: result.error || "Registration failed" });
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
      <Text variant="headlineSmall" style={styles.formTitle}>Create Account</Text>
      <Text variant="bodyMedium" style={styles.formSubtitle}>Join us and start your journey</Text>

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

      {/* Full Name */}
      <TextInput
        mode="outlined"
        label="Full Name"
        value={fullname}
        onChangeText={(text) => {
          setFullname(text);
          if (errors.fullname) setErrors({ ...errors, fullname: "" });
        }}
        error={!!errors.fullname}
        left={<TextInput.Icon icon="card-account-details-outline" />}
        style={{ marginBottom: errors.fullname ? 0 : 12 }}
      />
      {errors.fullname && <HelperText type="error" visible={!!errors.fullname}>{errors.fullname}</HelperText>}

      {/* Email */}
      <TextInput
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email) setErrors({ ...errors, email: "" });
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        error={!!errors.email}
        left={<TextInput.Icon icon="email-outline" />}
        style={{ marginBottom: errors.email ? 0 : 12 }}
      />
      {errors.email && <HelperText type="error" visible={!!errors.email}>{errors.email}</HelperText>}

      {/* Username */}
      <TextInput
        mode="outlined"
        label="Username"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          if (errors.username) setErrors({ ...errors, username: "" });
        }}
        autoCapitalize="none"
        error={!!errors.username}
        left={<TextInput.Icon icon="account-outline" />}
        style={{ marginBottom: errors.username ? 0 : 12 }}
      />
      {errors.username && <HelperText type="error" visible={!!errors.username}>{errors.username}</HelperText>}

      {/* Password */}
      <TextInput
        mode="outlined"
        label="Password"
        value={password}
        secureTextEntry={!showPassword}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) setErrors({ ...errors, password: "" });
        }}
        autoCapitalize="none"
        error={!!errors.password}
        left={<TextInput.Icon icon="lock-outline" />}
        right={<TextInput.Icon icon={showPassword ? "eye-off-outline" : "eye-outline"} onPress={() => setShowPassword(!showPassword)} />}
        style={{ marginBottom: errors.password ? 0 : 12 }}
      />
      {errors.password && <HelperText type="error" visible={!!errors.password}>{errors.password}</HelperText>}

      {/* Confirm Password */}
      <TextInput
        mode="outlined"
        label="Confirm Password"
        value={confirmPassword}
        secureTextEntry={!showPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
        }}
        autoCapitalize="none"
        error={!!errors.confirmPassword}
        left={<TextInput.Icon icon="lock-check-outline" />}
        style={{ marginBottom: errors.confirmPassword ? 0 : 12 }}
      />
      {errors.confirmPassword && <HelperText type="error" visible={!!errors.confirmPassword}>{errors.confirmPassword}</HelperText>}

      {/* Submit Button */}
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
            icon={() => <Ionicons name="person-add-outline" size={18} color="#fff" />}
            style={{ width: '100%', height: '100%', justifyContent: 'center' }}
          >
            Sign Up
          </Button>
        </LinearGradient>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text variant="labelSmall" style={styles.dividerText}>or sign up with</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Social Signup Icons */}
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
