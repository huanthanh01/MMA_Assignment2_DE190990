import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { AppColors } from "../constants/colors";
import { useTheme } from "../constants/ThemeContext";
import { styles } from "./styles/TaskItem.styles";
import { TaskDetailModal } from "./TaskDetailModal";
import { TaskEditModal } from "./TaskEditModal";
import { Task } from "../models/types";
import { getCountdownText, getPriorityColor, getPriorityLabel } from "../utils/taskHelpers";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onSaveEdit: (id: string, newTitle: string, newNote?: string, newSubtasks?: Task["subtasks"]) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

const TaskItemComponent: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onSaveEdit,
  onToggleSubtask,
}) => {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [now, setNow] = useState(new Date());
  const swipeableRef = useRef<Swipeable>(null);

  useEffect(() => {
    if (!task.dueDate || task.completed) return;

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [task.dueDate, task.completed]);

  const isOverdueOrNear = () => {
    if (task.completed || !task.dueDate) return false;
    const now = new Date();
    const diffMs = task.dueDate.getTime() - now.getTime();
    return diffMs < 2 * 60 * 60 * 1000;
  };

  const formatDueDate = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const warningActive = isOverdueOrNear();

  const handleToggleComplete = () => {
    onToggleComplete(task.id);
    swipeableRef.current?.close();
  };

  const handleDelete = () => {
    onDelete(task.id);
    swipeableRef.current?.close();
  };

  const renderLeftActions = () => {
    return (
      <View style={styles.leftAction}>
        <Ionicons name={task.completed ? "ellipse-outline" : "checkmark-circle-outline"} size={22} color="#fff" />
        <Text style={styles.actionText}>{task.completed ? "Pending" : "Complete"}</Text>
      </View>
    );
  };

  const renderRightActions = () => {
    return (
      <View style={styles.rightAction}>
        <Ionicons name="trash-outline" size={22} color="#fff" />
        <Text style={styles.actionText}>Delete</Text>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableLeftOpen={handleToggleComplete}
      onSwipeableRightOpen={handleDelete}
      containerStyle={styles.swipeableContainer}
    >
      <View
        style={[
          styles.taskItem,
          {
            backgroundColor: colors.card,
            borderColor: warningActive ? AppColors.error : colors.border,
            marginBottom: 0, // override margin as container style handles spacing
          },
          task.completed && styles.taskComplete,
        ]}
      >
        {warningActive && (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "rgba(239, 68, 68, 0.12)", borderRadius: 10 },
            ]}
            pointerEvents="none"
          />
        )}
        <TouchableOpacity
          style={[
            styles.checkbox,
            { borderColor: warningActive ? AppColors.error : colors.border },
            task.completed && styles.checkboxActive,
          ]}
          onPress={() => {
            setIsEditing(false);
            onToggleComplete(task.id);
          }}
          activeOpacity={0.7}
        >
          {task.completed && <Ionicons name="checkmark" size={16} color="#fff" />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.taskContent}
          activeOpacity={0.7}
          onPress={() => setIsDetailVisible(true)}
        >
          <Text
            style={[
              styles.taskTitle,
              { color: colors.text },
              task.completed && [
                styles.taskTitleComplete,
                { color: colors.textSecondary },
              ],
            ]}
          >
            {task.title}
          </Text>

          <View style={styles.metaRow}>
            {task.tags && task.tags.slice(0, 2).map((tag, idx) => (
              <View key={idx} style={[styles.tag, { backgroundColor: colors.textSecondary + "14" }]}>
                <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                  🏷️ {tag}
                </Text>
              </View>
            ))}
            {task.tags && task.tags.length > 2 && (
              <View style={[styles.tag, { backgroundColor: colors.primary + "26" }]}>
                <Text style={[styles.tagText, { color: colors.primary, fontWeight: "bold" }]}>
                  +{task.tags.length - 2}
                </Text>
              </View>
            )}

            <View
              style={[
                styles.tag,
                { backgroundColor: "transparent", borderColor: getPriorityColor(task.priority), borderWidth: 1 },
              ]}
            >
              <Text style={[styles.tagText, { color: getPriorityColor(task.priority) }]}>
                {getPriorityLabel(task.priority)}
              </Text>
            </View>

            {task.note ? (
              <View style={[styles.tag, { backgroundColor: colors.textSecondary + "14" }]}>
                <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                  📝 Note
                </Text>
              </View>
            ) : null}

            {task.dueDate ? (
              <View style={[styles.tag, warningActive && { backgroundColor: "rgba(239, 68, 68, 0.2)" }]}>
                <Text
                  style={[
                    styles.tagText,
                    { color: warningActive ? AppColors.error : colors.textSecondary },
                    warningActive && { fontWeight: "bold" },
                  ]}
                >
                  ⏰ {formatDueDate(task.dueDate)}
                </Text>
              </View>
            ) : null}

            {task.dueDate && !task.completed ? (
              <View
                style={[
                  styles.tag,
                  {
                    backgroundColor: new Date(task.dueDate).getTime() < now.getTime()
                      ? "rgba(239, 68, 68, 0.15)"
                      : colors.primary + "14",
                    borderColor: new Date(task.dueDate).getTime() < now.getTime()
                      ? AppColors.error
                      : colors.primary,
                    borderWidth: 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    {
                      color: new Date(task.dueDate).getTime() < now.getTime()
                        ? AppColors.error
                        : colors.primary,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  ⏳ {getCountdownText(task.dueDate, task.completed, now)}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Subtask Progress Bar */}
          {task.subtasks && task.subtasks.length > 0 && (
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${(task.subtasks.filter((s) => s.completed).length / task.subtasks.length) * 100}%`,
                      backgroundColor: AppColors.success,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressBarLabel, { color: colors.textSecondary }]}>
                ✅ {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.actions}>
          {!task.completed && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="pencil-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionBtn} onPress={() => onDelete(task.id)}>
            <Ionicons name="trash-outline" size={20} color={AppColors.error} />
          </TouchableOpacity>
        </View>

        {/* Task Detail Modal Component */}
        <TaskDetailModal
          task={task}
          visible={isDetailVisible}
          onClose={() => setIsDetailVisible(false)}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onToggleSubtask={onToggleSubtask}
        />

        {/* Task Edit Modal Component */}
        <TaskEditModal
          task={task}
          visible={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={onSaveEdit}
        />
      </View>
    </Swipeable>
  );
};

export const TaskItem = React.memo(TaskItemComponent);
