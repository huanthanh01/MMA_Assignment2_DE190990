import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  brandGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  brandContent: {
    alignItems: "center",
  },
  brandIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1,
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 13,
    color: "#ffffff",
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  brandQuestion: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    marginBottom: 10,
  },
  brandToggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  brandToggleText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
