import { StyleSheet } from "react-native";

export const ITEM_HEIGHT = 44;
export const VISIBLE_ITEMS = 5;
export const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  overlayTouch: {
    flex: 1,
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingBottom: 32,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  previewContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  previewText: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  wheelsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  separator: {
    justifyContent: "center",
    alignItems: "center",
    width: 20,
  },
  separatorDateText: {
    fontSize: 20,
  },
  separatorTimeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  column: {
    overflow: "hidden",
  },
  selectionBand: {
    position: "absolute",
    left: 4,
    right: 4,
    borderRadius: 10,
    borderWidth: 1.5,
    zIndex: 1,
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    textAlign: "center",
  },
  itemSelected: {
    fontWeight: "700",
    fontSize: 18,
  },
  itemUnselected: {
    fontWeight: "400",
    fontSize: 15,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
  confirmBtn: {
    flex: 1.5,
    height: 48,
    borderRadius: 14,
    overflow: "hidden",
  },
  confirmBtnGradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderRadius: 14,
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
