import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  detailModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  detailModalContent: {
    width: "100%",
    maxWidth: 500,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.15)",
    paddingBottom: 12,
  },
  detailHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    lineHeight: 28,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  detailLabel: {
    width: 100,
    fontSize: 13,
    fontWeight: "bold",
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  statusValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    flex: 1,
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
  detailFooter: {
    flexDirection: "column",
    gap: 10,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.15)",
    paddingTop: 16,
  },
  footerBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  footerBtnFull: {
    width: "100%",
  },
  detailFooterSecondaryRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  footerBtnHalf: {
    flex: 1,
  },
  footerBtnText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  noTagsText: {
    fontStyle: "italic",
    fontSize: 12,
  },
  detailNoteRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 4,
  },
  detailNoteText: {
    textAlign: "left",
    lineHeight: 20,
  },
  emptyNoteBox: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  emptyNoteText: {
    fontSize: 13,
    fontStyle: "italic",
  },
  editFormContent: {
    gap: 16,
    paddingBottom: 10,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "bold",
  },
  textInputSingle: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 14,
  },
  textInputMulti: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 100,
    textAlignVertical: "top",
    fontSize: 14,
  },
  errorTextText: {
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 4,
  },
  closeBtnPadding: {
    padding: 4,
  },
  checklistSection: {
    marginTop: 4,
    marginBottom: 12,
  },
  checklistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  checklistTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  checklistProgress: {
    fontSize: 12,
    fontWeight: "600",
  },
  checklistProgressBarBg: {
    height: 5,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 10,
  },
  checklistProgressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  subtaskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    gap: 10,
  },
  subtaskCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  subtaskCheckboxActive: {
    borderWidth: 0,
  },
  subtaskTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
  },
  subtaskTitleDone: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  emptyChecklistBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  emptyChecklistText: {
    fontSize: 13,
    fontStyle: "italic",
  },
});
