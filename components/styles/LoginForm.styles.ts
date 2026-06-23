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
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  inputError: {
    borderColor: AppColors.error,
  },
  textInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    height: "100%",
  },
  inputIcon: {
    marginLeft: 10,
  },
  eyeIconBtn: {
    padding: 6,
  },
  errorMsgText: {
    color: AppColors.error,
    fontSize: 11,
    marginTop: -8,
    marginBottom: 10,
    paddingLeft: 4,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  rememberMeBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  rememberText: {
    fontSize: 13,
    color: "#9ca3af",
  },
  forgotText: {
    fontSize: 13,
    color: AppColors.primary,
    fontWeight: "500",
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
  themeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  themeText: {
    fontSize: 13,
    color: "#e5e7eb",
    fontWeight: "500",
  },
  themeSelector: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    padding: 3,
  },
  themeBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    gap: 4,
  },
  themeBtnActive: {
    backgroundColor: AppColors.primary,
  },
  themeBtnText: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "500",
  },
});
