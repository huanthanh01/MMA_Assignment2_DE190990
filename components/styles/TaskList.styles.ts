import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Filter row containing Status and Sort dropdowns side by side
  filterRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
    zIndex: 100, // Make sure dropdowns sit on top of content below them
  },
  categoryFiltersWrapper: {
    marginBottom: 16,
    zIndex: 90, // Keep tag filter under status/sort but above list
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dropdownContainer: {
    flex: 1,
    position: "relative",
  },
  dropdownTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  dropdownTriggerText: {
    fontSize: 13,
    fontWeight: "600",
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    borderRadius: 10,
    borderWidth: 1.5,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 1000,
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 13,
  },
  taskList: {
    gap: 12,
    marginBottom: 40,
    zIndex: 1, // Make sure list doesn't overlap dropdowns
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  emptyStateText: {
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
  },
});
