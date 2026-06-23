import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AppColors } from "../constants/colors";
import { useTheme } from "../constants/ThemeContext";
import { styles } from "./styles/TaskInput.styles";
import { useTaskForm } from "../controllers/useTaskForm";
import { TaskDateTimePicker } from "./TaskDateTimePicker";
import { Subtask } from "../models/types";

interface TaskInputProps {
  onAddTask: (taskData: {
    title: string;
    tags: string[];
    priority: "High" | "Medium" | "Low";
    startDate?: Date;
    dueDate?: Date;
    subtasks?: Subtask[];
  }) => void;
  suggestedTags: string[];
  setSuggestedTags: React.Dispatch<React.SetStateAction<string[]>>;
  onClose?: () => void;
}

const DEFAULT_TAGS = ["Work", "Study", "Personal", "Badminton 🏸"];
const PRIORITIES: ("High" | "Medium" | "Low")[] = ["High", "Medium", "Low"];

export const TaskInput: React.FC<TaskInputProps> = ({
  onAddTask,
  suggestedTags,
  setSuggestedTags,
  onClose,
}) => {
  const { colors } = useTheme();
  const {
    inputText,
    tags,
    customTagInput,
    selectedPriority,
    startDate,
    dueDate,
    note,
    subtasks,
    subtaskInput,
    errors,
    handleTitleChange,
    addTag,
    removeTag,
    handleDeleteSuggestedTag,
    handleAddCustomTag,
    setCustomTagInput,
    setSelectedPriority,
    setStartDate,
    setDueDate,
    setNote,
    addSubtask,
    removeSubtask,
    setSubtaskInput,
    handleAdd,
  } = useTaskForm({ onAddTask, suggestedTags, setSuggestedTags });

  return (
    <View
      style={[
        styles.inputContainer,
        { backgroundColor: colors.card, borderColor: colors.border },
        onClose && { borderWidth: 0, shadowOpacity: 0, elevation: 0, padding: 0, marginBottom: 0 }
      ]}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Create New Task</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={{ padding: 4 }} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Task Title Row */}
      <View style={[styles.titleInputRow, { borderColor: errors.title ? AppColors.error : colors.border }]}>
        <TextInput
          style={[styles.titleInput, { color: colors.text }]}
          placeholder="Task title..."
          placeholderTextColor={colors.textSecondary}
          value={inputText}
          onChangeText={handleTitleChange}
          onSubmitEditing={handleAdd}
        />
      </View>
      {errors.title ? (
        <Text style={{ color: AppColors.error, fontSize: 11, marginTop: -4, marginBottom: 12, marginLeft: 4, fontWeight: "600" }}>
          ⚠️ {errors.title}
        </Text>
      ) : null}

      {/* Task Note Row */}
      <View style={[styles.noteInputRow, { borderColor: colors.border }]}>
        <TextInput
          style={[styles.noteInput, { color: colors.text }]}
          placeholder="Add notes or description..."
          placeholderTextColor={colors.textSecondary}
          value={note}
          onChangeText={setNote}
          multiline={true}
          numberOfLines={3}
        />
      </View>

      {/* Subtasks Section */}
      <View style={styles.subtaskSection}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Subtasks:</Text>
        <View style={[styles.subtaskInputRow, { borderColor: colors.border }]}>
          <TextInput
            style={[styles.subtaskTextInput, { color: colors.text }]}
            placeholder="Add a subtask..."
            placeholderTextColor={colors.textSecondary}
            value={subtaskInput}
            onChangeText={setSubtaskInput}
            onSubmitEditing={addSubtask}
          />
          <TouchableOpacity style={styles.subtaskAddBtn} onPress={addSubtask}>
            <Ionicons name="add-circle-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
        {subtasks.length > 0 && (
          <View style={styles.subtaskList}>
            {subtasks.map((st, idx) => (
              <View
                key={st.id}
                style={[
                  styles.subtaskItem,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <Ionicons name="ellipse-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.subtaskItemText, { color: colors.text, marginLeft: 8 }]}>
                  {st.title}
                </Text>
                <TouchableOpacity
                  style={styles.subtaskRemoveBtn}
                  onPress={() => removeSubtask(st.id)}
                >
                  <Ionicons name="close-circle" size={18} color={AppColors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Tags option row */}
      <View style={styles.optionRow}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Tags:</Text>
        
        {/* Suggestion tags */}
        <View style={styles.chipContainer}>
          {suggestedTags.map((tag) => {
            const isSelected = tags.includes(tag);
            const isDefault = DEFAULT_TAGS.includes(tag);
            return (
              <View
                key={tag}
                style={[
                  styles.chip,
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? colors.primary : "transparent",
                    paddingRight: isDefault ? 12 : 6,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => (isSelected ? removeTag(tag) : addTag(tag))}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: isSelected ? "#fff" : colors.textSecondary },
                      isSelected && { fontWeight: "bold" },
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
                {!isDefault && (
                  <TouchableOpacity
                    onPress={() => handleDeleteSuggestedTag(tag)}
                    style={{ marginLeft: 6 }}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="close-circle"
                      size={16}
                      color={isSelected ? "#fff" : AppColors.error}
                    />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {/* Custom Tag Input */}
        <View style={[styles.tagInputContainer, { borderColor: colors.border }]}>
          <TextInput
            style={[styles.tagInput, { color: colors.text }]}
            placeholder="Add custom tag..."
            placeholderTextColor={colors.textSecondary}
            value={customTagInput}
            onChangeText={setCustomTagInput}
            onSubmitEditing={handleAddCustomTag}
          />
          <TouchableOpacity style={styles.tagAddBtn} onPress={handleAddCustomTag}>
            <Ionicons name="add-circle-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Active tags badges */}
        {tags.length > 0 && (
          <View style={styles.activeTagsList}>
            {tags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[styles.activeTagBadge, { borderColor: colors.primary, backgroundColor: colors.primary + "14" }]}
                onPress={() => removeTag(tag)}
              >
                <Text style={[styles.activeTagText, { color: colors.primary }]}>
                  #{tag}
                </Text>
                <Ionicons name="close-circle" size={14} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Priority Option Row */}
      <View style={styles.optionRow}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Priority:</Text>
        <View style={styles.chipContainer}>
          {PRIORITIES.map((p) => {
            const label = p === "High" ? "High 🔥" : p === "Medium" ? "Medium ⚡" : "Low 🌱";
            const activeColor =
              p === "High" ? AppColors.error : p === "Medium" ? AppColors.warning : AppColors.success;
            const isSelected = selectedPriority === p;

            return (
              <TouchableOpacity
                key={p}
                style={[
                  styles.chip,
                  { borderColor: colors.border },
                  isSelected && { backgroundColor: activeColor, borderColor: activeColor },
                ]}
                onPress={() => setSelectedPriority(p)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: colors.textSecondary },
                    isSelected && { color: "#fff", fontWeight: "bold" },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Start Date Option Row */}
      <TaskDateTimePicker
        label="Start Date:"
        value={startDate}
        onChange={setStartDate}
        error={errors.startDate}
      />

      {/* End Deadline Option Row */}
      <TaskDateTimePicker
        label="End Deadline:"
        value={dueDate}
        onChange={setDueDate}
        error={errors.dueDate}
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: "transparent", overflow: "hidden", borderWidth: 0 }]}
        onPress={handleAdd}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={colors.gradientBtn as any}
          style={{
            width: "100%",
            height: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 6,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Create Task</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};
