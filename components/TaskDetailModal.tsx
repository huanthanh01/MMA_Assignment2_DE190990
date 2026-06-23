import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppColors } from "../constants/colors";
import { useTheme } from "../constants/ThemeContext";
import { styles } from "./styles/TaskDetailModal.styles";
import { Task } from "../models/types";
import { getCountdownText, getPriorityColor, getPriorityLabel } from "../utils/taskHelpers";

interface TaskDetailModalProps {
  task: Task;
  visible: boolean;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  visible,
  onClose,
  onToggleComplete,
  onDelete,
  onToggleSubtask,
}) => {
  const { colors } = useTheme();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!visible || !task.dueDate || task.completed) return;

    setNow(new Date()); // reset immediately on open

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, task.dueDate, task.completed]);

  const isOverdueOrNear = () => {
    if (task.completed || !task.dueDate) return false;
    const now = new Date();
    const diffMs = task.dueDate.getTime() - now.getTime();
    return diffMs < 2 * 60 * 60 * 1000;
  };

  const warningActive = isOverdueOrNear();

  const completedSubtasksCount = task.subtasks ? task.subtasks.filter((s) => s.completed).length : 0;
  const totalSubtasksCount = task.subtasks ? task.subtasks.length : 0;
  const subtasksPercent = totalSubtasksCount > 0 ? (completedSubtasksCount / totalSubtasksCount) * 100 : 0;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.detailModalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.detailModalContent,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {/* Modal Header */}
          <View style={styles.detailHeader}>
            <Text style={[styles.detailHeaderTitle, { color: colors.text }]}>
              Task Details
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Task Title */}
          <Text style={[styles.detailTitle, { color: colors.text }]}>
            {task.title}
          </Text>

          {/* Task Details Info Rows */}
          <View style={styles.detailSection}>
            {/* Status */}
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Status:
              </Text>
              <View style={styles.statusValueContainer}>
                <Ionicons
                  name={task.completed ? "checkmark-circle" : "ellipse-outline"}
                  size={18}
                  color={task.completed ? AppColors.success : AppColors.warning}
                />
                <Text
                  style={[
                    styles.detailValue,
                    {
                      color: task.completed ? AppColors.success : AppColors.warning,
                      fontWeight: "600",
                    },
                  ]}
                >
                  {task.completed ? "Completed" : "Pending"}
                </Text>
              </View>
            </View>

            {/* Priority */}
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Priority:
              </Text>
              <View
                style={[
                  styles.tag,
                  {
                    backgroundColor: "transparent",
                    borderColor: getPriorityColor(task.priority),
                    borderWidth: 1,
                    alignSelf: "flex-start",
                  },
                ]}
              >
                <Text style={[styles.tagText, { color: getPriorityColor(task.priority), fontWeight: "bold" }]}>
                  {getPriorityLabel(task.priority)}
                </Text>
              </View>
            </View>

            {/* Start Date */}
            {task.startDate && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Start Date:
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  📅 {new Date(task.startDate).toLocaleString()}
                </Text>
              </View>
            )}

            {/* End Deadline */}
            {task.dueDate && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Deadline:
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: warningActive ? AppColors.error : colors.text, fontWeight: warningActive ? "bold" : "normal" },
                  ]}
                >
                  ⏰ {new Date(task.dueDate).toLocaleString()} {warningActive && "(Overdue / Due soon)"}
                </Text>
              </View>
            )}

            {/* Countdown */}
            {task.dueDate && !task.completed && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Time Left:
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    {
                      color: new Date(task.dueDate).getTime() < now.getTime() ? AppColors.error : colors.primary,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  ⏳ {getCountdownText(task.dueDate, task.completed, now)}
                </Text>
              </View>
            )}

            {/* Created At */}
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Created At:
              </Text>
              <Text style={[styles.detailValue, { color: colors.textSecondary }]}>
                🕒 {new Date(task.createdAt).toLocaleString()}
              </Text>
            </View>

            {/* Tags */}
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Tags:
              </Text>
              <View style={styles.detailTagsContainer}>
                {task.tags && task.tags.length > 0 ? (
                  task.tags.map((tag, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.tag,
                        {
                          backgroundColor: colors.textSecondary + "14",
                        },
                      ]}
                    >
                      <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                        🏷️ {tag}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={[styles.noTagsText, { color: colors.textSecondary }]}>
                    No tags
                  </Text>
                )}
              </View>
            </View>

            {/* Checklist / Subtasks */}
            {totalSubtasksCount > 0 && (
              <View style={styles.checklistSection}>
                <View style={styles.checklistHeader}>
                  <Text style={[styles.checklistTitle, { color: colors.text }]}>
                    Checklist
                  </Text>
                  <Text style={[styles.checklistProgress, { color: colors.primary }]}>
                    {completedSubtasksCount}/{totalSubtasksCount} ({Math.round(subtasksPercent)}%)
                  </Text>
                </View>
                <View style={[styles.checklistProgressBarBg, { backgroundColor: colors.border }]}>
                  <View
                    style={[
                      styles.checklistProgressBarFill,
                      {
                        width: `${subtasksPercent}%`,
                        backgroundColor: AppColors.success,
                      },
                    ]}
                  />
                </View>
                {task.subtasks && task.subtasks.map((st) => (
                  <View
                    key={st.id}
                    style={[styles.subtaskRow, { borderBottomColor: colors.border }]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.subtaskCheckbox,
                        { borderColor: colors.border },
                        st.completed && [styles.subtaskCheckboxActive, { backgroundColor: AppColors.success }],
                      ]}
                      onPress={() => onToggleSubtask(task.id, st.id)}
                      activeOpacity={0.7}
                    >
                      {st.completed && <Ionicons name="checkmark" size={14} color="#fff" />}
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.subtaskTitle,
                        { color: colors.text },
                        st.completed && styles.subtaskTitleDone,
                      ]}
                    >
                      {st.title}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Note */}
            <View style={[styles.detailRow, styles.detailNoteRow]}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Notes:
              </Text>
              {task.note ? (
                <Text style={[styles.detailValue, styles.detailNoteText, { color: colors.text }]}>
                  📝 {task.note}
                </Text>
              ) : (
                <View
                  style={[
                    styles.emptyNoteBox,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.card,
                    },
                  ]}
                >
                  <Text style={[styles.emptyNoteText, { color: colors.textSecondary }]}>
                    No notes added yet
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Modal Actions Footer */}
          <View style={styles.detailFooter}>
            <TouchableOpacity
              style={[
                styles.footerBtn,
                styles.footerBtnFull,
                { backgroundColor: task.completed ? AppColors.warning : AppColors.success },
              ]}
              onPress={() => {
                onToggleComplete(task.id);
                onClose();
              }}
            >
              <Ionicons
                name={task.completed ? "ellipse-outline" : "checkmark-circle-outline"}
                size={16}
                color="#fff"
              />
              <Text style={[styles.footerBtnText, { color: "#fff" }]}>
                {task.completed ? "Mark Incomplete" : "Mark Complete"}
              </Text>
            </TouchableOpacity>

            <View style={styles.detailFooterSecondaryRow}>
              <TouchableOpacity
                style={[
                  styles.footerBtn,
                  styles.footerBtnHalf,
                  { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                ]}
                onPress={() => {
                  onClose();
                  onDelete(task.id);
                }}
              >
                <Ionicons name="trash-outline" size={16} color={AppColors.error} />
                <Text style={[styles.footerBtnText, { color: AppColors.error }]}>
                  Delete
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.footerBtn,
                  styles.footerBtnHalf,
                  { backgroundColor: colors.border },
                ]}
                onPress={onClose}
              >
                <Text style={[styles.footerBtnText, { color: colors.text }]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
