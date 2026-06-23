import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AppColors } from "../constants/colors";
import { useTheme } from "../constants/ThemeContext";
import { styles } from "./styles/Header.styles";

interface HeaderProps {
  isLargeScreen: boolean;
  onLogout: () => void;
  currentScreen?: "dashboard" | "createTask";
  onBack?: () => void;
  onOpenSidebar?: () => void;
  onReload?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isLargeScreen,
  onLogout,
  currentScreen,
  onBack,
  onOpenSidebar,
  onReload,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
      <View style={styles.headerInner}>
        {/* Brand Logo */}
        <View style={styles.logoRow}>
          {currentScreen === "createTask" && onBack ? (
            <TouchableOpacity onPress={onBack} style={{ marginRight: 8, padding: 4 }}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onOpenSidebar} style={styles.menuIconBtn}>
              <Ionicons name="menu" size={28} color={colors.text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            onPress={onReload}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={colors.gradientBtn as any}
              style={styles.logoIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.logoIconText}>T</Text>
            </LinearGradient>
            <Text style={[styles.logoText, { color: colors.text }]}>TodoApp</Text>
          </TouchableOpacity>
        </View>

        {/* Header Right Actions */}
        <View style={styles.headerActions}>
          {isLargeScreen && (
            <View style={styles.navLinks}>
              <Text style={[styles.navLinkActive, { color: colors.primary }]}>Stories</Text>
              <Text style={[styles.navLink, { color: colors.textSecondary }]}>AI Companion</Text>
              <Text style={[styles.navLink, { color: colors.textSecondary }]}>Contact</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
