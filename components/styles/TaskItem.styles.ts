import { StyleSheet } from "react-native";
import { AppColors } from "../../constants/colors";

export const styles = StyleSheet.create({
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  taskComplete: {
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: AppColors.success,
    borderColor: AppColors.success,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  taskTitleComplete: {
    textDecorationLine: "line-through",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
    alignItems: "center",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginLeft: 8,
  },
  actionBtn: {
    padding: 4,
  },
  editInput: {
    fontSize: 16,
    fontWeight: "600",
    borderBottomWidth: 1,
    borderBottomColor: AppColors.primary,
    paddingVertical: 2,
    marginRight: 10,
  },
  progressBarContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressBarLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  swipeableContainer: {
    marginBottom: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  leftAction: {
    flex: 1,
    backgroundColor: AppColors.success,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 24,
    borderRadius: 12,
  },
  rightAction: {
    flex: 1,
    backgroundColor: AppColors.error,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 24,
    borderRadius: 12,
  },
  actionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});
