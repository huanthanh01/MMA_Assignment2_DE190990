import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AppColors } from "../constants/colors";
import { styles } from "./styles/BrandPanel.styles";

interface BrandPanelProps {
  isSignUp: boolean;
  onToggle: () => void;
}

export const BrandPanel: React.FC<BrandPanelProps> = ({
  isSignUp,
  onToggle,
}) => {
  return (
    <LinearGradient
      colors={AppColors.gradientOverlay as any}
      style={styles.brandGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.brandContent}>
        <View style={styles.brandIconWrapper}>
          <Ionicons name="code-slash" size={32} color="#fff" />
        </View>
        <Text style={styles.brandTitle}>Todo App</Text>
        <Text style={styles.brandTagline}>Planning your life</Text>

        <Text style={styles.brandQuestion}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
        </Text>
        <TouchableOpacity
          style={styles.brandToggleBtn}
          activeOpacity={0.8}
          onPress={onToggle}
        >
          <Text style={styles.brandToggleText}>
            {isSignUp ? "Login" : "Sign Up"}
          </Text>
          <Ionicons
            name={isSignUp ? "arrow-back" : "arrow-forward"}
            size={18}
            color="#fff"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};
