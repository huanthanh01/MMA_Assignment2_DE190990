import { StyleSheet } from "react-native";
import { AppColors } from "../../constants/colors";

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 100,
  },
  sidebarContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 280,
    backgroundColor: "#fff",
    zIndex: 101,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  profileSection: {
    padding: 24,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppColors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: AppColors.primary,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: "700",
    color: AppColors.textDark,
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    color: AppColors.textMuted,
    fontWeight: "500",
  },
  menuSection: {
    padding: 16,
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 16,
    color: AppColors.textDark,
    flex: 1,
  },
  logoutBtn: {
    marginTop: "auto",
    marginBottom: 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ef4444",
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  logoutText: {
    color: "#ef4444",
  },
});
