import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../constants/ThemeContext";
import { AppColors } from "../constants/colors";
import { Task, User } from "../models/types";
import { TaskList } from "./TaskList";
import { styles } from "./styles/Dashboard.styles";

interface DashboardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onNavigateToCreate: () => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  currentUser?: User | null;
  onToggleComplete?: (id: string) => void;
  onDeleteTask?: (id: string) => void;
  onSaveEdit?: (id: string, newTitle: string, newNote?: string, newSubtasks?: Task["subtasks"]) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  tasks,
  setTasks,
  onNavigateToCreate,
  onToggleSubtask,
  currentUser,
  onToggleComplete,
  onDeleteTask,
  onSaveEdit,
}) => {
  const { colors } = useTheme();

  // Statistics calculations
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const incompleteTasksCount = tasks.filter((t) => !t.completed).length;
  
  const now = new Date();
  const overdueTasksCount = tasks.filter(
    (t) => !t.completed && t.dueDate && new Date(t.dueDate) < now
  ).length;

  const displayName = currentUser?.fullname || "User";

  const listHeader = (
    <>
      {/* Welcome Message */}
      <View style={styles.welcomeSection}>
        <Text style={[styles.welcomeTitle, { color: colors.text }]}>
          Welcome, {displayName}! 👋
        </Text>
        <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
          Here is a summary of your planning status for today.
        </Text>
      </View>

      {/* Stats Cards Grid */}
      <View style={styles.statsGrid}>
        {/* Total Tasks Card */}
        <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statsCardHeader}>
            <View style={[styles.statsIconWrapper, { backgroundColor: colors.primary + "26" }]}>
              <Ionicons name="list-outline" size={20} color={colors.primary} />
            </View>
          </View>
          <Text style={[styles.statsValue, { color: colors.text }]}>{totalTasksCount}</Text>
          <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Total Tasks</Text>
        </View>

        {/* Completed Card */}
        <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statsCardHeader}>
            <View style={[styles.statsIconWrapper, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
              <Ionicons name="checkmark-done-circle-outline" size={20} color={AppColors.success} />
            </View>
          </View>
          <Text style={[styles.statsValue, { color: colors.text }]}>{completedTasksCount}</Text>
          <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Completed</Text>
        </View>

        {/* Pending Card */}
        <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statsCardHeader}>
            <View style={[styles.statsIconWrapper, { backgroundColor: "rgba(245, 158, 11, 0.15)" }]}>
              <Ionicons name="time-outline" size={20} color={AppColors.warning} />
            </View>
          </View>
          <Text style={[styles.statsValue, { color: colors.text }]}>{incompleteTasksCount}</Text>
          <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Pending</Text>
        </View>

        {/* Overdue Card */}
        <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statsCardHeader}>
            <View style={[styles.statsIconWrapper, { backgroundColor: "rgba(245, 87, 108, 0.15)" }]}>
              <Ionicons name="alert-circle-outline" size={20} color={AppColors.error} />
            </View>
          </View>
          <Text style={[styles.statsValue, { color: colors.text }]}>{overdueTasksCount}</Text>
          <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Overdue</Text>
        </View>
      </View>

      {/* CTA: Create Task Button */}
      <TouchableOpacity
        style={styles.ctaButton}
        activeOpacity={0.9}
        onPress={onNavigateToCreate}
      >
        <LinearGradient
          colors={colors.gradientBtn as any}
          style={styles.ctaGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.ctaText}>Create Task</Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container}>
      {/* Task List Component */}
      <View style={{ flex: 1 }}>
        <TaskList
          tasks={tasks}
          setTasks={setTasks}
          onNavigateToCreate={onNavigateToCreate}
          onToggleSubtask={onToggleSubtask}
          onToggleComplete={onToggleComplete}
          onDeleteTask={onDeleteTask}
          onSaveEdit={onSaveEdit}
          ListHeaderComponent={listHeader}
        />
      </View>
    </View>
  );
};
