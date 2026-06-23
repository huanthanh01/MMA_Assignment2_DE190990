import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppColors } from "../constants/colors";
import { useTheme } from "../constants/ThemeContext";
import { styles } from "./styles/TaskDetailModal.styles";
import { Task } from "../models/types";

interface TaskEditModalProps {
  task: Task;
  visible: boolean;
  onClose: () => void;
  onSave: (id: string, newTitle: string, newNote?: string, newSubtasks?: Task["subtasks"]) => void;
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({
  task,
  visible,
  onClose,
  onSave,
}) => {
  const { colors } = useTheme();
  const [title, setTitle] = useState(task.title);
  const [note, setNote] = useState(task.note || "");
  const [subtasks, setSubtasks] = useState<Task["subtasks"]>(task.subtasks || []);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [error, setError] = useState("");

  // Sync state with task when modal opens
  useEffect(() => {
    if (visible) {
      setTitle(task.title);
      setNote(task.note || "");
      setSubtasks(task.subtasks || []);
      setSubtaskInput("");
      setError("");
    }
  }, [visible, task]);

  const handleSave = () => {
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }
    onSave(task.id, title.trim(), note.trim(), subtasks && subtasks.length > 0 ? subtasks : undefined);
    onClose();
  };

  const addSubtask = () => {
    const text = subtaskInput.trim();
    if (!text) return;
    const newSubtask = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
      title: text,
      completed: false,
    };
    setSubtasks((prev) => [...(prev || []), newSubtask]);
    setSubtaskInput("");
  };

  const removeSubtask = (id: string) => {
    setSubtasks((prev) => (prev ? prev.filter((s) => s.id !== id) : []));
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.detailModalOverlay}
      >
        <View style={[styles.detailModalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.detailHeader}>
            <Text style={[styles.detailHeaderTitle, { color: colors.text }]}>Edit Task 📝</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtnPadding} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.editFormContent}>
            {/* Title Section */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Task Title:
              </Text>
              <TextInput
                style={[
                  styles.textInputSingle,
                  {
                    color: colors.text,
                    borderColor: error ? AppColors.error : colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (text.trim()) setError("");
                }}
                placeholder="Task title..."
                placeholderTextColor={colors.textSecondary}
              />
              {error ? (
                <Text style={[styles.errorTextText, { color: AppColors.error }]}>
                  ⚠️ {error}
                </Text>
              ) : null}
            </View>

            {/* Subtasks Section */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Subtasks / Checklist:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1.5,
                  borderRadius: 10,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  paddingLeft: 12,
                  paddingRight: 6,
                  height: 46,
                }}
              >
                <TextInput
                  style={{ flex: 1, fontSize: 14, color: colors.text, padding: 0 }}
                  placeholder="Add a subtask..."
                  placeholderTextColor={colors.textSecondary}
                  value={subtaskInput}
                  onChangeText={setSubtaskInput}
                  onSubmitEditing={addSubtask}
                />
                <TouchableOpacity style={{ padding: 6 }} onPress={addSubtask}>
                  <Ionicons name="add-circle-outline" size={22} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {subtasks && subtasks.length > 0 && (
                <View style={{ gap: 6, marginTop: 6 }}>
                  {subtasks.map((st) => (
                    <View
                      key={st.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: colors.border,
                        backgroundColor: colors.background,
                      }}
                    >
                      <Ionicons
                        name={st.completed ? "checkmark-circle" : "ellipse-outline"}
                        size={16}
                        color={st.completed ? AppColors.success : colors.textSecondary}
                      />
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 13,
                          fontWeight: "500",
                          color: colors.text,
                          marginLeft: 8,
                          textDecorationLine: st.completed ? "line-through" : "none",
                          opacity: st.completed ? 0.6 : 1,
                        }}
                      >
                        {st.title}
                      </Text>
                      <TouchableOpacity
                        style={{ padding: 4, marginLeft: 6 }}
                        onPress={() => removeSubtask(st.id)}
                      >
                        <Ionicons name="close-circle" size={18} color={AppColors.error} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Note Section */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Notes (Optional):
              </Text>
              <TextInput
                style={[
                  styles.textInputMulti,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
                value={note}
                onChangeText={setNote}
                placeholder="Add notes or description..."
                placeholderTextColor={colors.textSecondary}
                multiline={true}
                numberOfLines={4}
              />
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.detailFooter}>
            <TouchableOpacity
              style={[styles.footerBtn, styles.footerBtnFull, { backgroundColor: colors.primary }]}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
              <Text style={[styles.footerBtnText, { color: "#fff" }]}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.footerBtn, styles.footerBtnFull, { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.border }]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Ionicons name="close-circle-outline" size={18} color={colors.textSecondary} />
              <Text style={[styles.footerBtnText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
