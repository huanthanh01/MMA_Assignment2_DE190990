import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../constants/ThemeContext";
import { User } from "../models/types";
import { styles } from "./styles/Sidebar.styles";

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
}

const { width } = Dimensions.get("window");

export const Sidebar: React.FC<SidebarProps> = ({
  isVisible,
  onClose,
  user,
  onLogout,
}) => {
  const { isDark, toggleTheme, colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = React.useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 250,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false);
      });
    }
  }, [isVisible, slideAnim, opacityAnim]);

  return (
    <Modal
      visible={showModal}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: opacityAnim }]} />
      </TouchableWithoutFeedback>

      {/* Sidebar Content */}
      <Animated.View
        style={[
          styles.sidebarContainer,
          {
            backgroundColor: colors.card,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={[styles.profileSection, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={{ position: "absolute", top: 48, right: 20, padding: 8, zIndex: 10 }}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color={colors.textSecondary || "#6b7280"} />
          </TouchableOpacity>

          <View style={[styles.avatarContainer, { backgroundColor: colors.primary + "20" }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
          <Text style={[styles.usernameText, { color: colors.text }]}>
            {user?.username || "Guest User"}
          </Text>
          <Text style={styles.roleText}>Member</Text>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)" }]}
            onPress={() => {
              onClose();
              router.push("/profile" as any);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="person-outline" size={22} color={colors.primary} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>
              My Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)" }]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isDark ? "sunny" : "moon"}
              size={22}
              color={isDark ? "#fbbf24" : colors.primary}
            />
            <Text style={[styles.menuItemText, { color: colors.text }]}>
              {isDark ? "Light Mode" : "Dark Mode"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.menuItem, styles.logoutBtn, { borderColor: "#ef4444" }]}
          onPress={() => {
            onClose();
            onLogout();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color="#ef4444" />
          <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};
