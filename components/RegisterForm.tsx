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

      // Allow the UI to render the loading spinner before synchronous bcrypt blocks the JS thread
      await new Promise((resolve) => setTimeout(resolve, 50));

      try {
        // Register user into SQLite with bcryptjs hashed password
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
          // Show specific error (e.g. "Username already exists")
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
      <Text style={styles.formTitle}>Create Account</Text>
      <Text style={styles.formSubtitle}>Join us and start your journey</Text>

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

      {/* Full Name */}
      <View
        style={[styles.inputBox, errors.fullname ? styles.inputError : null]}
      >
        <TextInput
          style={styles.textInput}
          placeholder="Full Name"
          placeholderTextColor="#6b7280"
          value={fullname}
          onChangeText={(text) => {
            setFullname(text);
            if (errors.fullname) setErrors({ ...errors, fullname: "" });
          }}
        />
        <Ionicons
          name="card-outline"
          size={20}
          color="#6b7280"
          style={styles.inputIcon}
        />
      </View>
      {errors.fullname && (
        <Text style={styles.errorMsgText}>{errors.fullname}</Text>
      )}

      {/* Email */}
      <View style={[styles.inputBox, errors.email ? styles.inputError : null]}>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor="#6b7280"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors({ ...errors, email: "" });
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
      {errors.email && <Text style={styles.errorMsgText}>{errors.email}</Text>}

      {/* Username */}
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

      {/* Password */}
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

      {/* Confirm Password */}
      <View
        style={[
          styles.inputBox,
          errors.confirmPassword ? styles.inputError : null,
        ]}
      >
        <TextInput
          style={styles.textInput}
          placeholder="Confirm Password"
          placeholderTextColor="#6b7280"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword)
              setErrors({ ...errors, confirmPassword: "" });
          }}
          autoCapitalize="none"
        />
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#6b7280"
          style={styles.inputIcon}
        />
      </View>
      {errors.confirmPassword && (
        <Text style={styles.errorMsgText}>{errors.confirmPassword}</Text>
      )}

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
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View style={styles.btnContent}>
              <Text style={styles.submitBtnText}>Sign Up</Text>
              <Ionicons
                name="person-add-outline"
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
        <Text style={styles.dividerText}>or sign up with</Text>
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
