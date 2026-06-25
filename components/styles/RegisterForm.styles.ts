import { StyleSheet } from "react-native";
import { AppColors } from "../../constants/colors";

export const styles = StyleSheet.create({
  formContent: {
    width: "100%",
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 20,
    fontWeight: "300",
  },
  submitBtn: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  btnGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  dividerText: {
    fontSize: 12,
    color: "#6b7280",
    marginHorizontal: 12,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  socialBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  toggleText: {
    fontSize: 13,
    color: "#9ca3af",
  },
  toggleLink: {
    fontSize: 13,
    color: AppColors.primary,
    fontWeight: "600",
  },
});
