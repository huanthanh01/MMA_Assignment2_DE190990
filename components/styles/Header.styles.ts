import { StyleSheet } from "react-native";
import { AppColors } from "../../constants/colors";

export const styles = StyleSheet.create({
  header: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 50,
  },
  headerInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: 1120,
    width: "100%",
    alignSelf: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuIconBtn: {
    marginRight: 4,
    padding: 4,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  logoIconText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.textDark,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  navLinks: {
    flexDirection: "row",
    gap: 20,
    marginRight: 10,
  },
  navLink: {
    fontSize: 13,
    color: AppColors.textMuted,
    fontWeight: "500",
  },
  navLinkActive: {
    fontSize: 13,
    color: AppColors.primary,
    fontWeight: "600",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  logoutText: {
    fontSize: 12,
    color: AppColors.primary,
    fontWeight: "500",
  },
  themeToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
