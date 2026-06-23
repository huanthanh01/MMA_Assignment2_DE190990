import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // ==========================================
  // AUTH STYLES (LOGIN & REGISTER)
  // ==========================================
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
  },
  keyboardView: {
    width: "100%",
    height: "100%",
  },
  authScroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  bgShape: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.35,
  },
  bgShape1: {
    width: 320,
    height: 320,
    backgroundColor: "#764ba2",
    top: -80,
    left: -80,
  },
  bgShape2: {
    width: 250,
    height: 250,
    backgroundColor: "#f5576c",
    bottom: -60,
    right: -60,
  },
  bgShape3: {
    width: 180,
    height: 180,
    backgroundColor: "#4facfe",
    bottom: "30%",
    left: -40,
  },
  authCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "rgba(22, 23, 34, 0.96)",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  authCardLarge: {
    maxWidth: 860,
    flexDirection: "row",
    height: 600,
  },
  brandPanel: {
    width: "100%",
    minHeight: 260, // Changed from fixed 180px to minHeight to fit all content on mobile
  },
  brandPanelLarge: {
    width: "45%",
    height: "100%",
  },
  formPanel: {
    width: "100%",
    padding: 24,
  },
  formPanelLarge: {
    width: "55%",
    justifyContent: "center",
    padding: 36,
  },

  // ==========================================
  // HOME SCREEN STYLES (LOGGED IN)
  // ==========================================
  homeContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  homeScroll: {
    flexGrow: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalOverlayLarge: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    width: "100%",
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  modalContentLarge: {
    width: 600,
    borderRadius: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalHeaderBar: {
    width: 40,
    height: 5,
    backgroundColor: "rgba(128, 128, 128, 0.3)",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 16,
  },
});
